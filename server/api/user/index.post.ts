import { userController } from '@/server/controllers'

export default defineEventHandler({
  handler: eventHandler(userController.signupUser),
})
