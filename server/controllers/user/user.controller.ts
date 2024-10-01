import { useRuntimeConfig } from '#imports'
import { type UserModel, User } from '@/server/models'
import { type RuntimeConfig } from 'nuxt/schema'
import bcrypt from 'bcryptjs'
import type { EventHandlerRequest, H3Event, H3EventContext } from 'h3'
import {
  createError,
  getResponseStatus,
  getResponseStatusText,
  readValidatedBody,
  setResponseStatus,
} from 'h3'
import jwt from 'jsonwebtoken'
import type { Model } from 'mongoose'
import { userInputSchema } from './dto'

export class UserController {
  private config: RuntimeConfig
  private userModel: Model<UserModel>
  constructor() {
    this.config = useRuntimeConfig()
    this.userModel = User
  }
  public signupUser = async (e: H3Event<EventHandlerRequest>) => {
    const { email, name, password } = await readValidatedBody(
      e,
      userInputSchema.parse
    )
    let user = await this.userModel.findOne({ email })
    if (user) {
      throw createError({
        status: 400,
        message: 'Bad Request',
        statusMessage:
          'Bad Request: following email address is already in use, please use different email address',
      })
    }
    await this.checkUniqueUsername(name)
    user = new this.userModel({
      name,
      email,
      password,
    })
    user.password = await this.hashPassword(password)
    await user.save()
    const payload = {
      id: user.id,
    }
    // set access token
    const accessToken = this.signToken(payload)
    const status = getResponseStatus(e)
    const text = getResponseStatusText(e)

    return {
      status,
      message: text,
      access_token: `Bearer ${accessToken}`,
    }
  }
  private hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }
  private checkUniqueUsername = async (username: string): Promise<void> => {
    const user = await this.userModel
      .find({ name: username })
      .select('-password')
    if (user.length > 0) {
      throw createError({
        status: 400,
        message: 'Bad Request',
        statusMessage: `Bad Request: username '${username}' is already in use, please use different username`,
      })
    }
  }
  public getRawCurrentUserData = async (
    ctx: H3EventContext
  ): Promise<UserModel> => {
    const user = await this.userModel.findById(ctx.user.id)
    if (!user) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'User not found',
      })
    }
    return user
  }
  public getCurrentUserData = async (
    ctx: H3EventContext
  ): Promise<UserModel> => {
    const user = await this.userModel.findById(ctx.user.id).select('-password')
    if (!user) {
      throw createError({
        status: 404,
        message: 'Not Found',
        statusMessage: 'Access denied: user not found',
      })
    }
    return user
  }
  public signToken = (payload: { id: string }) => {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '7d',
    })
  }
}
