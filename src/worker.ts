import { handle } from 'hono/vercel'
import { app } from './app'

export default handle(app)

// 导出类型
export type AppType = typeof app
