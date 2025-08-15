'use client';

import { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: '这个在线字幕翻译工具是免费的吗？',
      answer: '是的，我们的在线字幕翻译工具提供免费服务。您可以选择使用MyMemory翻译服务，完全免费且无需API密钥。如果您希望获得更高质量的翻译结果，也可以使用自己的Google翻译或OpenAI API密钥。'
    },
    {
      question: '支持哪些语言的翻译？',
      answer: '我们支持多种语言之间的互译，包括但不限于中文、英语、日语、韩语、法语、德语、西班牙语、俄语、意大利语和葡萄牙语等。您可以在翻译设置中选择源语言和目标语言。'
    },
    {
      question: '如何获取Google翻译或OpenAI的API密钥？',
      answer: '要获取Google翻译API密钥，您需要在Google Cloud Platform创建一个项目，启用Cloud Translation API，并生成API密钥。对于OpenAI API密钥，您需要在OpenAI官网注册账号，然后在API部分生成密钥。请注意，这些服务可能需要付费使用。'
    },
    {
      question: '翻译后的字幕文件会保持原始格式吗？',
      answer: '是的，我们的翻译系统会完整保留原始SRT文件的时间轴和格式。翻译后的字幕文件可以直接用于您的视频项目，无需额外调整时间码或格式。'
    },
    {
      question: '我的字幕文件会被保存在服务器上吗？',
      answer: '不会。我们重视用户隐私和数据安全，所有上传的字幕文件仅在翻译过程中临时存储，翻译完成后立即删除。我们不会永久存储您的任何内容或与第三方共享。'
    },
    {
      question: '翻译大型字幕文件需要多长时间？',
      answer: '翻译时间取决于文件大小、所选翻译服务和当前服务器负载。一般来说，中小型字幕文件（1小时以内的视频）通常可以在几分钟内完成翻译。对于特别大的文件，可能需要更长时间。'
    },
    {
      question: '支持哪些字幕文件格式？',
      answer: '目前我们主要支持SRT格式的字幕文件，这是最常用的字幕格式之一。我们计划在未来版本中添加对更多字幕格式的支持，如SSA/ASS、VTT等。'
    },
    {
      question: '翻译质量如何？各种翻译服务有什么区别？',
      answer: 'Google翻译提供快速且相对准确的翻译结果，适合大多数常见场景；OpenAI翻译基于先进的AI模型，提供更自然流畅的翻译，特别适合复杂内容和专业术语；MyMemory是免费的翻译服务，质量适中，适合简单的翻译需求。具体选择取决于您的需求和预算。'
    },
    {
      question: '如果翻译过程中出现错误怎么办？',
      answer: '如果翻译过程中遇到错误，系统会显示相应的错误提示。常见问题包括网络连接问题、API密钥无效或文件格式不正确等。请检查您的网络连接，确认API密钥正确，并确保上传的是有效的SRT文件。如果问题持续存在，请尝试使用不同的翻译服务或稍后再试。'
    },
    {
      question: '可以同时翻译多个字幕文件吗？',
      answer: '目前我们的系统一次只支持翻译一个字幕文件。如果您需要翻译多个文件，请逐个上传并翻译。我们计划在未来版本中添加批量翻译功能。'
    }
  ];

  return (
    <section className="py-16 bg-white" id="faq">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            常见问题解答
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            关于在线字幕翻译的常见问题和解答
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-secondary-900">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-2 pr-12">
                  <p className="text-secondary-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
