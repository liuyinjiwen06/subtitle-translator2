'use client';

const HowToUseSection = () => {
  return (
    <section className="py-16 bg-secondary-50" id="how-to-use">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            如何使用在线字幕翻译工具
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            简单几步，轻松完成SRT字幕文件的翻译
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* 步骤1 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                1
              </div>
              <div className="flex-grow md:border-l-4 md:border-primary-100 md:pl-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">上传SRT字幕文件</h3>
                <p className="text-secondary-600">
                  点击上传区域或将SRT文件拖放到指定区域。我们的系统支持标准SRT格式的字幕文件，确保您的文件扩展名为.srt。上传前请确认您的字幕文件格式正确，包含时间码和对应的文本内容。
                </p>
              </div>
            </div>

            {/* 步骤2 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                2
              </div>
              <div className="flex-grow md:border-l-4 md:border-primary-100 md:pl-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">选择翻译服务</h3>
                <p className="text-secondary-600">
                  根据您的需求选择合适的翻译服务。Google翻译提供快速准确的结果，适合大多数常见语言；OpenAI翻译基于先进的AI模型，提供更自然流畅的翻译效果，特别适合复杂内容；MyMemory是免费的翻译服务，无需API密钥，适合简单的翻译需求。
                </p>
              </div>
            </div>

            {/* 步骤3 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                3
              </div>
              <div className="flex-grow md:border-l-4 md:border-primary-100 md:pl-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">设置语言选项</h3>
                <p className="text-secondary-600">
                  选择源语言（原始字幕的语言）和目标语言（您希望翻译成的语言）。如果不确定源语言，可以选择"自动检测"选项。我们支持多种语言之间的互译，包括中文、英语、日语、韩语、法语、德语、西班牙语等常用语言。
                </p>
              </div>
            </div>

            {/* 步骤4 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                4
              </div>
              <div className="flex-grow md:border-l-4 md:border-primary-100 md:pl-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">开始翻译</h3>
                <p className="text-secondary-600">
                  点击"开始翻译"按钮，系统将开始处理您的字幕文件。翻译过程中请耐心等待，处理时间取决于文件大小和所选翻译服务。翻译完成后，系统会自动为您下载翻译好的SRT文件，您也可以随时点击"重新下载翻译文件"按钮获取结果。
                </p>
              </div>
            </div>

            {/* 步骤5 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                5
              </div>
              <div className="flex-grow md:border-l-4 md:border-primary-100 md:pl-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">使用翻译后的字幕</h3>
                <p className="text-secondary-600">
                  翻译完成的SRT文件可以直接用于您的视频项目。将下载的字幕文件导入到您的视频编辑软件或媒体播放器中，即可显示翻译后的字幕。我们保留了原始SRT文件的时间轴和格式，确保字幕与视频完美同步。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;
