<template>
  <div class="relative">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl">
      <div class="absolute -top-32 -right-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div class="absolute -bottom-32 -left-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Decorative grid pattern -->
    <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] rounded-2xl"></div>

    <!-- Main chat container -->
    <div class="flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 relative">
      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Interactive Learning Session</h2>
            <p class="text-sm text-gray-500">Ask questions, upload materials, and get detailed explanations</p>
          </div>
        </div>
        <button 
          @click="clearChat" 
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Chat
        </button>
      </div>

      <!-- Messages Container -->
      <div ref="messagesContainer" class="px-8 py-6 space-y-8 min-h-[400px] max-h-[600px] overflow-y-auto">
        <div v-for="(message, index) in messages" 
             :key="index" 
             class="max-w-3xl mx-auto"
             :class="[message.role === 'user' ? 'ml-auto' : '']"
        >
          <div class="flex items-start gap-4">
            <div v-if="message.role !== 'user'" class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md ai-avatar">
              <span class="text-white font-semibold text-sm">AI</span>
            </div>
            <div :class="[
              'rounded-2xl px-6 py-4 shadow-sm max-w-[85%] transition-all message-hover',
              message.role === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto shadow-lg shadow-blue-500/20' 
                : 'bg-white text-gray-800 border border-gray-100 shadow-lg shadow-gray-100/20'
            ]">
              <TutorFormattedMessage :content="message.content" :class="message.role === 'user' ? 'text-white' : ''" />
              
              <!-- Display files if present -->
              <div v-if="message.files && message.files.length > 0" class="mt-4 border-t border-white/10 pt-4">
                <div class="text-sm opacity-90 mb-2">Uploaded Files:</div>
                <div class="space-y-2">
                  <div v-for="file in message.files" :key="file.name" 
                       class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span class="truncate">{{ file.name }}</span>
                    <span class="text-xs opacity-75">({{ formatFileSize(file.size) }})</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="message.role === 'user'" class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span class="text-white font-semibold text-sm">You</span>
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="max-w-3xl mx-auto">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span class="text-white font-semibold text-sm">AI</span>
            </div>
            <div class="bg-white text-gray-800 border border-gray-100 rounded-2xl px-6 py-4 shadow-sm max-w-[85%] transition-all">
              <div class="flex items-center gap-2">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="border-t border-gray-100 p-8 bg-gray-50/50 rounded-b-2xl backdrop-blur-sm">
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
                class="flex-1 resize-none rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-4 text-base shadow-sm bg-white"
                :disabled="isLoading"
              ></textarea>
              <button 
                @click="sendMessage" 
                class="self-end px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      content: userInput.value.trim(),
      files: selectedFiles.value.map(file => ({
        name: file.name,
        size: file.size
      }))
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

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #6366f1;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: translateY(0);
  }
  40% { 
    transform: translateY(-6px);
  }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-slate-100 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
  mask-image: linear-gradient(to bottom, transparent, black, transparent);
}

/* Add subtle hover effects for messages */
.message-hover {
  transition: transform 0.2s ease-in-out;
}

.message-hover:hover {
  transform: translateY(-1px);
}

/* Add a subtle pulse animation for the AI avatar */
.ai-avatar {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
