import { type Document, Schema, model } from 'mongoose'

const modelName: string = 'user'

export interface UserModel extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const User = model<UserModel>(modelName, userSchema)
