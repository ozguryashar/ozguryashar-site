import { getRequestConfig } from "next-intl/server";

const locales = ["tr"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale;

  if (!locale || !locales.includes(locale)) {
    locale = "tr";
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
