import { defineStore } from 'pinia'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    users: [
      {
        id: 1,
        name: 'John Doe',
        avatar: '/avatars/user1.jpg',
        score: 2840,
        badges: ['advanced', 'problemSolver', 'quickLearner'],
        rank: 1,
        recentProgress: [85, 92, 88, 95]
      },
      {
        id: 2,
        name: 'Emma Wilson',
        avatar: '/avatars/user2.jpg',
        score: 2795,
        badges: ['advanced', 'consistentLearner', 'mathWhiz'],
        rank: 2,
        recentProgress: [90, 88, 92, 89]
      },
      {
        id: 3,
        name: 'Michael Chen',
        avatar: '/avatars/user3.jpg',
        score: 2760,
        badges: ['intermediate', 'teamPlayer', 'scienceExpert'],
        rank: 3,
        recentProgress: [82, 88, 95, 91]
      },
      {
        id: 4,
        name: 'Sarah Johnson',
        avatar: '/avatars/user4.jpg',
        score: 2680,
        badges: ['intermediate', 'quickLearner'],
        rank: 4,
        recentProgress: [78, 85, 88, 90]
      },
      {
        id: 5,
        name: 'Alex Rodriguez',
        avatar: '/avatars/user5.jpg',
        score: 2645,
        badges: ['advanced', 'problemSolver'],
        rank: 5,
        recentProgress: [86, 84, 89, 87]
      },
      {
        id: 6,
        name: 'Lisa Zhang',
        avatar: '/avatars/user6.jpg',
        score: 2590,
        badges: ['intermediate', 'consistentLearner'],
        rank: 6,
        recentProgress: [75, 82, 85, 88]
      },
      {
        id: 7,
        name: 'David Kim',
        avatar: '/avatars/user7.jpg',
        score: 2520,
        badges: ['beginner', 'fastProgress'],
        rank: 7,
        recentProgress: [70, 78, 85, 89]
      },
      {
        id: 8,
        name: 'Maria Garcia',
        avatar: '/avatars/user8.jpg',
        score: 2480,
        badges: ['intermediate', 'teamPlayer'],
        rank: 8,
        recentProgress: [80, 82, 79, 84]
      },
      {
        id: 9,
        name: 'James Wilson',
        avatar: '/avatars/user9.jpg',
        score: 2450,
        badges: ['beginner', 'quickLearner'],
        rank: 9,
        recentProgress: [72, 75, 82, 85]
      },
      {
        id: 10,
        name: 'Sophie Martin',
        avatar: '/avatars/user10.jpg',
        score: 2420,
        badges: ['intermediate'],
        rank: 10,
        recentProgress: [76, 79, 81, 83]
      },
      {
        id: 11,
        name: 'Ryan Thompson',
        avatar: '/avatars/user11.jpg',
        score: 2380,
        badges: ['beginner', 'fastProgress'],
        rank: 11,
        recentProgress: [65, 72, 78, 82]
      },
      {
        id: 12,
        name: 'Olivia Brown',
        avatar: '/avatars/user12.jpg',
        score: 2340,
        badges: ['beginner'],
        rank: 12,
        recentProgress: [68, 71, 75, 79]
      },
      {
        id: 13,
        name: 'Daniel Lee',
        avatar: '/avatars/user13.jpg',
        score: 2290,
        badges: ['beginner', 'teamPlayer'],
        rank: 13,
        recentProgress: [70, 73, 76, 77]
      },
      {
        id: 14,
        name: 'Emily Davis',
        avatar: '/avatars/user14.jpg',
        score: 2250,
        badges: ['beginner'],
        rank: 14,
        recentProgress: [65, 69, 72, 75]
      },
      {
        id: 15,
        name: 'Kevin Wang',
        avatar: '/avatars/user15.jpg',
        score: 2200,
        badges: ['beginner'],
        rank: 15,
        recentProgress: [62, 68, 71, 73]
      }
    ]
  }),
  
  getters: {
    sortedUsers: (state) => {
      return [...state.users].sort((a, b) => b.score - a.score)
    },
    
    topPerformers: (state) => {
      return state.sortedUsers.slice(0, 3)
    },

    totalBadgeCount: (state) => {
      return state.users.reduce((total, user) => total + user.badges.length, 0)
    },

    averageScore: (state) => {
      const total = state.users.reduce((sum, user) => sum + user.score, 0)
      return Math.round(total / state.users.length)
    },

    badgeDistribution: (state) => {
      const distribution = {}
      state.users.forEach(user => {
        user.badges.forEach(badge => {
          distribution[badge] = (distribution[badge] || 0) + 1
        })
      })
      return distribution
    }
  },
  
  actions: {
    async fetchLeaderboardData() {
      // TODO: Implement actual API call
      // Currently using mock data in state
    },

    async updateUserScore(userId, newScore) {
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.score = newScore
        // Recalculate ranks after score update
        this.recalculateRanks()
      }
    },

    recalculateRanks() {
      this.sortedUsers.forEach((user, index) => {
        user.rank = index + 1
      })
    }
  }
}) 