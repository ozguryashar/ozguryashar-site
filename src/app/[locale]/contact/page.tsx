import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ subject?: string }>;
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("meta_desc"),
  };
}

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { subject } = await searchParams;
  const t = await getTranslations({ locale, namespace: "contact" });

  const subjects = t.raw("subjects") as { value: string; label: string }[];
  const validation = t.raw("validation") as Record<string, string>;

  const formLabels = {
    formTitle: t("form_title"),
    name: t("name"),
    namePlaceholder: t("name_placeholder"),
    company: t("company"),
    companyPlaceholder: t("company_placeholder"),
    email: t("email"),
    emailPlaceholder: t("email_placeholder"),
    subject: t("subject"),
    subjectPlaceholder: t("subject_placeholder"),
    subjects,
    message: t("message"),
    messagePlaceholder: t("message_placeholder"),
    send: t("send"),
    sending: t("sending"),
    successTitle: t("success_title"),
    successDesc: t("success_desc"),
    successReset: t("success_reset"),
    error: t("error"),
    validation,
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/3 top-0 h-48 w-48 rounded-full bg-highlight/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-20">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">İletişim</p>
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">{t("title")}</h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-highlight" />
          <p className="mt-4 text-base text-white/60">{t("subtitle")}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30L1440 30L1440 10C1200 30 960 0 720 10C480 20 240 0 0 10L0 30Z" fill="#FAFAFA" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">

          {/* ── Form (left) ───────────────────────────────────────────────── */}
          <div className="flex-[3] min-w-0">
            <ContactForm
              labels={formLabels}
              defaultSubject={subject ?? ""}
            />
          </div>

          {/* ── Info (right) ──────────────────────────────────────────────── */}
          <aside className="lg:w-72 shrink-0 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("info_title")}
            </p>

            {/* Email */}
            <a
              href={`mailto:${t("email_value")}`}
              className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-highlight text-white shadow-sm">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  {t("email_label")}
                </p>
                <p className="text-sm font-semibold text-text-main break-all group-hover:text-primary transition-colors">{t("email_value")}</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/ozguryasar1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0077B5] to-[#005582] text-white shadow-sm">
                <LinkedInIcon size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  {t("linkedin_label")}
                </p>
                <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">{t("linkedin_value")}</p>
              </div>
            </a>

            {/* Response time */}
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/80 to-accent/40 text-text-main shadow-sm">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  {t("response_time_label")}
                </p>
                <p className="text-sm text-muted-foreground">{t("response_time")}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-highlight/80 to-highlight/40 text-white shadow-sm">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  {t("location_label")}
                </p>
                <p className="text-sm font-semibold text-text-main">{t("location")}</p>
                <p className="text-xs text-muted-foreground">{t("timezone")}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
