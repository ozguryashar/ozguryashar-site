interface Props {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Schema builders ──────────────────────────────────────────────────────────

const SITE_URL = "https://ozguryashar.site";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Özgür Yaşar",
    url: SITE_URL,
    image: `${SITE_URL}/og-default.png`,
    jobTitle: "Data & Business Intelligence Specialist",
    description:
      "Custom Power BI reports, dashboard design, and data modeling solutions.",
    sameAs: ["https://linkedin.com/in/ozguryasar1"],
    email: "ozguryasar_24@hotmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
  };
}

export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Özgür Yaşar",
    url: `${SITE_URL}/${locale}`,
    description:
      locale === "tr"
        ? "Veri & İş Zekası uzmanı Özgür Yaşar'ın portfolyo sitesi."
        : "Portfolio site of Data & BI specialist Özgür Yaşar.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${locale}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostingSchema({
  title,
  slug,
  excerpt,
  coverImageUrl,
  publishedAt,
  locale,
}: {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    image: coverImageUrl ?? `${SITE_URL}/og-default.png`,
    datePublished: publishedAt ?? undefined,
    dateModified: publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: "Özgür Yaşar",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Özgür Yaşar",
      url: SITE_URL,
    },
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${locale}/blog/${slug}`,
    },
  };
}
