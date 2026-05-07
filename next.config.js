/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },

          // ✅ ADD THIS (CSP FIX)
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              font-src 'self' *.vercel.com *.gstatic.com vercel.live https://*.vercel-storage.com;
              img-src 'self' data: blob: lh3.googleusercontent.com;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;