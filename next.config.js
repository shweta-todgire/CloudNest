/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',

        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },

          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },

          {
            key: 'Content-Security-Policy',

            value: `
              default-src 'self';

              script-src
                'self'
                'unsafe-inline'
                'unsafe-eval'
                https://apis.google.com
                https://accounts.google.com
                https://www.gstatic.com
                https://www.googleapis.com;

              style-src
                'self'
                'unsafe-inline'
                https://fonts.googleapis.com;

              font-src
                'self'
                https://fonts.gstatic.com
                data:;

              img-src
                'self'
                data:
                blob:
                https:
                https://firebasestorage.googleapis.com
                https://lh3.googleusercontent.com;

              connect-src
                'self'
                https://identitytoolkit.googleapis.com
                https://securetoken.googleapis.com
                https://firestore.googleapis.com
                https://firebase.googleapis.com
                https://www.googleapis.com
                https://apis.google.com
                https://firebasestorage.googleapis.com
                wss://*.firebaseio.com;

              frame-src
                'self'
                https://accounts.google.com
                https://*.firebaseapp.com;

              object-src 'none';

              base-uri 'self';
            `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;