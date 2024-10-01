<script setup lang="ts"></script>

<template>
  <div>
    <div class="flex py-2 px-4 gap-3 font-bold">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/auth/login">Login</NuxtLink>
      <NuxtLink to="/auth/signup">Signup</NuxtLink>
      <NuxtLink to="/reset/request">Request Password reset</NuxtLink>
      <NuxtLink to="/reset/reset-password">Reset Password</NuxtLink>
    </div>
    <div class="py-4">
      <slot />
    </div>
    <div class="py-2 px-4 font-bold">Footer</div>
  </div>
</template>

<style scoped></style>
