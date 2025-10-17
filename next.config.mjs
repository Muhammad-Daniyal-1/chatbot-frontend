/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      `${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`,
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://localhost:3000; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://localhost:3000;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
