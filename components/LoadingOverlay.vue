<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 relative">
          <div class="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        </div>
        <p class="text-gray-600 text-center">{{ message || 'Loading...' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
})
</script> 