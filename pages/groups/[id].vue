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
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Groups
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Loading messages...</p>
      </div>

      <!-- Messages -->
      <div v-else class="py-6">
        <div class="flex flex-col space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="[
              message.userId === authStore.user?.uid ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              class="max-w-lg rounded-lg px-4 py-2"
              :class="[
                message.userId === authStore.user?.uid
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              ]"
            >
              <p class="text-sm font-bold">{{ getUserName(message.userId) }}</p>
              <p class="text-sm">{{ message.content }}</p>
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

        <!-- Message Input -->
        <div class="mt-6">
          <form @submit.prevent="sendMessageHandler" class="flex space-x-4">
            <input
              type="text"
              v-model="newMessage"
              placeholder="Type your message..."
              class="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || sending"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
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
