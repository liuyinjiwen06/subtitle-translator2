import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '在线字幕翻译 | Online Subtitle Translator',
  description: '免费在线SRT字幕翻译工具，支持Google和OpenAI翻译服务，轻松翻译字幕文件。',
  keywords: 'online subtitle translator, translate srt, 在线字幕翻译, srt翻译, 字幕翻译工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      </head>
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container py-4">
            <h1 className="text-2xl font-bold text-primary-600">在线字幕翻译</h1>
            <p className="text-secondary-500">轻松翻译SRT字幕文件</p>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-secondary-100 py-6 mt-12">
          <div className="container text-center text-secondary-500 text-sm">
            <p>© {new Date().getFullYear()} 在线字幕翻译 | Online Subtitle Translator</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
