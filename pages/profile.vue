<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <!-- Profile Header -->
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex items-center gap-4">
            <!-- Profile Image -->
            <div class="relative">
              <img
                :src="profileImageUrl || 'images/default-avatar.png'"
                alt="Profile"
                class="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
              <p class="mt-1 text-sm text-gray-500">Manage your account details and preferences.</p>
            </div>
          </div>
        </div>
        
        <!-- Profile Content -->
        <div class="px-4 py-5 sm:p-6">
          <div v-if="!isEditing" class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1 text-gray-900">{{ auth.userEmail }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <div class="mt-1 text-gray-900">{{ auth.firstName || 'Not set' }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <div class="mt-1 text-gray-900">{{ auth.lastName || 'Not set' }}</div>
            </div>

            <div class="mt-6">
              <button
                @click="toggleEdit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <!-- Edit Form -->
          <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-6">
            <!-- Profile Image Upload -->
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1 text-gray-500">{{ auth.userEmail }}</div>
            </div>

            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

            <div class="flex gap-4">
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="toggleEdit"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const auth = useAuthStore()
const isEditing = ref(false)
const loading = ref(false)
const error = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const profileImageUrl = ref(null)

const formData = ref({
  firstName: '',
  lastName: ''
})

onMounted(async () => {
  await auth.fetchUserProfile()
  formData.value = {
    firstName: auth.firstName || '',
    lastName: auth.lastName || ''
  }
  profileImageUrl.value = auth.profileImageUrl
})

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  profileImageUrl.value = null
}

const toggleEdit = () => {
  if (isEditing.value) {
    // Reset form data when canceling
    formData.value = {
      firstName: auth.firstName || '',
      lastName: auth.lastName || ''
    }
    imageFile.value = null
    imagePreview.value = null
  }
  isEditing.value = !isEditing.value
  error.value = ''
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await auth.updateProfile(formData.value)
    isEditing.value = false
  } catch (err) {
    error.value = auth.error || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}
</script> 