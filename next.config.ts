import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure clean server actions for Vercel deployment
  serverActions: {
    allowedOrigins: ['project-2614m.vercel.app', 'project-2614m-eqxgokoci-ed-corners-projects.vercel.app'],
  },
};

export default nextConfig;