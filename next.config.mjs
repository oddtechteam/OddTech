// GitHub Pages serves the site from oddtechteam.github.io/OddTech, so the
// production build lives under /OddTech. Dev stays at the root.
const basePath = process.env.NODE_ENV === "production" ? "/OddTech" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: false,

  output: "export",

  basePath,

  // Plain <img> tags and data paths don't get basePath automatically; read this to prefix them.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  images: { unoptimized: true },
};

export default nextConfig;
