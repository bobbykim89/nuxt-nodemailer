<script setup lang="ts">
const route = useRoute()
const passwordRef = ref<string>('')
console.log(route.query.user, route.query.token)
const handleSubmit = async () => {
  const userId = route.query.user
  const token = route.query.token
  if (!userId) return
  if (!token) return
  await $fetch('/api/token/reset-password', {
    method: 'POST',
    body: { userId, token, password: passwordRef.value },
  })
}
</script>

<template>
  <div class="container mx-auto">
    <h2 class="text-2xl">Reset password</h2>
    <form
      class="flex flex-col items-start justify-center gap-4 bg-lime-200 px-4 py-6"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label for="password">Password: </label>
        <input
          type="password"
          id="password"
          v-model="passwordRef"
          placeholder="password"
        />
      </div>
      <button role="button" type="submit" class="px-3 py-2 bg-cyan-200">
        Submit
      </button>
    </form>
  </div>
</template>

<style scoped></style>
