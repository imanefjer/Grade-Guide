import { defineStore } from 'pinia'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null
  }),

  actions: {
    async init() {
      const { $auth } = useNuxtApp()
      
      onAuthStateChanged($auth, (user) => {
        this.user = user
        this.loading = false
      })
    },

    async signup(email, password) {
      const { $auth } = useNuxtApp()
      try {
        this.error = null
        const userCredential = await createUserWithEmailAndPassword($auth, email, password)
        this.user = userCredential.user
        return userCredential
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async login(email, password) {
      const { $auth } = useNuxtApp()
      try {
        this.error = null
        const userCredential = await signInWithEmailAndPassword($auth, email, password)
        this.user = userCredential.user
        return userCredential
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async logout() {
      const { $auth } = useNuxtApp()
      try {
        await signOut($auth)
        this.user = null
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email
  }
}) 