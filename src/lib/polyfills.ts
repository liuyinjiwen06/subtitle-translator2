// 浏览器兼容性polyfills
export function ensureBrowserCompatibility() {
  // 检查并添加缺失的API
  if (typeof window !== 'undefined') {
    // 确保AbortController存在
    if (typeof AbortController === 'undefined') {
      (window as any).AbortController = class AbortController {
        signal: any;
        constructor() {
          this.signal = { aborted: false };
        }
        abort() {
          this.signal.aborted = true;
        }
      };
    }

    // 确保URL.createObjectURL存在
    if (typeof URL.createObjectURL === 'undefined') {
      (URL as any).createObjectURL = function() {
        return '#';
      };
    }

    // 确保FileReader存在
    if (typeof FileReader === 'undefined') {
      (window as any).FileReader = class FileReader {
        onload: ((this: FileReader, ev: Event) => any) | null = null;
        readAsText(blob: Blob) {
          // 简单的polyfill实现
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: this } as any);
            }
          }, 100);
        }
      };
    }
  }
}

// 检查浏览器类型
export function getBrowserInfo() {
  if (typeof window === 'undefined') return { name: 'server', version: 'unknown' };
  
  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let version = 'unknown';

  if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) version = match[1];
  } else if (userAgent.includes('Safari')) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) version = match[1];
  } else if (userAgent.includes('Edge')) {
    browserName = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    if (match) version = match[1];
  }

  return { name: browserName, version };
}

// 检查功能支持
export function checkFeatureSupport() {
  const features = {
    fileAPI: typeof File !== 'undefined',
    formData: typeof FormData !== 'undefined',
    fileReader: typeof FileReader !== 'undefined',
    abortController: typeof AbortController !== 'undefined',
    blob: typeof Blob !== 'undefined',
    url: typeof URL !== 'undefined',
  };

  return features;
}
