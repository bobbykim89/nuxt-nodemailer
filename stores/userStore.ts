import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserModel } from '@/server/models'
import { useCookie } from '#app'
import { type H3Error } from 'h3'
import { type AuthInput } from '@/server/controllers/auth/dto'
import { type UserInput } from '@/server/controllers/user/dto'

interface AuthToken {
  access_token: string
}

export const useUserStore = defineStore('user', () => {
  const cookie = useCookie('access_token', {
    maxAge: 604800,
    sameSite: true,
  })
  // USER: states
  const currentUser = ref<UserModel | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // USER: actions
  const authUser = async () => {
    if (!cookie.value) return
    try {
      const res = await $fetch<UserModel>('/api/auth', {
        method: 'GET',
        headers: { Authorization: cookie.value },
      })
      currentUser.value = res
      isAuthenticated.value = true
    } catch (error) {
      currentUser.value = null
      isAuthenticated.value = false
      console.error((error as H3Error).statusMessage)
    }
  }
  const getCurrentUser = async () => {
    if (!cookie.value) return
    try {
      const res = await $fetch<UserModel>('/api/auth', {
        method: 'GET',
        headers: { Authorization: cookie.value },
      })
      currentUser.value = res
      isAuthenticated.value = true
    } catch (error) {
      currentUser.value = null
      isAuthenticated.value = false
      console.error((error as H3Error).statusMessage)
    }
  }
  const loginWithCredential = async (payload: AuthInput) => {
    try {
      const res = await $fetch<AuthToken>('/api/auth', {
        method: 'POST',
        body: payload,
      })
      cookie.value = res.access_token
      await authUser()
    } catch (error) {
      currentUser.value = null
      isAuthenticated.value = false
      console.error((error as H3Error).statusMessage)
    }
  }
  const signupUser = async (payload: UserInput) => {
    try {
      const res = await $fetch<AuthToken>('/api/user', {
        method: 'POST',
        body: payload,
      })
      cookie.value = res.access_token
      await authUser()
    } catch (error) {
      currentUser.value = null
      isAuthenticated.value = false
      console.error((error as H3Error).statusMessage)
    }
  }
  const logoutUser = () => {
    cookie.value = null
    currentUser.value = null
    isAuthenticated.value = false
    console.log('logout successful')
  }
  return {
    currentUser,
    isAuthenticated,
    getCurrentUser,
    loginWithCredential,
    signupUser,
    logoutUser,
  }
})
