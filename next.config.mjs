import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  output: "export",
  turbopack: {},
  allowedDevOrigins: [
    "192.168.1.8",
    "localhost",
  ],
  images: {
    unoptimized: true,
  },
};

export default withPWA({
  dest: "public",
})(nextConfig);