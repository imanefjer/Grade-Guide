<!-- pages/subjects/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Your Subjects</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage and organize your study subjects
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Subject
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 sm:flex sm:items-center sm:space-x-4">
        <div class="flex-1 min-w-0">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search subjects..."
            class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="mt-3 sm:mt-0 flex items-center">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="activeOnly"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-600">Active only</span>
          </label>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.isLoading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-2 text-gray-600">Loading subjects...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="store.error"
        class="bg-red-50 border border-red-200 rounded-md p-4 mt-4"
      >
        <p class="text-red-600">{{ store.error }}</p>
      </div>

      <!-- Subjects List -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul v-if="filteredSubjects.length" class="divide-y divide-gray-200">
          <li
            v-for="subject in filteredSubjects"
            :key="subject.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <NuxtLink
                  :to="`/subjects/${subject.id}`"
                  class="block focus:outline-none"
                >
                  <p class="text-sm font-medium text-blue-600 truncate">
                    {{ subject.name }}
                  </p>
                  <p class="text-sm text-gray-500">{{ subject.description }}</p>
                  <p class="mt-1 text-xs text-gray-400">
                    Created {{ formatDate(subject.createdAt) }}
                  </p>
                </NuxtLink>
              </div>
              <div class="ml-4 flex items-center space-x-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    subject.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                >
                  {{ subject.active ? "Active" : "Inactive" }}
                </span>
                <button
                  @click.prevent="toggleActive(subject.id)"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <span class="sr-only">Toggle active status</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="px-6 py-8 text-center text-gray-500">
          No subjects found. Click "Add Subject" to create one.
        </div>
      </div>

      <!-- Add Subject Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-lg font-medium mb-4">Add New Subject</h2>
          <form @submit.prevent="addSubject">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Name</label
                >
                <input
                  type="text"
                  v-model="newSubject.name"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Description</label
                >
                <textarea
                  v-model="newSubject.description"
                  rows="3"
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
                {{ store.isLoading ? "Adding..." : "Add Subject" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useSubjectsStore } from "~/stores/subjectsStore";
import { storeToRefs } from "pinia";

const store = useSubjectsStore();
const { filteredSubjects } = storeToRefs(store);

const showAddModal = ref(false);
const searchTerm = ref("");
const activeOnly = ref(false);

const newSubject = ref({
  name: "",
  description: "",
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

watch([searchTerm, activeOnly], ([newSearchTerm, newActiveOnly]) => {
  store.setFilters({
    searchTerm: newSearchTerm,
    activeOnly: newActiveOnly,
  });
});

const addSubject = async () => {
  try {
    await store.addSubject(newSubject.value);
    showAddModal.value = false;
    newSubject.value = { name: "", description: "" };
  } catch (error) {
    console.error("Failed to add subject:", error);
  }
};

const toggleActive = async (subjectId) => {
  try {
    await store.toggleSubjectActive(subjectId);
  } catch (error) {
    console.error("Failed to toggle subject status:", error);
  }
};

// Wait for auth before fetching subjects
onMounted(async () => {
  await store.fetchSubjects()
});
</script>
