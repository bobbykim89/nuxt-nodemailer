import { H3Event, EventHandlerRequest } from 'h3'

export default defineEventHandler(async (e: H3Event<EventHandlerRequest>) => {
  const { user, token } = getQuery(e)
  return {
    user,
    token,
  }
})
