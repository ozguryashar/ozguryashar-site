import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/", destination: "/tr" },
      { source: "/blog", destination: "/tr/blog" },
      { source: "/blog/:slug", destination: "/tr/blog/:slug" },
      { source: "/projects", destination: "/tr/projects" },
      { source: "/projects/:slug", destination: "/tr/projects/:slug" },
      { source: "/about", destination: "/tr/about" },
      { source: "/contact", destination: "/tr/contact" },
    ];
  },
};

export default withNextIntl(nextConfig);
