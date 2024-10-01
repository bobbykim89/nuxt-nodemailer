<script setup lang="ts">
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const inputEmailRef = ref<string>('')
const inputPasswordRef = ref<string>('')

const handleSubmit = async () => {
  await userStore.loginWithCredential({
    email: inputEmailRef.value,
    password: inputPasswordRef.value,
  })
  inputEmailRef.value = ''
  inputPasswordRef.value = ''
  router.push({ path: '/' })
}
</script>

<template>
  <div class="container mx-auto">
    <h2 class="text-2xl">Login Page</h2>
    <form
      class="flex flex-col items-start justify-center gap-4 bg-lime-200 px-4 py-6"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label for="email">Email: </label>
        <input
          type="email"
          id="email"
          v-model="inputEmailRef"
          placeholder="email address"
        />
      </div>
      <div>
        <label for="password">Password: </label>
        <input type="password" id="password" v-model="inputPasswordRef" />
      </div>
      <button role="button" type="submit" class="px-3 py-2 bg-cyan-200">
        Submit
      </button>
    </form>
  </div>
</template>

<style scoped></style>
