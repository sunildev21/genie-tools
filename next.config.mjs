/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.plantuml.com',
          pathname: '/plantuml/svg/**'
        }
      ]
    }
  };
  
  export default nextConfig;
  