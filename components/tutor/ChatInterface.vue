<template>
  <div class="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center px-8 py-6 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Study Session</h2>
          <p class="text-sm text-gray-500">Ask anything about your subject</p>
        </div>
      </div>
      <button 
        @click="clearChat" 
        class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear Chat
      </button>
    </div>

    <!-- Messages Container -->
    <div ref="messagesContainer" class="px-8 py-6 space-y-8">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="[
             'max-w-3xl mx-auto',
             message.role === 'user' ? 'ml-auto' : ''
           ]"
      >
        <div class="flex items-start gap-6">
          <div v-if="message.role !== 'user'" class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <span class="text-white font-semibold text-lg">AI</span>
          </div>
          <div :class="[
            'rounded-2xl px-8 py-6 shadow-sm max-w-[85%]',
            message.role === 'user' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto' 
              : 'bg-white text-gray-800 border border-gray-100'
          ]">
            <TutorFormattedMessage :content="message.content" />
          </div>
          <div v-if="message.role === 'user'" class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <span class="text-white font-semibold text-lg">U</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Input Area (removed sticky positioning) -->
    <div class="border-t border-gray-200 p-8 bg-gray-50 rounded-b-2xl">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col gap-4">
          <TutorFileUpload
            :is-loading="isLoading"
            :clear-files="shouldClearFiles"
            @files-selected="handleFiles"
            @files-cleared="clearFiles"
          />
          <div class="flex gap-4">
            <textarea 
              ref="textareaRef"
              v-model="userInput"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.shift.enter.prevent="newLine"
              placeholder="Type your message here... (Enter to send, Shift+Enter for new line)"
              rows="3"
              class="flex-1 resize-none rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-4 text-base shadow-sm"
              :disabled="isLoading"
            ></textarea>
            <button 
              @click="sendMessage" 
              class="self-end px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :disabled="isLoading"
            >
              <span>Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const messages = ref([{
  role: 'model',
  content: 'Hello! I\'m your AI tutor. How can I help you today?'
}])

const route = useRoute()

const userInput = ref('')
const messagesContainer = ref(null)
const textareaRef = ref(null)
const isLoading = ref(false)
const selectedFiles = ref([])
const shouldClearFiles = ref(false)

const focusInput = () => {
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() && selectedFiles.value.length === 0 || isLoading.value) return

  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('message', userInput.value.trim())
    formData.append('messages', JSON.stringify(messages.value))
    selectedFiles.value.forEach(file => {
      formData.append('files', file)
    })
    formData.append('subject', route.params.subjectID)

    const userMessage = {
      role: 'user',
      content: userInput.value.trim()
    }
    messages.value.push(userMessage)

    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: formData
    })

    messages.value.push(response)
    userInput.value = ''
    selectedFiles.value = []
    shouldClearFiles.value = true
    await nextTick()
    shouldClearFiles.value = false
  } catch (error) {
    console.error('Failed to get AI response:', error)
    messages.value.push({
      role: 'model',
      content: 'I apologize, but I encountered an error. Please try again.'
    })
  } finally {
    isLoading.value = false
  }

  await nextTick()
  focusInput()
}

const newLine = () => {
  userInput.value += '\n'
}

const handleFiles = (files) => {
  selectedFiles.value = files
}

const clearFiles = () => {
  selectedFiles.value = []
}

const clearChat = () => {
  messages.value = [{
    role: 'model',
    content: 'Hello! I\'m your AI tutor. How can I help you today?'
  }]
}

onMounted(() => {
  focusInput()
})
</script>

<style scoped>
.thinking span {
  animation: colorChange 2s infinite;
  display: inline-block;
}

@keyframes colorChange {
  0%, 100% {
    color: #7c6b9c;
  }
  20% {
    color: #8b7355;
  }
  40% {
    color: #698b69;
  }
  60% {
    color: #6e7b8b;
  }
  80% {
    color: #8b7355;
  }
}

.thinking span:nth-child(1) { animation-delay: 0.1s; }
.thinking span:nth-child(2) { animation-delay: 0.2s; }
.thinking span:nth-child(3) { animation-delay: 0.3s; }
.thinking span:nth-child(4) { animation-delay: 0.4s; }
.thinking span:nth-child(5) { animation-delay: 0.5s; }
.thinking span:nth-child(6) { animation-delay: 0.6s; }
.thinking span:nth-child(7) { animation-delay: 0.7s; }
.thinking span:nth-child(8) { animation-delay: 0.8s; }
.thinking span:nth-child(9) { animation-delay: 0.9s; }
.thinking span:nth-child(10) { animation-delay: 1.0s; }
.thinking span:nth-child(11) { animation-delay: 1.1s; }
</style>
