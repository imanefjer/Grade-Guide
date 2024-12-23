<template>
  <div class="flex flex-col h-[70vh] bg-white rounded-xl shadow-lg border border-gray-200">
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="[
             'max-w-[80%] rounded-2xl p-4',
             message.role === 'user' 
               ? 'ml-auto bg-blue-500 text-white' 
               : 'bg-gray-100 text-gray-800'
           ]">
        <TutorFormattedMessage :content="message.content" />
      </div>
      <div v-if="isLoading" class="bg-gray-100 text-gray-800 rounded-2xl p-4 max-w-[80%]">
        <p class="flex items-center space-x-1 font-medium">
          <span>T</span><span>h</span><span>i</span><span>n</span><span>k</span>
          <span>i</span><span>n</span><span>g</span><span>.</span><span>.</span><span>.</span>
        </p>
      </div>
    </div>
    
    <div class="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
      <div class="flex gap-3">
        <textarea 
          ref="textareaRef"
          v-model="userInput"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.shift.enter.prevent="newLine"
          placeholder="Type your message here..."
          rows="3"
          class="flex-1 resize-none rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
          :disabled="isLoading"
        ></textarea>
        <button 
          @click="sendMessage" 
          class="self-end px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const messages = useState('messages', () => ([
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI tutor. How can I help you today?'
  }
]))

const route = useRoute()

const userInput = ref('')
const messagesContainer = ref(null)
const textareaRef = ref(null)
const isLoading = ref(false)

const focusInput = () => {
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  isLoading.value = true

  try {
    const userMessage = {
      role: 'user',
      content: userInput.value.trim()
    }
    messages.value.push(userMessage)

    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value,
        subject: route.params.subjectID
      }
    })

    messages.value.push(response)
    userInput.value = ''
  } catch (error) {
    console.error('Failed to get AI response:', error)
    messages.value.push({
      role: 'assistant',
      content: 'I apologize, but I encountered an error. Please try again.'
    })
  } finally {
    isLoading.value = false
  }

  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
  focusInput()
}

const newLine = () => {
  userInput.value += '\n'
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
