import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    progressData: [],
    milestones: []
  }),
  actions: {
    fetchProgressData() {
      // Simulated fetch call
      this.progressData = [{ week: 'Week 1', score: 20 }, { week: 'Week 2', score: 40 }]
    },
    fetchMilestones() {
      // Simulated fetch call
      this.milestones = [{ id: 1, title: 'First Quiz Passed', achieved: true }]
    }
  }
}) 