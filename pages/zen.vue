<!-- pages/zen-study.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Zen Study Mode</h1>
        <p class="text-lg text-gray-600">
          Focus on your tasks, one pomodoro at a time
        </p>
      </div>

      <!-- Timer Section -->
      <div class="mb-12">
        <PomodoroTimer />
      </div>

      <!-- Task Board -->
      <TaskBoard />

      <!-- Session Summary -->
      <div
        v-if="showSummary"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Session Summary</h2>
          <div class="space-y-4">
            <p>Tasks Completed: {{ report.completedTasks }}</p>
            <p>Pomodoros Completed: {{ report.totalPomodoros }}</p>
            <p>
              Productivity Score: {{ Math.round(report.productivityScore) }}%
            </p>
          </div>
          <button
            @click="showSummary = false"
            class="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <!-- End Session Button -->
      <div class="mt-8 text-center">
        <button
          @click="endSession"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          End Session
        </button>
      </div>

      <!-- Quote Overlay -->
      <QuoteOverlay />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTaskStore } from "~/stores/taskStore";

const store = useTaskStore();
const showSummary = ref(false);
const report = computed(() => store.getSessionReport());

const endSession = () => {
  showSummary.value = true;
};
</script>
