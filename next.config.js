/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除静态导出，支持动态功能
  // output: 'export',
  
  // 启用实验性功能
  experimental: {
    appDir: true,
  },
  
  // 图片优化
  images: {
    unoptimized: false,
  },
  
  // 环境变量
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY,
  },
}

module.exports = nextConfig
