import { tokenController } from '@/server/controllers'

export default defineEventHandler({
  handler: eventHandler(tokenController.getAllToken),
})
