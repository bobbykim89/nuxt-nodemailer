import { AuthController } from './auth/auth.controller'
import { TokenController } from './token/token.controller'
import { UserController } from './user/user.controller'

const authController = new AuthController()
const tokenController = new TokenController()
const userController = new UserController()

export { authController, tokenController, userController }
