/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态导出
  trailingSlash: true, // 添加尾部斜杠
  images: {
    unoptimized: true, // 禁用图片优化（静态导出需要）
  },
}

module.exports = nextConfig
