<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role]">
        <TutorFormattedMessage :content="message.content" />
         <!-- {{ message.content }} -->
      </div>
      <div v-if="isLoading" class="message assistant">
        <p class="thinking font-bold">
          <span>T</span>
          <span>h</span>
          <span>i</span>
          <span>n</span>
          <span>k</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
    
    <div class="input-container">
      <div class="flex items-center gap-2">
        <label for="file-upload" class="file-upload-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <input 
            id="file-upload"
            type="file"
            @change="handleFileUpload"
            accept=".pdf,.png,.jpg,.jpeg"
            class="hidden"
            :disabled="isLoading"
          />
        </label>
        <textarea 
          ref="textareaRef"
          v-model="userInput"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.shift.enter.prevent="newLine"
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
      <div v-if="selectedFile" class="selected-file">
        <span>{{ selectedFile.name }}</span>
        <button @click="removeFile" class="remove-file">×</button>
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

const userInput = ref('')
const messagesContainer = ref(null)
const textareaRef = ref(null)
const isLoading = ref(false)
const selectedFile = ref(null)

const focusInput = () => {
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should not exceed 5MB')
      removeFile()
      return
    }
  }
}

const removeFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('file-upload')
  if (fileInput) fileInput.value = ''
}

const sendMessage = async () => {
  if ((!userInput.value.trim() && !selectedFile.value) || isLoading.value) return

  isLoading.value = true

  try {
    let content = userInput.value.trim()
    let formData = null

    if (selectedFile.value) {
      formData = new FormData()
      formData.append('file', selectedFile.value)
      content += `\n[Attached file: ${selectedFile.value.name}]`
    }

    const userMessage = {
      role: 'user',
      content: content
    }
    messages.value.push(userMessage)

    userInput.value = ''
    removeFile()

    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: formData || {
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

watch(() => messages.value, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

onMounted(() => {
  focusInput()
})

const newLine = () => {
  userInput.value += '\n'
}
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

.file-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-upload-button:hover {
  background-color: #e5e7eb;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.remove-file {
  padding: 0 0.25rem;
  color: #6b7280;
  font-size: 1.25rem;
  line-height: 1;
}

.remove-file:hover {
  color: #ef4444;
}

.thinking {
  display: flex;
  justify-content: flex-start;
  gap: 1px;
}

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
