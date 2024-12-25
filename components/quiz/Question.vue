<template>
  <div class="space-y-6 animate-fadeIn">
    <div class="prose max-w-none">
      <h3 class="text-xl font-medium text-gray-900">
        {{ question.question }}
      </h3>
    </div>

    <div class="space-y-3">
      <button
        v-for="(option, index) in question.options"
        :key="option"
        @click="$emit('select', option)"
        :class="[
          'w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 relative overflow-hidden group',
          selectedAnswer === option
            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
        ]"
      >
        <div class="flex items-center gap-3">
          <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-current flex items-center justify-center font-medium">
            {{ ['A', 'B', 'C', 'D'][index] }}
          </span>
          <span>{{ option }}</span>
        </div>
        <div 
          class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true
  },
  selectedAnswer: {
    type: String,
    default: null
  }
})

defineEmits(['select'])
</script> 