import { useUserStore } from '@/stores'

export default defineNuxtPlugin({
  name: 'auth-init',
  async setup(nuxtApp) {
    const userStore = useUserStore()
    nuxtApp.hook('app:created', async () => {
      await userStore.getCurrentUser()
    })
  },
})
