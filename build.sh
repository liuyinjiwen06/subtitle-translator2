#!/bin/bash

# Cloudflare Pages 构建脚本
echo "开始构建字幕翻译工具..."

# 安装依赖
npm install

# 构建项目
npm run build

# 检查构建结果
if [ -d "out" ]; then
    echo "构建成功！输出目录: out/"
    ls -la out/
else
    echo "构建失败！"
    exit 1
fi

echo "构建完成！"
