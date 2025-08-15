'use client';

const TestimonialSection = () => {
  const testimonials = [
    {
      content: "这个在线字幕翻译工具帮我节省了大量时间。我是一名视频编辑，经常需要处理不同语言的字幕。这个工具的翻译质量非常高，特别是使用OpenAI翻译服务时，翻译结果几乎可以媲美专业人工翻译。",
      author: "张明",
      role: "视频编辑师",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      content: "作为一名外语学习者，我经常使用这个工具来翻译外语电影的字幕，帮助我学习新语言。界面简洁易用，翻译速度快，而且完全免费，真的很棒！",
      author: "李娜",
      role: "语言学习者",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      content: "我们公司需要将培训视频翻译成多种语言，这个工具极大地简化了我们的工作流程。支持多种翻译服务的选择也很贴心，可以根据不同需求选择最合适的翻译引擎。",
      author: "王强",
      role: "企业培训经理",
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
  ];

  return (
    <section className="py-16 bg-secondary-50" id="testimonials">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            用户评价
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            看看其他用户如何评价我们的在线字幕翻译工具
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card bg-white rounded-lg shadow-md p-6 relative">
              <div className="absolute -top-4 left-6">
                <svg width="40" height="40" className="text-primary-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
                </svg>
              </div>
              <div className="pt-6">
                <p className="text-secondary-600 mb-6">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-900">{testimonial.author}</p>
                    <p className="text-sm text-secondary-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
