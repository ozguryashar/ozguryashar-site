// Root layout — minimal shell required by Next.js App Router.
// Actual locale-aware layout (with lang, font, Header/Footer) lives in app/[locale]/layout.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
