<script setup lang="ts">
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { currentUser, isAuthenticated } = storeToRefs(userStore)
</script>

<template>
  <div class="container mx-auto">
    <h2 class="text-3xl">Main Page</h2>
    <div class="px-12 py-6">
      <div v-if="isAuthenticated">
        <p>{{ currentUser?.name }}</p>
        <p>{{ currentUser?.email }}</p>
        <button @click="userStore.logoutUser">Logout</button>
      </div>
      <div v-else>
        <p>No user found</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
