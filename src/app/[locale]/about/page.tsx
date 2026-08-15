import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Award, CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ locale: string }>;
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
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("meta_desc"),
  };
}

// ─── Skill bar ────────────────────────────────────────────────────────────────
function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-main">{name}</span>
        <span className="text-xs font-bold text-primary">{level}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-highlight transition-all duration-700"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

// ─── Skill group card ─────────────────────────────────────────────────────────
function SkillGroup({ title, skills }: { title: string; skills: { name: string; level: number }[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-gradient-to-b from-primary to-highlight" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{title}</h3>
      </div>
      <div className="space-y-4">
        {skills.map((s) => (
          <SkillBar key={s.name} name={s.name} level={s.level} />
        ))}
      </div>
    </div>
  );
}

// ─── Timeline entry ───────────────────────────────────────────────────────────
function TimelineEntry({
  company, role, period, bullets, isLast,
}: {
  company: string; role: string; period: string; bullets: string[]; isLast: boolean;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-primary to-highlight shadow-sm" />
        {!isLast && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-border to-transparent min-h-8" />}
      </div>
      <div className="pb-10 min-w-0">
        <span className="inline-block rounded-full bg-primary/8 border border-primary/15 px-3 py-0.5 text-xs font-bold text-primary mb-2">
          {period}
        </span>
        <h3 className="text-base font-bold text-text-main">{role}</h3>
        <p className="text-sm font-semibold text-highlight mb-3">{company}</p>
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-highlight" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Cert card ────────────────────────────────────────────────────────────────
function CertCard({ cert }: { cert: { name: string; full: string; issuer: string; year: string } }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-highlight text-white shadow-sm">
        <Award size={22} />
      </div>
      <div>
        <p className="font-bold text-text-main">{cert.name}</p>
        <p className="text-sm text-muted-foreground">{cert.full}</p>
        <p className="mt-1 text-xs font-bold text-primary">
          {cert.issuer} · {cert.year}
        </p>
      </div>
    </div>
  );
}

// ─── Why card ─────────────────────────────────────────────────────────────────
function WhyCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  const gradients = [
    "from-primary to-highlight",
    "from-highlight to-accent",
    "from-accent to-primary",
  ];
  return (
    <div className="rounded-2xl border border-border bg-white p-6 space-y-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${gradients[index % 3]}`} />
      <h3 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const [t, supabase] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    createClient(),
  ]);

  const { data: profileData } = await supabase
    .from("profile")
    .select("photo_url")
    .eq("id", 1)
    .single();

  const photoUrl = profileData?.photo_url ?? null;

  const skills = t.raw("skills") as {
    core_title: string; core: { name: string; level: number }[];
    data_title: string; data: { name: string; level: number }[];
    strategy_title: string; strategy: { name: string; level: number }[];
  };
  const experience = t.raw("experience") as {
    company: string; role: string; period: string; bullets: string[];
  }[];
  const certs = t.raw("certs") as {
    name: string; full: string; issuer: string; year: string;
  }[];
  const why = t.raw("why") as { title: string; desc: string }[];

  return (
    <div className="bg-background">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-highlight/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-16">

            {/* Avatar card */}
            <div className="shrink-0">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/30 via-highlight/20 to-primary/30 blur-xl" />
                <div className="relative h-52 w-52 rounded-3xl bg-gradient-to-br from-[#0A2647] to-primary border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-4 overflow-hidden md:h-64 md:w-64">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Özgür Yaşar"
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/60 text-3xl font-extrabold text-text-main shadow-lg select-none">
                        ÖY
                      </div>
                      <div className="relative z-10 text-center px-4">
                        <p className="text-sm font-bold text-white">Özgür Yaşar</p>
                        <p className="text-xs text-white/50 mt-1">Data & BI Specialist</p>
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6 text-center md:text-left">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                  {t("hero_title")}
                </p>
                <h1 className="text-3xl font-extrabold text-white md:text-5xl">
                  Özgür Yaşar
                </h1>
                <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-highlight md:mx-0 mx-auto" />
              </div>
              <p className="max-w-xl text-base leading-relaxed text-white/60">
                {t("bio")}
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="https://linkedin.com/in/ozguryasar1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-200"
                >
                  <LinkedInIcon size={15} />
                  {t("cta_linkedin")}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-text-main shadow-sm hover:bg-accent/90 transition-all duration-200"
                >
                  <Mail size={15} />
                  {t("cta_contact")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L1440 40L1440 15C1200 40 960 0 720 15C480 30 240 0 0 15L0 40Z" fill="#FAFAFA" />
          </svg>
        </div>
      </section>

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Uzmanlık</p>
              <h2 className="text-2xl font-extrabold text-text-main md:text-3xl">{t("skills_title")}</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-highlight" />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <SkillGroup title={skills.core_title} skills={skills.core} />
            <SkillGroup title={skills.data_title} skills={skills.data} />
            <SkillGroup title={skills.strategy_title} skills={skills.strategy} />
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE TIMELINE ───────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Kariyer</p>
            <h2 className="text-2xl font-extrabold text-text-main md:text-3xl">{t("experience_title")}</h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-highlight" />
          </div>
          <div>
            {experience.map((exp, i) => (
              <TimelineEntry
                key={i}
                company={exp.company}
                role={exp.role}
                period={exp.period}
                bullets={exp.bullets}
                isLast={i === experience.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Sertifikalar</p>
            <h2 className="text-2xl font-extrabold text-text-main md:text-3xl">{t("certs_title")}</h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-highlight" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {certs.map((cert) => (
              <CertCard key={cert.name} cert={cert} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY WORK WITH ME ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-white to-surface py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Neden Ben?</p>
            <h2 className="text-2xl font-extrabold text-text-main md:text-3xl">{t("why_title")}</h2>
            <div className="mt-2 mx-auto h-1 w-12 rounded-full bg-gradient-to-r from-primary to-highlight" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {why.map((w, i) => (
              <WhyCard key={w.title} title={w.title} desc={w.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="container relative mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            Birlikte çalışalım
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Projeniz için hemen iletişime geçin.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-bold text-text-main shadow-lg hover:bg-accent/90 transition-all duration-300 hover:-translate-y-0.5"
          >
            İletişime Geç
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
