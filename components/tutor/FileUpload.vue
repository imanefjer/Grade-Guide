<template>
  <div class="relative">
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      class="hidden"
      multiple
      accept=".txt,.pdf,.doc,.docx"
    />
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <button
          @click="triggerFileInput"
          class="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Files</span>
        </button>
        <span v-if="selectedFiles.length > 0" class="text-sm text-gray-500">
          {{ selectedFiles.length }} file(s) selected
        </span>
      </div>

      <!-- File preview area -->
      <TransitionGroup 
        name="file-list"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="(file, index) in selectedFiles"
          :key="file.name"
          class="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ file.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>
          <button
            @click="removeFile(index)"
            class="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            :disabled="isLoading"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
const fileInput = ref(null)
const selectedFiles = ref([])

const emit = defineEmits(['filesSelected', 'filesCleared'])

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  clearFiles: {
    type: Boolean,
    default: false
  }
})

watch(() => props.clearFiles, (newValue) => {
  if (newValue) {
    selectedFiles.value = []
    emit('filesCleared')
  }
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...newFiles]
  emit('filesSelected', selectedFiles.value)
  event.target.value = ''
}

const removeFile = (index) => {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
  emit('filesSelected', selectedFiles.value)
  if (selectedFiles.value.length === 0) {
    emit('filesCleared')
  }
}
</script>

<style scoped>
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.3s ease;
}

.file-list-enter-from,
.file-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.file-list-move {
  transition: transform 0.3s ease;
}
</style> 