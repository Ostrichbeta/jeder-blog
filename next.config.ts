import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['react-textarea-code-editor'],
    serverExternalPackages: ["pino", "pino-pretty"]
    /* config options here */
};

export default nextConfig;
