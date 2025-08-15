'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface TranslationProgress {
  current: number;
  total: number;
  percentage: number;
  status: 'idle' | 'uploading' | 'processing' | 'translating' | 'completed' | 'error';
  message: string;
}

const TranslatorForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [translationService, setTranslationService] = useState<'google' | 'openai' | 'mymemory'>('mymemory');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedFile, setTranslatedFile] = useState<string | null>(null);
  const [progress, setProgress] = useState<TranslationProgress>({
    current: 0,
    total: 0,
    percentage: 0,
    status: 'idle',
    message: '准备就绪'
  });
  const [isClient, setIsClient] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    try {
      const selectedFile = acceptedFiles[0];
      if (selectedFile && selectedFile.name.toLowerCase().endsWith('.srt')) {
        // 检查文件大小 (10MB限制)
        if (selectedFile.size > 10 * 1024 * 1024) {
          setError('文件大小不能超过10MB');
          return;
        }
        
        setFile(selectedFile);
        setError(null);
        setProgress({
          current: 0,
          total: 0,
          percentage: 0,
          status: 'idle',
          message: '文件已选择，准备翻译'
        });
      } else {
        setError('请上传有效的.srt字幕文件');
      }
    } catch (err) {
      console.error('文件处理错误:', err);
      setError('文件处理出错，请重试');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/srt': ['.srt'],
      'text/plain': ['.srt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (rejectedFiles) => {
      console.log('文件被拒绝:', rejectedFiles);
      setError('文件格式不支持或文件过大');
    },
  });

  const resetForm = () => {
    try {
      setFile(null);
      setError(null);
      setTranslatedFile(null);
      setProgress({
        current: 0,
        total: 0,
        percentage: 0,
        status: 'idle',
        message: '准备就绪'
      });
    } catch (err) {
      console.error('重置表单错误:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('开始提交表单...');
    console.log('文件信息:', file);
    console.log('翻译服务:', translationService);
    console.log('源语言:', sourceLanguage);
    console.log('目标语言:', targetLanguage);
    
    if (!file) {
      setError('请先上传SRT文件');
      return;
    }

    try {
      console.log('设置加载状态...');
      setIsLoading(true);
      setError(null);
      setProgress({
        current: 0,
        total: 0,
        percentage: 0,
        status: 'uploading',
        message: '正在上传文件...'
      });

      // 创建AbortController用于取消请求
      if (typeof AbortController !== 'undefined') {
        abortControllerRef.current = new AbortController();
        console.log('AbortController已创建');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('translationService', translationService);
      formData.append('sourceLanguage', sourceLanguage);
      formData.append('targetLanguage', targetLanguage);

      console.log('FormData已创建，开始发送请求...');

      // 更新进度状态
      setProgress(prev => ({
        ...prev,
        status: 'processing',
        message: '正在解析SRT文件...'
      }));

      console.log('准备发送axios请求到 /api/translate');
      console.log('请求配置:', {
        url: '/api/translate',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 300000
      });

      const response = await axios.post('/api/translate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        signal: abortControllerRef.current?.signal,
        onUploadProgress: (progressEvent) => {
          console.log('上传进度:', progressEvent);
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(prev => ({
              ...prev,
              current: progressEvent.loaded,
              total: progressEvent.total || 0,
              percentage,
              message: `上传进度: ${percentage}%`
            }));
          }
        },
        timeout: 300000, // 5分钟超时
      });

      console.log('API响应:', response);
      console.log('响应状态:', response.status);
      console.log('响应头:', response.headers);
      console.log('响应数据类型:', typeof response.data);
      console.log('响应数据大小:', response.data instanceof Blob ? response.data.size : 'N/A');

      // 更新进度状态
      setProgress(prev => ({
        ...prev,
        status: 'completed',
        message: '翻译完成！'
      }));

      // 创建下载链接
      console.log('开始创建下载链接...');
      console.log('响应数据类型:', typeof response.data);
      console.log('响应数据是否为Blob:', response.data instanceof Blob);
      if (response.data instanceof Blob) {
        console.log('Blob大小:', response.data.size);
        console.log('Blob类型:', response.data.type);
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log('创建的下载URL:', url);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `translated_${file.name}`);
      console.log('下载链接设置完成，文件名:', `translated_${file.name}`);
      
      // 存储下载链接
      setTranslatedFile(url);
      console.log('下载链接已存储到状态中');
      
      // 自动下载
      console.log('开始自动下载...');
      document.body.appendChild(link);
      link.click();
      console.log('下载链接已点击');
      
      if (link.parentNode) {
        link.parentNode.removeChild(link);
        console.log('下载链接元素已清理');
      }

      // 显示处理信息
      const processingTime = response.headers['x-processing-time'];
      const entriesCount = response.headers['x-entries-count'];
      
      if (processingTime && entriesCount) {
        setProgress(prev => ({
          ...prev,
          message: `翻译完成！共处理${entriesCount}条字幕，耗时${processingTime}ms`
        }));
      }
      
    } catch (err: any) {
      console.error('翻译过程中出错:', err);
      console.error('错误详情:', {
        name: err.name,
        message: err.message,
        code: err.code,
        response: err.response,
        request: err.request
      });
      
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        setProgress(prev => ({
          ...prev,
          status: 'error',
          message: '翻译已取消'
        }));
        setError('翻译已取消');
      } else if (err.response?.data) {
        // 尝试解析错误响应
        try {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result as string);
              setError(errorData.error || '翻译过程中出错，请稍后重试');
            } catch {
              setError('翻译过程中出错，请稍后重试');
            }
          };
          reader.readAsText(err.response.data);
        } catch {
          setError('翻译过程中出错，请稍后重试');
        }
      } else {
        setProgress(prev => ({
          ...prev,
          status: 'error',
          message: '翻译失败'
        }));
        setError('翻译过程中出错，请稍后重试');
      }
    } finally {
      console.log('设置加载状态为false...');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsLoading(false);
      setProgress(prev => ({
        ...prev,
        status: 'error',
        message: '翻译已取消'
      }));
    } catch (err) {
      console.error('取消翻译错误:', err);
    }
  };

  const languages = [
    { code: 'auto', name: '自动检测' },
    { code: 'zh', name: '中文' },
    { code: 'en', name: '英语' },
    { code: 'ja', name: '日语' },
    { code: 'ko', name: '韩语' },
    { code: 'fr', name: '法语' },
    { code: 'de', name: '德语' },
    { code: 'es', name: '西班牙语' },
    { code: 'ru', name: '俄语' },
    { code: 'it', name: '意大利语' },
    { code: 'pt', name: '葡萄牙语' },
    { code: 'ar', name: '阿拉伯语' },
    { code: 'hi', name: '印地语' },
    { code: 'th', name: '泰语' },
    { code: 'vi', name: '越南语' },
  ];

  const getProgressColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'processing':
      case 'translating':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  // 检查浏览器兼容性
  const isBrowserCompatible = () => {
    if (!isClient) return true; // 服务器端渲染时返回true
    
    try {
      return typeof File !== 'undefined' && 
             typeof FormData !== 'undefined' && 
             typeof FileReader !== 'undefined';
    } catch {
      return false;
    }
  };

  // 如果还没有客户端渲染，显示加载状态
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isBrowserCompatible()) {
    return (
      <div className="text-center p-8 bg-yellow-50 rounded-lg">
        <p className="text-yellow-700 mb-2">浏览器兼容性警告</p>
        <p className="text-sm text-yellow-600">
          您的浏览器可能不支持某些功能，建议使用最新版本的Chrome、Firefox、Safari或Edge浏览器。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 文件上传区域 */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
            ${file ? 'border-green-500 bg-green-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {file ? (
              <div>
                <p className="text-green-600 font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                {/* 添加测试按钮 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('测试文件信息:', {
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      lastModified: file.lastModified
                    });
                  }}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
                >
                  测试文件信息
                </button>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium">拖放SRT文件到此处，或点击选择文件</p>
                <p className="text-sm text-gray-500">支持.srt格式字幕文件，最大10MB</p>
              </>
            )}
          </div>
        </div>

        {/* 翻译服务选择 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">选择翻译服务</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTranslationService('google')}
              className={`btn ${
                translationService === 'google' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">Google 翻译</div>
                <div className="text-xs opacity-75">专业准确</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTranslationService('openai')}
              className={`btn ${
                translationService === 'openai' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">OpenAI 翻译</div>
                <div className="text-xs opacity-75">智能理解</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTranslationService('mymemory')}
              className={`btn ${
                translationService === 'mymemory' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">MyMemory 翻译</div>
                <div className="text-xs opacity-75">免费使用</div>
              </div>
            </button>
          </div>
        </div>

        {/* 语言选择 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700">
              源语言
            </label>
            <select
              id="sourceLanguage"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="input w-full"
            >
              {languages.map((lang) => (
                <option key={`source-${lang.code}`} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700">
              目标语言
            </label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="input w-full"
            >
              {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                <option key={`target-${lang.code}`} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 进度显示 */}
        {progress.status !== 'idle' && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{progress.message}</span>
              {progress.total > 0 && (
                <span>{progress.percentage}%</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4">
          {isLoading ? (
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary px-8 py-3 text-lg"
            >
              取消翻译
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={!file}
                className={`btn btn-primary px-8 py-3 text-lg ${
                  !file ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                开始翻译
              </button>
              {file && (
                <>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary px-6 py-3 text-lg"
                  >
                    重新选择
                  </button>
                  {/* 添加测试API连接的按钮 */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('测试API连接...');
                        const response = await fetch('/api/translate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ test: true })
                        });
                        console.log('API测试响应状态:', response.status);
                        console.log('API测试响应:', response);
                      } catch (err) {
                        console.error('API测试失败:', err);
                      }
                    }}
                    className="btn btn-secondary px-4 py-3 text-lg"
                  >
                    测试API
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* 下载链接 */}
        {translatedFile && !isLoading && (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 mb-2">翻译完成！</p>
            <div className="space-x-2">
              <a
                href={translatedFile}
                download={`translated_${file?.name}`}
                className="btn btn-primary inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                下载翻译文件
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                翻译新文件
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TranslatorForm;
