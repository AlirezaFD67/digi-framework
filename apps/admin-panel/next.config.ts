/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/custom-ui", "@workspace/framework"],
}

export default nextConfig
