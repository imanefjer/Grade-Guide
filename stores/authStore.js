import { defineStore } from 'pinia'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
    userProfile: null,
    isInitialized: false
  }),

  actions: {
    async init() {
      if (this.initializationPromise) {
        return this.initializationPromise
      }

      const nuxtApp = useNuxtApp()
      
      // Wait for Firebase plugin to be ready
      if (!nuxtApp.$auth || !nuxtApp.$firestore) {
        await new Promise(resolve => setTimeout(resolve, 100))
        if (!nuxtApp.$auth || !nuxtApp.$firestore) {
          throw new Error('Firebase services not initialized')
        }
      }

      this.initializationPromise = new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(nuxtApp.$auth, async (user) => {
          this.user = user
          if (user) {
            await this.fetchUserProfile().catch(console.error)
          } else {
            this.userProfile = null
          }
          this.loading = false
          this.isInitialized = true
          resolve()
          unsubscribe()
        })
      })

      return this.initializationPromise
    },

    async signup({ email, password, firstName, lastName }) {
      const { $auth, $firestore } = useNuxtApp()
      try {
        this.error = null
        
        // Create the user account first
        const userCredential = await createUserWithEmailAndPassword($auth, email, password)
        
        if (!userCredential?.user) {
          throw new Error('Failed to create user account')
        }

        try {
          // Create a reference to the users collection and the specific user document
          const usersRef = collection($firestore, 'users')
          const userDocRef = doc(usersRef, userCredential.user.uid)

          // Add user profile to Firestore
          await setDoc(userDocRef, {
            email,
            firstName,
            lastName,
            createdAt: serverTimestamp()
          })
        } catch (firestoreError) {
          console.error('Firestore error:', firestoreError)
          // If Firestore fails, delete the auth user to maintain consistency
          await userCredential.user.delete()
          throw firestoreError
        }

        // Update local state
        this.user = userCredential.user
        this.userProfile = { firstName, lastName, email }
        
        return true
      } catch (error) {
        console.error('Signup error:', error)
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.error = 'An account with this email already exists'
            break
          case 'auth/invalid-email':
            this.error = 'Please enter a valid email address'
            break
          case 'auth/operation-not-allowed':
            this.error = 'Email/password accounts are not enabled'
            break
          case 'auth/weak-password':
            this.error = 'Please choose a stronger password'
            break
          default:
            this.error = error.message || 'Unable to create account. Please try again.'
        }
        return false
      }
    },

    async fetchUserProfile() {
      if (!this.user) return

      const { $firestore } = useNuxtApp()
      try {
        const docRef = doc($firestore, 'users', this.user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          this.userProfile = {
            ...docSnap.data(),
            email: this.user.email
          }
        } else {
          this.userProfile = {
            email: this.user.email
          }
        }
      } catch (error) {
        this.error = 'Unable to fetch user profile'
        throw error
      }
    },

    async updateProfile(profileData) {
      if (!this.user) return

      const { $firestore } = useNuxtApp()
      try {
        const docRef = doc($firestore, 'users', this.user.uid)
        
        const updatedProfile = {
          ...this.userProfile,
          email: this.user.email,
          ...profileData,
          updatedAt: serverTimestamp()
        }

        await setDoc(docRef, updatedProfile, { merge: true })
        this.userProfile = updatedProfile
      } catch (error) {
        this.error = 'Unable to update profile'
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
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/invalid-email':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.error = 'Invalid credentials. Please check your email and password'
            break
          case 'auth/user-disabled':
            this.error = 'This account has been disabled'
            break
          case 'auth/too-many-requests':
            this.error = 'Too many attempts. Please try again later'
            break
          default:
            this.error = 'Unable to sign in. Please try again'
        }
        throw error
      }
    },

    async logout() {
      const { $auth } = useNuxtApp()
      try {
        await signOut($auth)
        this.user = null
      } catch (error) {
        this.error = 'Unable to sign out. Please try again'
        throw error
      }
    },

    async signInWithGoogle() {
      const { $auth, $firestore } = useNuxtApp()
      try {
        this.error = null
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup($auth, provider)
        
        // Get user info from Google
        const firstName = result.user.displayName?.split(' ')[0] || ''
        const lastName = result.user.displayName?.split(' ').slice(1).join(' ') || ''
        
        // Create/update user document in Firestore
        const userDocRef = doc($firestore, 'users', result.user.uid)
        await setDoc(userDocRef, {
          email: result.user.email,
          firstName,
          lastName,
          createdAt: serverTimestamp()
        }, { merge: true })

        this.user = result.user
        this.userProfile = { firstName, lastName, email: result.user.email }
        return result
      } catch (error) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            this.error = 'Sign-in was cancelled'
            break
          case 'auth/popup-blocked':
            this.error = 'Pop-up was blocked by your browser. Please allow pop-ups for this site'
            break
          case 'auth/account-exists-with-different-credential':
            this.error = 'An account already exists with this email using a different sign-in method'
            break
          default:
            this.error = 'Unable to sign in with Google. Please try again'
        }
        throw error
      }
    },

    async sendPasswordReset(email) {
      const { $auth } = useNuxtApp()
      try {
        this.error = null
        await sendPasswordResetEmail($auth, email)
        return true
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            this.error = 'No account found with this email address'
            break
          case 'auth/invalid-email':
            this.error = 'Please enter a valid email address'
            break
          case 'auth/too-many-requests':
            this.error = 'Too many attempts. Please try again later'
            break
          default:
            this.error = 'Unable to send password reset email. Please try again'
        }
        throw error
      }
    },

    async navigateAfterLogin() {
      await navigateTo('/subjects', { replace: true })
    },
    
    async navigateAfterLogout() {
      await navigateTo('/auth/login', { replace: true })
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email,
    firstName: (state) => state.userProfile?.firstName,
    lastName: (state) => state.userProfile?.lastName,
    fullName: (state) => {
      if (!state.userProfile) return ''
      return `${state.userProfile.firstName} ${state.userProfile.lastName}`.trim()
    }
  }
}) 