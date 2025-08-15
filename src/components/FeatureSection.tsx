'use client';

const FeatureSection = () => {
  return (
    <section className="py-16 bg-white" id="features">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            强大的在线字幕翻译功能
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            我们的在线字幕翻译工具提供多种先进功能，满足您的所有字幕翻译需求
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 功能1 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">多种翻译服务</h3>
            <p className="text-secondary-600">
              支持Google翻译、OpenAI和MyMemory等多种翻译服务，根据您的需求选择最适合的翻译引擎。Google翻译提供快速准确的结果，OpenAI提供更自然流畅的翻译，而MyMemory则完全免费。
            </p>
          </div>

          {/* 功能2 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">多语言支持</h3>
            <p className="text-secondary-600">
              支持中文、英语、日语、韩语、法语、德语、西班牙语等多种语言之间的互译，满足全球用户的字幕翻译需求。自动检测源语言功能让翻译过程更加便捷。
            </p>
          </div>

          {/* 功能3 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">保持SRT格式</h3>
            <p className="text-secondary-600">
              翻译过程中完美保留原始SRT文件的时间轴和格式，无需担心字幕同步问题。翻译后的字幕文件可以直接用于您的视频项目，无需额外调整。
            </p>
          </div>

          {/* 功能4 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">安全可靠</h3>
            <p className="text-secondary-600">
              我们重视您的隐私和数据安全，所有上传的字幕文件在翻译完成后立即删除，不会存储您的任何内容。安全的API密钥管理确保您的翻译服务凭证不会泄露。
            </p>
          </div>

          {/* 功能5 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">快速处理</h3>
            <p className="text-secondary-600">
              高效的翻译引擎和优化的处理流程，确保即使是长时间的字幕文件也能快速完成翻译。无需等待，几分钟内即可获得专业质量的翻译字幕。
            </p>
          </div>

          {/* 功能6 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">完全免费</h3>
            <p className="text-secondary-600">
              我们提供免费的字幕翻译服务，无需注册账号，无需支付费用。您可以选择使用MyMemory免费翻译服务，或者使用自己的Google或OpenAI API密钥获取更高质量的翻译结果。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
