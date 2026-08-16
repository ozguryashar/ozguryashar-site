import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const locales = ["tr", "en"];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ozguryashar.site";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTR = locale === "tr";
  const title = "Özgür Yaşar | Data & Business Intelligence";
  const description = isTR
    ? "Şirketinize özel Power BI raporları, dashboard tasarımı ve veri modelleme çözümleri. 5+ yıllık deneyim."
    : "Custom Power BI reports, dashboard design, and data modeling solutions. 5+ years of experience.";

  return {
    title: {
      default: title,
      template: "%s | Özgür Yaşar",
    },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        "tr": `${SITE_URL}/tr`,
        "en": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: isTR ? "tr_TR" : "en_US",
      url: `${SITE_URL}/${locale}`,
      siteName: "Özgür Yaşar",
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: "Özgür Yaşar — Data & Business Intelligence",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {supabaseHost && (
          <link rel="preconnect" href={`https://${supabaseHost}`} />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18392853423"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18392853423');
        `}</Script>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
