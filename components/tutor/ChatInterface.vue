<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role]">
        <TutorFormattedMessage :content="message.content" />
         <!-- {{ message.content }} -->
      </div>
      <div v-if="isLoading" class="message assistant">
        <p>Thinking...</p>
      </div>
    </div>
    
    <div class="input-container">
      <textarea 
        ref="textareaRef"
        v-model="userInput"
        @keyup.enter.prevent="sendMessage"
        placeholder="Type your message here..."
        rows="3"
        class="message-input"
        :disabled="isLoading"
      ></textarea>
      <button 
        @click="sendMessage" 
        class="send-button"
        :disabled="isLoading"
      >
        Send
      </button>
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

  // Add user message
  const userMessage = {
    role: 'user',
    content: userInput.value.trim()
  }
  messages.value.push(userMessage)

  // Clear input
  userInput.value = ''
  isLoading.value = true

  try {
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value
      }
    })

    messages.value.push(response)
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

// Watch messages and scroll to bottom when new messages arrive
watch(() => messages.value, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

// Add this to focus the input when component is mounted
onMounted(() => {
  focusInput()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 0.75rem;
  border-radius: 0.5rem;
  max-width: 80%;
}

.message.user {
  background-color: #e2e8f0;
  align-self: flex-end;
}

.message.assistant {
  background-color: #f1f5f9;
  align-self: flex-start;
}

.input-container {
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.message-input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  resize: none;
}

.send-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
}

.send-button:hover {
  background-color: #2563eb;
}
</style>
