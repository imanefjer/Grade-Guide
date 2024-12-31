<!-- components/PomodoroTimer.vue -->
<template>
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <div class="text-4xl font-bold text-center mb-4">
        {{ formatTime(timerState.timeLeft) }}
      </div>
      
      <div class="flex justify-center space-x-4 mb-6">
        <button 
          @click="toggleTimer" 
          class="px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {{ timerState.isRunning ? 'Pause' : 'Start' }}
        </button>
        <button 
          @click="resetAndToggleBreak" 
          class="px-6 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors"
        >
          {{ timerState.isBreak ? 'Start Focus' : 'Take Break' }}
        </button>
      </div>
  
      <div class="text-center text-gray-600">
        {{ timerState.isBreak ? 'Break Time!' : 'Focus Time' }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useTaskStore } from '@/stores/taskStore'
  
  const store = useTaskStore()
  const { timerState } = storeToRefs(store)
  
  let timerInterval
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  const toggleTimer = () => {
    if (timerState.value.isRunning) {
      store.pauseTimer()
      clearInterval(timerInterval)
    } else {
      store.startTimer()
      startCountdown()
    }
  }
  
  const startCountdown = () => {
    timerInterval = setInterval(() => {
      if (timerState.value.timeLeft <= 0) {
        clearInterval(timerInterval)
        store.toggleBreak()
        store.pauseTimer()
      } else {
        store.decrementTimer()
      }
    }, 1000)
  }
  
  const resetAndToggleBreak = () => {
    clearInterval(timerInterval)
    store.pauseTimer()
    store.toggleBreak()
  }
  
  onMounted(() => {
    store.resetTimer()
  })
  
  onUnmounted(() => {
    clearInterval(timerInterval)
  })
  </script>