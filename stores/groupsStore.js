// stores/groupsStore.js
import { defineStore } from 'pinia';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  orderBy,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  where
} from 'firebase/firestore';

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [],
    currentGroup: null,
    messages: [],
    userMap: {},
    isLoading: false,
    error: null,
    filters: {
      searchTerm: ''
    }
  }),

  getters: {
    filteredGroups: (state) => {
      if (!state.filters.searchTerm) return state.groups;
      const term = state.filters.searchTerm.toLowerCase();
      return state.groups.filter(group => 
        group.subject.toLowerCase().includes(term) ||
        group.description.toLowerCase().includes(term)
      );
    }
  },

  actions: {
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },

    async fetchGroups() {
      this.isLoading = true;
      this.error = null;
      try {
        const { $firestore } = useNuxtApp(); // Moved useNuxtApp here
        const q = query(collection($firestore, 'collaboration_groups'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        this.groups = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching groups:', error);
        this.error = 'Failed to load groups';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGroup(groupId) {
      this.isLoading = true;
      this.error = null;
      try {
        const { $firestore } = useNuxtApp(); // Moved useNuxtApp here
        const groupDoc = await getDoc(doc($firestore, 'collaboration_groups', groupId));
        if (!groupDoc.exists()) {
          throw new Error('Group not found');
        }
        this.currentGroup = { id: groupDoc.id, ...groupDoc.data() };
      } catch (error) {
        console.error('Error fetching group:', error);
        this.error = 'Failed to load group';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createGroup({ subject, description }, userId) {
      this.isLoading = true;
      this.error = null;
      try {
        const { $firestore } = useNuxtApp(); // Moved useNuxtApp here
        const groupData = {
          subject,
          description,
          admin: userId,
          students: [userId],
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection($firestore, 'collaboration_groups'), groupData);
        return docRef.id;
      } catch (error) {
        console.error('Error creating group:', error);
        this.error = 'Failed to create group';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async joinGroup(groupId, userId) {
      this.isLoading = true;
      this.error = null;
      try {
        const { $firestore } = useNuxtApp(); // Moved useNuxtApp here
        const groupRef = doc($firestore, 'collaboration_groups', groupId);
        const groupDoc = await getDoc(groupRef);
        const currentStudents = groupDoc.data().students;
        await updateDoc(groupRef, {
          students: [...currentStudents, userId]
        });
      } catch (error) {
        console.error('Error joining group:', error);
        this.error = 'Failed to join group';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUsers() {
        const { $firestore } = useNuxtApp();
        const snapshot = await getDocs(collection($firestore, 'users'));
        snapshot.forEach((doc) => {
          this.userMap[doc.id] = doc.data().firstName + " " + doc.data().lastName;
        });
      },
  
      listenToMessages(groupId) {
        const { $firestore } = useNuxtApp();
        const q = query(
          collection($firestore, 'messages'),
          where('groupId', '==', groupId),
          orderBy('createdAt', 'asc')
        );
        onSnapshot(q, (snapshot) => {
          this.messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
      },


    async sendMessage({ groupId, userId, content }) {
      this.error = null;
      try {
        const { $firestore } = useNuxtApp(); // Moved useNuxtApp here
        await addDoc(collection($firestore, 'messages'), {
          groupId,
          userId,
          content,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error sending message:', error);
        this.error = 'Failed to send message';
        throw error;
      }
    }
  }
});
