import TranslatorForm from '@/components/TranslatorForm';
import FeatureSection from '@/components/FeatureSection';
import HowToUseSection from '@/components/HowToUseSection';
import FAQSection from '@/components/FAQSection';
import TestimonialSection from '@/components/TestimonialSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 主功能区 */}
      <section className="py-12 bg-gradient-to-b from-primary-50 to-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              在线字幕翻译工具 | Online Subtitle Translator
            </h1>
            <p className="text-xl text-secondary-600">
              快速、准确地翻译SRT字幕文件，支持多种语言和翻译服务
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <TranslatorForm />
          </div>
        </div>
      </section>

      {/* 功能特点区 */}
      <FeatureSection />

      {/* 使用指南区 */}
      <HowToUseSection />

      {/* 常见问题区 */}
      <FAQSection />

      {/* 用户评价区 */}
      <TestimonialSection />
    </div>
  );
}
