// stores/taskStore.js
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    completedTasks: [],
    timerState: {
      isRunning: false,
      timeLeft: 20 * 60, // 20 minutes in seconds
      isBreak: false,
      totalPomodoros: 0,
    }
  }),

  actions: {
    addTask(task) {
      this.tasks.push({
        id: Date.now(),
        title: task,
        createdAt: new Date(),
      })
    },

    completeTask(taskId) {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        const task = this.tasks[taskIndex]
        this.completedTasks.push({
          ...task,
          completedAt: new Date()
        })
        this.tasks.splice(taskIndex, 1)
      }
    },

    startTimer() {
      this.timerState.isRunning = true
    },

    pauseTimer() {
      this.timerState.isRunning = false
    },

    resetTimer() {
      this.timerState.timeLeft = this.timerState.isBreak ? 5 * 60 : 20 * 60
    },

    toggleBreak() {
      this.timerState.isBreak = !this.timerState.isBreak
      this.resetTimer()
      if (!this.timerState.isBreak) {
        this.timerState.totalPomodoros++
      }
    },

    decrementTimer() {
      if (this.timerState.timeLeft > 0) {
        this.timerState.timeLeft--
      }
    },

    getSessionReport() {
      return {
        completedTasks: this.completedTasks.length,
        totalPomodoros: this.timerState.totalPomodoros,
        productivityScore: Math.min(100, (this.completedTasks.length / (this.tasks.length + this.completedTasks.length)) * 100)
      }
    }
  }
})