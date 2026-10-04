/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Generate a fully static site for GitHub Pages
  output: "export",

  // GitHub Pages does not provide Next.js image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
