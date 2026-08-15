export function formatDate(
  dateStr: string | null,
  locale: string = "tr"
): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Parses HTML content, adds `id` attributes to h2/h3 headings,
 * and extracts a headings list for the Table of Contents.
 */
export function processContent(html: string): {
  processedHtml: string;
  headings: { id: string; text: string; level: number }[];
} {
  const headings: { id: string; text: string; level: number }[] = [];
  const slugCounts: Record<string, number> = {};

  const processedHtml = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi,
    (_, tag, attrs, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      // Deduplicate IDs
      if (slugCounts[slug] !== undefined) {
        slugCounts[slug]++;
        slug = `${slug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 0;
      }

      const level = parseInt(tag.slice(1));
      headings.push({ id: slug, text, level });

      // Inject id only if not already present
      const newAttrs = attrs.includes("id=")
        ? attrs
        : `${attrs} id="${slug}"`;
      return `<${tag}${newAttrs}>${inner}</${tag}>`;
    }
  );

  return { processedHtml, headings };
}
