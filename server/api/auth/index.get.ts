import { authController } from '@/server/controllers'
import { checkAuth } from '~/server/utils'

export default defineEventHandler({
  onRequest: [defineRequestMiddleware(checkAuth)],
  handler: eventHandler(authController.getCurrentUser),
})
