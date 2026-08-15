import { Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import JsonLd, { personSchema, websiteSchema } from "@/components/shared/JsonLd";
import {
  BarChart3,
  LayoutDashboard,
  Database,
  LineChart,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import HomeFeaturedProjects from "@/components/projects/HomeFeaturedProjects";
import HomeLatestPosts from "@/components/blog/HomeLatestPosts";
import ProfileAvatar from "@/components/shared/ProfileAvatar";

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

// ─── Premium Data Viz Graphic ─────────────────────────────────────────────────
function DataVizGraphic() {
  return (
    <div className="relative w-full max-w-[400px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-highlight/20 to-accent/10 blur-3xl" />
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-2xl">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400/70" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <div className="h-2 w-2 rounded-full bg-green-400/70" />
          </div>
          <span className="text-[10px] font-medium text-white/40 tracking-widest uppercase">Sales Report · 2025</span>
        </div>
        {/* KPI Row */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "Gelir", val: "₺4.2M" },
            { label: "Müşteri", val: "1,240" },
            { label: "Büyüme", val: "%34" },
          ].map(({ label, val }) => (
            <div key={label} className="rounded-xl bg-white/8 p-2.5 text-center">
              <p className="text-[10px] text-white/40 mb-0.5">{label}</p>
              <p className="text-xs font-bold text-white">{val}</p>
              <p className="text-[10px] text-emerald-400">▲ YoY</p>
            </div>
          ))}
        </div>
        {/* Chart */}
        <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {[35, 70, 105, 140].map((y) => (
            <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#118DFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#118DFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2C811" />
              <stop offset="100%" stopColor="#F2C811" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {[{ x: 10, h: 80 }, { x: 65, h: 55 }, { x: 120, h: 110 }, { x: 175, h: 65 }, { x: 230, h: 125 }, { x: 285, h: 95 }].map(({ x, h }) => (
            <rect key={x} x={x} y={150 - h} width="36" height={h} rx="4" fill="url(#barGrad)" />
          ))}
          <path d="M28 115 L83 95 L138 65 L193 85 L248 38 L310 58 L310 150 L28 150 Z" fill="url(#areaGrad)" />
          <polyline points="28,115 83,95 138,65 193,85 248,38 310,58" stroke="#118DFF" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {[[28,115],[83,95],[138,65],[193,85],[248,38],[310,58]].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="5" fill="#0F3460" />
              <circle cx={cx} cy={cy} r="3" fill="#118DFF" />
            </g>
          ))}
          <rect x="208" y="12" width="80" height="28" rx="6" fill="#118DFF" />
          <text x="248" y="31" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">₺1.24M</text>
        </svg>
        <div className="mt-3 flex items-center justify-center gap-5">
          <div className="flex items-center gap-1.5"><div className="h-2 w-6 rounded-full bg-accent/70" /><span className="text-[10px] text-white/50">Satış</span></div>
          <div className="flex items-center gap-1.5"><div className="h-0.5 w-6 rounded-full bg-highlight" /><span className="text-[10px] text-white/50">Hedef</span></div>
        </div>
      </div>
      {/* Floating badges */}
      <div className="absolute -top-3 -right-3 float-anim rounded-xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md px-3 py-2 shadow-lg">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-accent" />
          <span className="text-xs font-bold text-white">+34% Büyüme</span>
        </div>
      </div>
      <div className="absolute -bottom-3 -left-3 float-anim-slow rounded-xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md px-3 py-2 shadow-lg">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span className="text-xs font-bold text-white">Veri Doğrulandı</span>
        </div>
      </div>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge: string;
  gradient: string;
}
function ServiceCard({ icon, title, desc, badge, gradient }: ServiceCardProps) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-shine gradient-border">
      <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`} />
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ${gradient}`}>
          {icon}
        </div>
        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-text-main border border-accent/20">
          {badge}
        </span>
      </div>
      <div>
        <h3 className="mb-1.5 text-sm font-bold text-text-main">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="inline-flex items-center gap-2 mb-3">
        <div className="h-px w-6 bg-gradient-to-r from-transparent to-accent" />
        <div className="h-1 w-1 rounded-full bg-accent" />
        <div className="h-px w-6 bg-gradient-to-l from-transparent to-accent" />
      </div>
      <h2 className="text-2xl font-bold text-text-main md:text-3xl tracking-tight">{title}</h2>
      <div className="mt-3 mx-auto h-1 w-12 rounded-full bg-gradient-to-r from-primary via-highlight to-accent" />
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const locale = useLocale();
  const hero = useTranslations("hero");
  const services = useTranslations("services");
  const fp = useTranslations("featured_projects");
  const lp = useTranslations("latest_posts");
  const about = useTranslations("about_teaser");
  const strip = useTranslations("contact_strip");

  const serviceCards = [
    { icon: <BarChart3 size={20} />, titleKey: "powerbi", gradient: "bg-gradient-to-br from-primary to-highlight" },
    { icon: <LayoutDashboard size={20} />, titleKey: "dashboard", gradient: "bg-gradient-to-br from-highlight to-primary" },
    { icon: <Database size={20} />, titleKey: "etl", gradient: "bg-gradient-to-br from-primary to-[#0A2647]" },
    { icon: <LineChart size={20} />, titleKey: "consulting", gradient: "bg-gradient-to-br from-[#0A2647] to-highlight" },
  ] as const;

  const aboutSkills = about.raw("skills") as string[];

  const stats = [
    { icon: <BarChart3 size={28} />, value: "150+", label: "Power BI Raporu", sublabel: "Teslim Edildi", gradient: "from-primary to-highlight" },
    { icon: <LayoutDashboard size={28} />, value: "50+", label: "Dashboard", sublabel: "Tasarlandı", gradient: "from-highlight to-[#0A2647]" },
    { icon: <Users size={28} />, value: "20+", label: "Memnun Müşteri", sublabel: "Referans Veriyor", gradient: "from-[#0A2647] to-primary" },
    { icon: <Award size={28} />, value: "7+", label: "Yıl Deneyim", sublabel: "Veri Alanında", gradient: "from-primary to-accent/80" },
  ];

  return (
    <>
      <JsonLd data={personSchema()} />
      <JsonLd data={websiteSchema(locale)} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]">
        <div className="pointer-events-none absolute inset-0 hero-grid" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-56 w-56 rounded-full bg-accent/8 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-center">
            {/* Left */}
            <div className="flex-[3] space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-glow" />
                <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">{hero("label")}</span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-[3rem]">
                <span className="block text-white/90">{hero("heading").split(",")[0]},</span>
                <span className="animated-gradient-text">{hero("heading").split(",").slice(1).join(",")}</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">{hero("subtext")}</p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <Link href="/projects" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-text-main shadow-lg btn-glow transition-all duration-300 hover:-translate-y-0.5">
                  {hero("cta_primary")} <ArrowRight size={15} />
                </Link>
                <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5">
                  {hero("cta_secondary")}
                </Link>
              </div>
              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-6 pt-1 md:justify-start">
                {[{ val: "150+", label: "Power BI" }, { val: "50+", label: "Dashboard" }, { val: "7+", label: "Yıl" }].map(({ val, label }) => (
                  <div key={label} className="text-center md:text-left">
                    <p className="text-xl font-extrabold gradient-text-gold">{val}</p>
                    <p className="text-xs text-white/45 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="flex-[2] flex justify-center md:justify-end">
              <DataVizGraphic />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 18C1200 50 960 0 720 18C480 36 240 0 0 18L0 50Z" fill="#FAFAFA" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Rakamlarla</p>
            <h2 className="text-2xl font-extrabold text-text-main md:text-3xl">Tecrübem</h2>
            <div className="mt-2 mx-auto h-1 w-12 rounded-full bg-gradient-to-r from-primary to-highlight" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(({ icon, value, label, sublabel, gradient }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Background glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-gradient-to-br ${gradient}`} />
                {/* Icon */}
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                  {icon}
                </div>
                {/* Number */}
                <p className={`text-3xl font-extrabold bg-gradient-to-br ${gradient} bg-clip-text text-transparent leading-none`}>
                  {value}
                </p>
                {/* Labels */}
                <p className="mt-1 text-sm font-bold text-text-main">{label}</p>
                <p className="text-xs text-muted-foreground">{sublabel}</p>
                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${gradient}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section className="bg-background pb-10 md:pb-14">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading title={services("title")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map(({ icon, titleKey, gradient }) => (
              <ServiceCard
                key={titleKey}
                icon={icon}
                title={services(`${titleKey}.title`)}
                desc={services(`${titleKey}.desc`)}
                badge={services(`${titleKey}.badge`)}
                gradient={gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-background pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-highlight/5 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-56 w-56 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 md:px-6">
          <SectionHeading title={fp("title")} />
          <Suspense fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                  <div className="h-44 animate-pulse bg-surface" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-16 animate-pulse rounded-full bg-border" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <HomeFeaturedProjects locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* ── LATEST BLOG POSTS ─────────────────────────────────────────────── */}
      <section className="bg-background pt-8 pb-12 md:pt-10 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading title={lp("title")} />
          <Suspense fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                  <div className="h-44 animate-pulse bg-surface" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-16 animate-pulse rounded-full bg-border" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <HomeLatestPosts locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* ── ABOUT TEASER ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-white to-surface py-12 md:py-16">
        <div className="pointer-events-none absolute left-1/3 top-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            {/* Avatar card */}
            <div className="flex-1 flex justify-center">
              <Suspense fallback={
                <div className="h-64 w-64 rounded-3xl bg-gradient-to-br from-primary to-[#0A2647] animate-pulse" />
              }>
                <ProfileAvatar />
              </Suspense>
            </div>
            {/* Text */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">{locale === "tr" ? "Hakkımda" : "About"}</p>
                <h2 className="text-2xl font-extrabold text-text-main md:text-3xl tracking-tight">Özgür Yaşar</h2>
                <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-highlight md:mx-0 mx-auto" />
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{about("bio")}</p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {aboutSkills.map((skill) => (
                  <span key={skill} className="rounded-full border border-primary/15 bg-primary/6 px-3.5 py-1 text-xs font-bold text-primary">
                    {skill}
                  </span>
                ))}
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                {about("cta").replace(" →", "")} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]" />
        <div className="absolute inset-0 hero-grid" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-56 w-56 rounded-full bg-highlight/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-56 w-56 rounded-full bg-accent/8 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 md:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-glow" />
            <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">{locale === "tr" ? "İletişim" : "Contact"}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white md:text-4xl max-w-2xl mx-auto leading-tight">{strip("title")}</h2>
          <p className="text-base text-white/60 max-w-md mx-auto">{strip("subtitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={`mailto:${strip("email_btn")}`} className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-text-main shadow-lg btn-glow transition-all duration-300 hover:-translate-y-0.5">
              <Mail size={15} /> {strip("email_btn")}
            </a>
            <a href={`tel:${strip("phone").replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5">
              <Phone size={15} /> {strip("phone")}
            </a>
            <a href="https://linkedin.com/in/ozguryasar1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5">
              <LinkedInIcon size={15} /> {strip("linkedin_label")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
