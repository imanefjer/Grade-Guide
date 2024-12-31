<!-- pages/groups/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Study Groups</h1>
          <p class="mt-2 text-sm text-gray-600">
            Join or create study groups to collaborate with others
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Group
        </button>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search groups by subject..."
          class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Loading State -->
      <div v-if="store.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Loading groups...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
        <p class="text-red-600">{{ store.error }}</p>
      </div>

      <!-- Groups List -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul v-if="filteredGroups.length" class="divide-y divide-gray-200">
          <li
            v-for="group in filteredGroups"
            :key="group.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <button
                  @click="handleGroupClick(group)"
                  class="block focus:outline-none w-full text-left"
                >
                  <p class="text-sm font-medium text-blue-600 truncate">
                    {{ group.subject }}
                  </p>
                  <p class="text-sm text-gray-500">{{ group.description }}</p>
                  <p class="mt-1 text-xs text-gray-400">
                    Created {{ formatDate(group.createdAt) }} • 
                    {{ group.students.length }} members
                  </p>
                </button>
              </div>
              <div class="ml-4">
                <span
                  v-if="isUserInGroup(group)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Joined
                </span>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="px-6 py-8 text-center text-gray-500">
          No groups found. Create one to get started!
        </div>
      </div>

      <!-- Create Group Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-lg font-medium mb-4">Create New Study Group</h2>
          <form @submit.prevent="createGroup">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  v-model="newGroup.subject"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  v-model="newGroup.description"
                  rows="3"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="store.isLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ store.isLoading ? "Creating..." : "Create Group" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Join Confirmation Modal -->
      <div
        v-if="showJoinModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-lg font-medium mb-4">Join Study Group</h2>
          <p class="text-gray-600 mb-6">
            Would you like to join "{{ selectedGroup?.subject }}" study group?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showJoinModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="joinGroup"
              :disabled="store.isLoading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {{ store.isLoading ? "Joining..." : "Join Group" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupsStore } from '~/stores/groupsStore';
import { useAuthStore } from '~/stores/authStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const store = useGroupsStore();
const authStore = useAuthStore();
const { filteredGroups } = storeToRefs(store);

const searchTerm = ref('');
const showAddModal = ref(false);
const showJoinModal = ref(false);
const selectedGroup = ref(null);

const newGroup = ref({
  subject: '',
  description: ''
});

// Check if current user is in group
const isUserInGroup = (group) => {
  return group.students.includes(authStore.user?.uid);
};

// Handle group click
const handleGroupClick = (group) => {
  if (isUserInGroup(group)) {
    router.push(`/groups/${group.id}`);
  } else {
    selectedGroup.value = group;
    showJoinModal.value = true;
  }
};

// Create new group
const createGroup = async () => {
  if (!authStore.user) return;
  
  try {
    const groupId = await store.createGroup(newGroup.value, authStore.user.uid);
    router.push(`/groups/${groupId}`);
    showAddModal.value = false;
    newGroup.value = { subject: '', description: '' };
  } catch (error) {
    console.error('Error creating group:', error);
  }
};

// Join group
const joinGroup = async () => {
  if (!authStore.user || !selectedGroup.value) return;
  
  try {
    await store.joinGroup(selectedGroup.value.id, authStore.user.uid);
    router.push(`/groups/${selectedGroup.value.id}`);
  } catch (error) {
    console.error('Error joining group:', error);
  } finally {
    showJoinModal.value = false;
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Watch for search term changes
watch(searchTerm, (newSearchTerm) => {
  store.setFilters({ searchTerm: newSearchTerm });
});

// Initialize auth and fetch groups on mount
onMounted(async () => {
  // Ensure auth is initialized before fetching groups
  await authStore.init();
  if (authStore.isAuthenticated) {
    await store.fetchGroups();
  } else {
    router.push('/auth/login');
  }
});
</script>