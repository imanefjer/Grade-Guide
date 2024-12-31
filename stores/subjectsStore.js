// stores/subjectsStore.js
import { defineStore } from 'pinia'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  orderBy 
} from 'firebase/firestore'

export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: [],
    isLoading: false,  // Changed from 'loading' to 'isLoading' for clarity
    error: null,
    filters: {
      activeOnly: false,
      searchTerm: ''
    }
  }),

  getters: {
    filteredSubjects: (state) => {
      let filtered = [...state.subjects]
      
      if (state.filters.activeOnly) {
        filtered = filtered.filter(subject => subject.active)
      }
      
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(subject => 
          subject.name.toLowerCase().includes(searchLower)
        )
      }
      
      return filtered
    }
  },

  actions: {
    async fetchSubjects() {
      const nuxtApp = useNuxtApp()
      if (!nuxtApp.$firestore || !nuxtApp.$auth.currentUser) {
        console.error('Firestore or Auth not initialized')
        return
      }

      this.isLoading = true
      this.error = null
      
      try {
        const subjectsRef = collection(nuxtApp.$firestore, 'subjects')
        const q = query(
          subjectsRef,
          where('userId', '==', nuxtApp.$auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        this.subjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (err) {
        console.error('Error fetching subjects:', err)
        this.error = 'Failed to load subjects'
      } finally {
        this.isLoading = false
      }
    },

    async addSubject(subjectData) {
      const nuxtApp = useNuxtApp()
      if (!nuxtApp.$firestore || !nuxtApp.$auth.currentUser) {
        throw new Error('Firestore or Auth not initialized')
      }

      this.isLoading = true
      this.error = null
      
      try {
        const subjectsRef = collection(nuxtApp.$firestore, 'subjects')
        const newSubject = {
          ...subjectData,
          userId: nuxtApp.$auth.currentUser.uid,
          createdAt: new Date().toISOString(),
          active: true
        }
        
        const docRef = await addDoc(subjectsRef, newSubject)
        this.subjects.unshift({
          id: docRef.id,
          ...newSubject
        })
      } catch (err) {
        console.error('Error adding subject:', err)
        this.error = 'Failed to add subject'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async toggleSubjectActive(subjectId) {
      const nuxtApp = useNuxtApp()
      if (!nuxtApp.$firestore) {
        throw new Error('Firestore not initialized')
      }
      
      try {
        const subject = this.subjects.find(s => s.id === subjectId)
        if (!subject) return
        
        const subjectRef = doc(nuxtApp.$firestore, 'subjects', subjectId)
        await updateDoc(subjectRef, {
          active: !subject.active
        })
        
        subject.active = !subject.active
      } catch (err) {
        console.error('Error toggling subject active status:', err)
        this.error = 'Failed to update subject'
        throw err
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})