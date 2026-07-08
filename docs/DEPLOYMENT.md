# Deploying to a Linux VPS (Next.js + Prisma + MySQL)

This app is a **long-running Node server** (it uses server actions and a
`proxy.ts` auth gate, so it cannot be a static export). You run it with
`next start` behind Nginx, with MySQL as the database.

Tested against Ubuntu 22.04 / 24.04. Commands assume a `sudo`-capable user.

---

## 0. What you need

- A VPS (1 vCPU / 2 GB RAM is enough; 2 GB+ recommended for builds).
- A domain name pointed at the VPS IP (an `A` record).
- SSH access.

---

## 1. Install the system packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx

# Node.js 20 LTS (or 22) via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v      # should print v20.x (or v22.x)

# PM2 process manager (keeps the app running + restarts on reboot)
sudo npm install -g pm2
```

---

## 2. Install and secure MySQL

```bash
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
sudo mysql_secure_installation      # set a root password, answer "Y" to the hardening prompts
```

Create the database and a dedicated user:

```bash
sudo mysql
```
```sql
CREATE DATABASE ai_institute CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ai_user'@'localhost' IDENTIFIED BY 'a-strong-password-here';
GRANT ALL PRIVILEGES ON ai_institute.* TO 'ai_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> Keep MySQL bound to `localhost` (the default). The app connects locally, so
> the database never needs to be exposed to the internet.

---

## 3. Get the code

```bash
sudo mkdir -p /var/www && sudo chown $USER:$USER /var/www
cd /var/www
git clone <YOUR_REPO_URL> institution-web
cd institution-web
```

---

## 4. Create the production `.env`

```bash
cp .env.example .env
nano .env
```

Fill in **at least** these (the rest can stay blank to run in demo mode):

```env
# Database — note the URL-encoded password if it has special characters
DATABASE_URL="mysql://ai_user:a-strong-password-here@localhost:3306/ai_institute"

# REQUIRED in production — the app refuses to boot without a strong value.
# Generate one:  openssl rand -base64 32
AUTH_SECRET="paste-a-32+char-random-string-here"

# Your real public URL — used for payment redirects, sitemap, and OG tags.
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

When you're ready, also fill in the PayPal / AWS SES blocks (each is dormant
until its keys are present). PayPal's return URL is handled automatically via
`NEXT_PUBLIC_SITE_URL`, so just set `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`
(and `PAYPAL_ENV=live` for production).

> `.env` is git-ignored — create it on the server, never commit it.

---

## 5. Install deps, set up the database, and build

```bash
npm ci                 # installs deps; postinstall runs `prisma generate` (fetches the Linux engine)
npm run db:push        # creates the tables in MySQL from prisma/schema.prisma
npm run db:seed        # OPTIONAL — creates the admin user + sample seminars
npm run build          # prisma generate + next build (needs the DB reachable)
```

- `db:seed` uses `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` — change
  them first, then log in at `/admin/login` and you can remove the seed values.
- If the build runs out of memory on a 1 GB box, add swap:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
  sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```

---

## 6. Run it with PM2

```bash
pm2 start npm --name institution-web -- start   # runs `next start` on port 3000
pm2 save                                        # remember this process across reboots
pm2 startup                                     # prints a command — run it to enable boot-start
```

Useful later: `pm2 logs institution-web`, `pm2 restart institution-web`, `pm2 status`.

> By default the app listens on port **3000**. To change it, start with
> `pm2 start npm --name institution-web -- start -- -p 3001`.

---

## 7. Put Nginx in front (reverse proxy)

```bash
sudo nano /etc/nginx/sites-available/institution-web
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/institution-web /etc/nginx/sites-enabled/
sudo nginx -t          # test config
sudo systemctl reload nginx
```

---

## 8. HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot edits the Nginx config to add TLS and sets up auto-renewal. After this,
confirm `NEXT_PUBLIC_SITE_URL` in `.env` is `https://...`, then
`pm2 restart institution-web`.

---

## 9. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

(Do **not** open port 3000 — only Nginx should reach the app, over localhost.)

---

## 10. Redeploying after a code change

```bash
cd /var/www/institution-web
git pull
npm ci
npm run db:push        # only if prisma/schema.prisma changed
npm run build
pm2 restart institution-web
```

---

## Notes & gotchas

- **Node runtime required.** `proxy.ts` and server actions mean you can't
  `next export` to static hosting — you need the Node process (this guide).
- **`AUTH_SECRET`.** Missing or weak (<16 chars) → the app throws on boot in
  production. This is intentional (prevents forgeable admin sessions).
- **Prisma engine is per-platform.** The repo may contain a Windows engine
  binary under `src/generated/prisma`; `npm ci` / `npm run build` regenerate the
  Linux engine automatically, so don't copy `node_modules` or the generated
  client from a Windows machine.
- **Schema changes** use `npm run db:push` (this project doesn't use migration
  files). For a stricter production workflow you can switch to
  `prisma migrate` — generate migrations locally with `prisma migrate dev`,
  commit them, and run `prisma migrate deploy` on the server instead of
  `db:push`.
- **Backups.** Schedule a MySQL dump, e.g. a daily cron:
  ```bash
  mysqldump -u ai_user -p ai_institute > /var/backups/ai_institute_$(date +\%F).sql
  ```
- **Payment/email webhooks** must reach the public HTTPS URL, so configure them
  only after step 8.
```
