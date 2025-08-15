import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors({
  origin: ['*'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', message: '字幕翻译工具API' }))

// 翻译API
app.post('/api/translate', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const translationService = formData.get('translationService') as string
    const targetLanguage = formData.get('targetLanguage') as string
    const sourceLanguage = formData.get('sourceLanguage') as string

    if (!file || !translationService || !targetLanguage) {
      return c.json({ error: '缺少必要参数' }, 400)
    }

    // 这里可以调用您的翻译逻辑
    // 为了演示，返回一个简单的响应
    return c.json({
      message: '翻译请求已接收',
      file: file.name,
      service: translationService,
      targetLang: targetLanguage,
      sourceLang: sourceLanguage
    })

  } catch (error) {
    console.error('翻译API错误:', error)
    return c.json({ error: '服务器内部错误' }, 500)
  }
})

// 404处理
app.notFound((c) => c.json({ error: '接口不存在' }, 404))

export { app }
