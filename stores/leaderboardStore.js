import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { useNuxtApp } from '#app'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    users: [],
    isLoading: false,
    error: null
  }),

  getters: {
    sortedUsers: (state) => {
      return [...state.users].sort((a, b) => {
        const levelDiff = b.topLevel - a.topLevel
        if (levelDiff !== 0) return levelDiff
        const quizDiff = b.numQuizzesTaken - a.numQuizzesTaken
        if (quizDiff !== 0) return quizDiff
        return b.totalTimeSpent - a.totalTimeSpent
      })
    },
    
    topPerformers: (state) => {
      return state.sortedUsers.slice(0, 3)
    },

    classAverage: (state) => {
      if (!state.users.length) return 0
      const totalLevels = state.users.reduce((sum, user) => sum + user.topLevel, 0)
      return Math.round(totalLevels / state.users.length)
    }
  },

  actions: {
    getTopLevel(levelHistory) {
      if (!levelHistory || levelHistory.length === 0) return 0
      return Math.max(...levelHistory.map(entry => entry.level))
    },

    async fetchLeaderboardData() {
      const { $firestore } = useNuxtApp()
      this.isLoading = true
      this.error = null
      const usersData = {}

      try {
        // First, fetch all users
        const usersSnapshot = await getDocs(collection($firestore, 'users'))
        
        usersSnapshot.forEach(doc => {
          usersData[doc.id] = {
            id: doc.id,
            name: doc.data().firstName || 'Anonymous User',
            topLevel: 0,
            numQuizzesTaken: 0,
            totalTimeSpent: 0
          }
        })

        // Fetch all subjects to get the user mapping
        const subjectsSnapshot = await getDocs(collection($firestore, 'subjects'))
        const subjectsData = {}
        
        subjectsSnapshot.forEach(doc => {
          subjectsData[doc.id] = {
            id: doc.id,
            ...doc.data()
          }
        })

        // Fetch all progress documents
        const progressSnapshot = await getDocs(collection($firestore, 'progress'))
        const userProgress = {}

        // Group progress by user using subject mapping
        progressSnapshot.forEach(doc => {
          const progress = doc.data()
          const subjectId = doc.id
          
          const subject = subjectsData[subjectId]
          if (subject && subject.userId && usersData[subject.userId]) {
            if (!userProgress[subject.userId]) {
              userProgress[subject.userId] = []
            }
            userProgress[subject.userId].push({
              ...progress,
              subjectId
            })
          }
        })

        // Process progress data for each user
        Object.entries(userProgress).forEach(([userId, progressList]) => {
          if (usersData[userId]) {
            const user = usersData[userId]
            const allLevelHistory = progressList.flatMap(p => p.levelHistory || [])
            user.topLevel = this.getTopLevel(allLevelHistory)
            user.numQuizzesTaken = progressList.reduce((sum, p) => sum + (p.numQuizzesTaken || 0), 0)
            user.totalTimeSpent = progressList.reduce((sum, p) => sum + (p.totalTimeSpentOnQuizzes || 0), 0)
          }
        })

        // Convert to array and assign ranks
        this.users = Object.values(usersData)
          .filter(user => user.numQuizzesTaken > 0)
          .sort((a, b) => b.topLevel - a.topLevel)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }))

        console.log('Processed users:', this.users)

      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
        this.error = 'Failed to load leaderboard data'
      } finally {
        this.isLoading = false
      }
    }
  }
}) 