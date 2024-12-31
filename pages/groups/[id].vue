<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="py-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ currentGroup?.subject }}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ currentGroup?.description }}
            </p>
          </div>
          <NuxtLink
            to="/groups"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Groups
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Loading messages...</p>
      </div>

      <!-- Messages Container -->
      <div v-else class="py-6">
        <div class="flex flex-col space-y-4 h-[calc(100vh-300px)] overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="[
              message.userId === authStore.user?.uid ? 'justify-end' : 'justify-start'
            ]"
          >
            <div class="flex items-start max-w-lg space-x-2">
              <!-- Avatar for other users -->
              <div v-if="message.userId !== authStore.user?.uid" 
                   class="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
                {{ getUserName(message.userId).charAt(0) }}
              </div>
              
              <div
                class="rounded-2xl px-4 py-2 shadow-sm"
                :class="[
                  message.userId === authStore.user?.uid
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                ]"
              >
                <p class="text-sm font-medium" :class="message.userId === authStore.user?.uid ? 'text-blue-100' : 'text-gray-900'">
                  {{ getUserName(message.userId) }}
                </p>
                <p class="text-sm" :class="message.userId === authStore.user?.uid ? 'text-white' : 'text-gray-800'">
                  {{ message.content }}
                </p>
                <p
                  class="text-xs mt-1"
                  :class="[
                    message.userId === authStore.user?.uid
                      ? 'text-blue-200'
                      : 'text-gray-500'
                  ]"
                >
                  {{ formatDate(message.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="mt-6 sticky bottom-0 bg-gray-50 pt-4">
          <form @submit.prevent="sendMessageHandler" class="flex space-x-4">
            <input
              type="text"
              v-model="newMessage"
              placeholder="Type your message..."
              class="flex-1 rounded-lg border-gray-300 shadow-sm px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || sending"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg v-if="!sending" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <svg v-else class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ sending ? 'Sending...' : 'Send' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGroupsStore } from '~/stores/groupsStore';
import { useAuthStore } from '~/stores/authStore';

const route = useRoute();
const groupsStore = useGroupsStore();
const authStore = useAuthStore();

const { currentGroup, messages, isLoading } = storeToRefs(groupsStore);

const newMessage = ref('');
const sending = ref(false);

const sendMessageHandler = async () => {
  sending.value = true;
  try {
    await groupsStore.sendMessage({
      groupId: route.params.id,
      userId: authStore.user?.uid,
      content: newMessage.value
    });
    newMessage.value = '';
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    sending.value = false;
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric'
  });
};

const getUserName = (userId) => {
  return groupsStore.userMap[userId]  || 'Unknown';
};

onMounted(async () => {
  try {
    await groupsStore.fetchGroup(route.params.id);
    groupsStore.listenToMessages(route.params.id);
    await groupsStore.fetchUsers();
  } catch (error) {
    console.error('Error loading group or messages:', error);
  }
});
</script>
