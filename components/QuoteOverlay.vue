<!-- components/QuoteOverlay.vue -->
<template>
    <div v-if="isVisible" @click="hideQuote" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
           :class="{ 'opacity-0': isLeaving, 'opacity-100': !isLeaving }">
      </div>
      
      <!-- Quote Container -->
      <div class="relative bg-white/90 px-8 py-6 rounded-lg shadow-xl max-w-md mx-4 transform transition-all duration-300"
           :class="{ 'opacity-0 translate-y-4': isLeaving, 'opacity-100 translate-y-0': !isLeaving }">
        <p class="text-xl text-gray-800 text-center font-light italic">
          "{{ currentQuote }}"
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const isVisible = ref(false)
  const isLeaving = ref(false)
  const currentQuote = ref('')
  
  let hideTimeout
  let quoteInterval
  
  const showQuote = async () => {
    try {
      // Only fetch new quote if not currently showing one
      if (!isVisible.value) {
        const response = await $fetch('/api/quotes')
        currentQuote.value = response.quote
        isVisible.value = true
        isLeaving.value = false
  
        // Set timeout to start hiding animation
        hideTimeout = setTimeout(() => {
          hideQuote()
        }, 25000) // Hide after 25 seconds
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
  }
  
  const hideQuote = () => {
    isLeaving.value = true
    setTimeout(() => {
      isVisible.value = false
      isLeaving.value = false
    }, 300) // Match the duration of the transition
  
    // Clear the hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
  }
  
  // Show quotes periodically
  const startQuoteInterval = () => {
    // Initial delay before first quote
    setTimeout(() => {
      showQuote()
      // Show new quotes every 3-5 minutes
      quoteInterval = setInterval(() => {
        showQuote()
      }, Math.random() * 0 + 10000)
    }, 50) // Start first quote after 1 minute
  }
  
  onMounted(() => {
    startQuoteInterval()
  })
  
  onUnmounted(() => {
    if (hideTimeout) clearTimeout(hideTimeout)
    if (quoteInterval) clearInterval(quoteInterval)
  })
  </script>