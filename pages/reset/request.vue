<script setup lang="ts">
const url = useRequestURL()
const emailRef = ref<string>('')

const handleSubmit = async () => {
  if (emailRef.value === '') return
  await $fetch('/api/token/send-token', {
    method: 'POST',
    body: { email: emailRef.value, url: url.origin },
  })
}
</script>

<template>
  <div class="container mx-auto">
    <h2 class="text-2xl">Request password reset</h2>
    <form
      class="flex flex-col items-start justify-center gap-4 bg-lime-200 px-4 py-6"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label for="email">Email: </label>
        <input
          type="email"
          id="email"
          v-model="emailRef"
          placeholder="email address"
        />
      </div>
      <button role="button" type="submit" class="px-3 py-2 bg-cyan-200">
        Submit
      </button>
    </form>
  </div>
</template>

<style scoped></style>
