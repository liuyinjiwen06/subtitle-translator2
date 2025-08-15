# 字幕翻译工具 (Subtitle Translator)

一个基于Web的字幕文件翻译工具，支持多种翻译服务，可以处理SRT格式的字幕文件。

## 🌟 功能特点

- **多翻译服务支持**
  - Google Translate API
  - OpenAI API (GPT-3.5-turbo)
  - MyMemory 免费翻译服务

- **智能语言检测**
  - 自动识别阿拉伯语、中文、日语、韩语、俄语、英语等
  - 支持多种语言对翻译

- **文件处理能力**
  - 支持10MB以内的SRT文件
  - 可处理10-5000条字幕条目
  - 批量处理，提高翻译效率

- **用户友好界面**
  - 拖拽上传文件
  - 实时翻译进度显示
  - 响应式设计，支持移动端

## 🚀 技术栈

- **前端**: Next.js 14, React 18, Tailwind CSS
- **后端**: Next.js API Routes
- **翻译服务**: Google Translate API, OpenAI API, MyMemory API
- **文件处理**: Formidable, 自定义SRT解析器

## 📦 安装和运行

### 环境要求
- Node.js 18.0.0+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境变量配置
创建 `.env.local` 文件：
```env
# Google Translate API (可选)
GOOGLE_TRANSLATE_API_KEY=your_google_api_key

# OpenAI API (可选)
OPENAI_API_KEY=your_openai_api_key
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 使用方法

1. **上传文件**: 拖拽或选择SRT字幕文件
2. **选择服务**: 选择翻译服务（Google、OpenAI或MyMemory）
3. **设置语言**: 选择目标语言
4. **开始翻译**: 点击翻译按钮，等待完成
5. **下载结果**: 翻译完成后自动下载翻译后的SRT文件

## 🔧 配置说明

### 翻译服务配置

#### Google Translate API
- 需要Google Cloud账号和API密钥
- 支持100多种语言
- 翻译质量高，但需要付费

#### OpenAI API
- 需要OpenAI账号和API密钥
- 使用GPT-3.5-turbo模型
- 翻译质量优秀，支持上下文理解

#### MyMemory API
- 完全免费，无需API密钥
- 支持多种语言对
- 适合个人使用和小规模项目

### 性能优化设置

- **批次大小**: 默认10条/批，可根据网络情况调整
- **重试机制**: 自动重试3次，指数退避延迟
- **超时设置**: 20秒超时，适应不同网络环境

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   └── translate/     # 翻译API
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/             # React组件
│   └── TranslatorForm.tsx # 翻译表单组件
├── styles/                 # 样式文件
│   └── globals.css        # 全局样式
└── lib/                    # 工具函数
    └── polyfills.ts       # 浏览器兼容性
```

## 🐛 故障排除

### 常见问题

1. **翻译服务超时**
   - 检查网络连接
   - 尝试使用MyMemory服务
   - 调整批次大小

2. **API密钥错误**
   - 确认环境变量配置正确
   - 检查API密钥是否有效
   - 验证API配额是否充足

3. **文件上传失败**
   - 确认文件格式为SRT
   - 检查文件大小是否超过10MB
   - 验证文件编码格式

### 调试模式

启用详细日志：
- 前端：打开浏览器开发者工具
- 后端：查看终端输出

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Google Translate API](https://cloud.google.com/translate) - 翻译服务
- [OpenAI API](https://openai.com/api/) - AI翻译服务
- [MyMemory](https://mymemory.translated.net/) - 免费翻译服务
