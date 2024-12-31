<!-- components/TaskBoard.vue -->
<template>
    <div class="grid grid-cols-2 gap-6">
      <!-- To Do Column -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">To Do</h2>
        <div class="space-y-4">
          <!-- Add Task Form -->
          <form @submit.prevent="addNewTask" class="mb-6">
            <div class="flex space-x-2">
              <input 
                v-model="newTask" 
                type="text" 
                placeholder="Add a new task..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </form>
  
          <!-- Task List -->
          <TransitionGroup 
            name="task-list"
            tag="ul"
            class="space-y-2"
          >
            <li 
              v-for="task in tasks" 
              :key="task.id"
              class="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-all"
              @click="completeTask(task.id)"
            >
              {{ task.title }}
            </li>
          </TransitionGroup>
        </div>
      </div>
  
      <!-- Completed Column -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Completed</h2>
        <TransitionGroup 
          name="task-list"
          tag="ul"
          class="space-y-2"
        >
          <li 
            v-for="task in completedTasks" 
            :key="task.id"
            class="bg-green-50 p-4 rounded-lg shadow"
          >
            {{ task.title }}
          </li>
        </TransitionGroup>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useTaskStore } from '@/stores/taskStore'
  
  const store = useTaskStore()
  const { tasks, completedTasks } = storeToRefs(store)
  const newTask = ref('')
  
  const addNewTask = () => {
    if (newTask.value.trim()) {
      store.addTask(newTask.value.trim())
      newTask.value = ''
    }
  }
  
  const completeTask = (taskId) => {
    store.completeTask(taskId)
  }
  </script>
  
  <style scoped>
  .task-list-move,
  .task-list-enter-active,
  .task-list-leave-active {
    transition: all 0.5s ease;
  }
  
  .task-list-enter-from,
  .task-list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .task-list-leave-active {
    position: absolute;
  }
  </style>