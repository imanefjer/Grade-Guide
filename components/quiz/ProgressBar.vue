<template>
  <div class="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
    <div 
      class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
      :style="{ width: `${progress}%` }"
    />
  </div>
  <div class="flex justify-between mt-2 text-sm text-gray-500">
    <span>Question {{ current }} of {{ total }}</span>
    <span>{{ progress }}% Complete</span>
  </div>
</template>

<script setup>
const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const progress = computed(() => Math.round((props.current / props.total) * 100))
</script> 