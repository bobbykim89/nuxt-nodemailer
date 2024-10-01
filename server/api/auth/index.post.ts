import { authController } from '@/server/controllers'

export default defineEventHandler({
  handler: eventHandler(authController.loginUser),
})
