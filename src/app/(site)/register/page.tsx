import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { XCircle, Users, Feather } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPageContent } from "@/lib/content";
import { getUpcomingSeminars } from "@/lib/seminars";
import { isPayPalEnabled } from "@/lib/paypal";
import { getUser } from "@/lib/user-auth";
import { WovenBorder } from "@/components/WovenBorder";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ seminar?: string; cause?: string; canceled?: string }>;
}) {
  // Registration requires an account — send anonymous visitors to sign up first,
  // then bring them back here once they have an account.
  const user = await getUser();
  if (!user) redirect("/signup?redirect=/register");

  const sp = await searchParams;
  const c = await getPageContent("register");
  const seminars = await getUpcomingSeminars();

  const options = seminars.map((s) => ({
    id: s.id,
    startDate: s.startDate.toISOString(),
    endDate: s.endDate.toISOString(),
    priceCents: s.priceCents,
  }));

  return (
    <>
      {/* Hero — dark teal band, text left, mountain/lake photo right */}
      <section>
        <WovenBorder />
        <div className="relative overflow-hidden bg-[#043331] text-cream-50">
          <div className="absolute inset-y-0 right-0 hidden w-[44%] lg:block">
            <Image
              src="/images/register-hero.jpg"
              alt="Mountain lake landscape"
              fill
              priority
              sizes="44vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #043331 0%, rgba(4,51,49,0.4) 16%, transparent 44%)",
              }}
            />
          </div>
          <div className="container-page relative py-12 lg:py-16">
            <div className="max-w-xl">
              <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
                {c.title}
              </h1>
              <p className="mt-3 font-display text-xl font-semibold uppercase tracking-wide text-gold-400">
                {c.subtitle}
              </p>
              <p className="mt-4 max-w-md text-cream-100/85">{c.intro}</p>
            </div>
          </div>
          {/* Mobile: photo below */}
          <div className="relative h-48 w-full sm:h-60 lg:hidden">
            <Image
              src="/images/register-hero.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="container-page">
          {sp.canceled && (
            <div className="mb-8 flex items-center gap-2 rounded-md bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
              <XCircle className="h-4 w-4" />
              Your payment was canceled. You can try again anytime below.
            </div>
          )}

          <div id="register" className="scroll-mt-28">
            <RegisterForm
              seminars={options}
              defaultSeminarId={sp.seminar}
              defaultCause={sp.cause}
              defaultName={user.name}
              defaultEmail={user.email}
              paymentProvider={isPayPalEnabled ? "PayPal" : null}
            />
          </div>

          {/* Bring your team */}
          <div className="mt-10 grid gap-6 rounded-lg border border-cream-300 bg-cream-200/50 p-8 lg:grid-cols-2">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Users className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display font-bold uppercase tracking-wide text-navy-600">
                  Bring Your Team
                </p>
                <p className="text-sm text-ink-soft">
                  Group rates are available for 3 or more participants.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-block font-display text-sm font-semibold uppercase tracking-wide text-rust-500 hover:text-rust-600"
                >
                  Request Group Pricing →
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4 border-cream-300 lg:border-l lg:pl-8">
              <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50 sm:grid">
                <Feather className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <p className="text-ink-soft">
                Together, we build stronger Nations through education, skills, and
                stewardship of our people, our lands, and our future.{" "}
                <span className="font-semibold text-navy-600">
                  Thank you for supporting our mission.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
