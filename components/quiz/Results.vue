<template>
  <div class="space-y-8">
    <div class="text-center mb-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
      <p class="text-gray-600 mb-6">
        Your final score: {{ score }} out of {{ questions.length }}
        ({{ Math.round((score / questions.length) * 100) }}%)
      </p>
    </div>

    <div class="space-y-8">
      <div v-for="(question, index) in questions" :key="index" class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Question {{ index + 1 }}</h4>
          <p class="text-gray-800">{{ question.question }}</p>

          <div class="space-y-2">
            <div
              v-for="option in question.options"
              :key="option"
              :class="[
                'px-4 py-3 rounded-lg',
                option === question.correctAnswer
                  ? 'bg-green-50 border border-green-500 text-green-700'
                  : option === userAnswers[index]
                    ? 'bg-red-50 border border-red-500 text-red-700'
                    : 'bg-gray-50 border border-gray-200 text-gray-600'
              ]"
            >
              {{ option }}
              <span v-if="option === question.correctAnswer" class="ml-2 font-medium">
                (Correct Answer)
              </span>
              <span v-else-if="option === userAnswers[index]" class="ml-2 font-medium">
                (Your Answer)
              </span>
            </div>
          </div>

          <div class="mt-4 bg-gray-50 rounded-lg p-4 text-gray-600">
            <span class="font-medium text-gray-700">Explanation:</span>
            {{ question.explanation }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <button
        @click="$emit('retry')"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700"
      >
        Generate New Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  questions: {
    type: Array,
    required: true
  },
  userAnswers: {
    type: Array,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})

defineEmits(['retry'])
</script> 