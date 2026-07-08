import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents MIME-sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevents the site from being framed, defending against clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Enables browser's basic XSS filtering
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Controls how much referrer information is sent with requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ],
      },
    ];
  },
};

export default nextConfig;
