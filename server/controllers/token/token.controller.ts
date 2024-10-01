import { RuntimeConfig } from '@nuxt/schema'
import { useRuntimeConfig } from '#imports'
import { type UserModel, User, type TokenModel, Token } from '@/server/models'
import bcrypt from 'bcryptjs'
import type { EventHandlerRequest, H3Event } from 'h3'
import {
  createError,
  getResponseStatus,
  getResponseStatusText,
  readValidatedBody,
  setResponseStatus,
} from 'h3'
import { Model } from 'mongoose'
import { sendEmail } from '@/server/utils'
import { tokenEmailInputSchema, resetPwInputSchema } from './dto'

export class TokenController {
  private config: RuntimeConfig
  private tokenModel: Model<TokenModel>
  private userModel: Model<UserModel>
  constructor() {
    this.config = useRuntimeConfig()
    this.tokenModel = Token
    this.userModel = User
  }
  public getAllToken = async () => {
    const token = await this.tokenModel.find({})
    return token
  }
  public sendToken = async (e: H3Event<EventHandlerRequest>) => {
    const { email, url } = await readValidatedBody(
      e,
      tokenEmailInputSchema.parse
    )
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw createError({
        status: 400,
        message: 'Bad Request',
        statusMessage:
          'Bad Request: user with following email address is not found',
      })
    }
    let token = await this.tokenModel.findOne({ userId: user.id })
    if (!token) {
      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedToken = await this.hashPassword(tempPassword)
      token = await new this.tokenModel({
        userId: user.id,
        token: hashedToken,
      }).save()
    }
    const link: string = `${url}/reset/reset-password?user=${user.id}&token=${token.token}`
    await sendEmail(user.email, 'Password Reset Request', link)

    const status = getResponseStatus(e)
    const text = getResponseStatusText(e)
    return {
      status,
      message: text,
    }
  }
  public resetPasswordWithToken = async (e: H3Event<EventHandlerRequest>) => {
    const { password, token, userId } = await readValidatedBody(
      e,
      resetPwInputSchema.parse
    )
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw createError({
        status: 400,
        message: 'Not Found',
        statusMessage: 'Not Found: User not found.',
      })
    }
    const pwResetToken = await this.tokenModel.findOne({
      userId: userId,
      token,
    })
    if (!pwResetToken) {
      throw createError({
        status: 400,
        message: 'Not Found',
        statusMessage: 'Not Found: Token not found.',
      })
    }
    const hashedPassword = await this.hashPassword(password)
    user.password = hashedPassword
    await user.save()
    await pwResetToken.deleteOne()

    const status = getResponseStatus(e)
    const text = getResponseStatusText(e)
    return {
      status,
      message: text,
    }
  }
  private hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }
}
