export async function onRequestPost(context) {
  try {
    const { request } = context;
    
    // 解析FormData
    const formData = await request.formData();
    const file = formData.get('file');
    const translationService = formData.get('translationService');
    const targetLanguage = formData.get('targetLanguage');
    const sourceLanguage = formData.get('sourceLanguage');

    if (!file || !translationService || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: '缺少必要参数' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 这里可以集成您的翻译逻辑
    // 为了演示，返回一个简单的响应
    const response = {
      message: '翻译请求已接收',
      file: file.name,
      service: translationService,
      targetLang: targetLanguage,
      sourceLang: sourceLanguage || 'auto'
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );

  } catch (error) {
    console.error('翻译API错误:', error);
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
