<template>
  <div class="calendar-wrapper">
    <div class="calendar-legend">
      <div class="legend-title">Event Types:</div>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-color category-project"></span>
          <span>Project</span>
        </div>
        <div class="legend-item">
          <span class="legend-color category-assignment"></span>
          <span>Assignment</span>
        </div>
        <div class="legend-item">
          <span class="legend-color category-meeting"></span>
          <span>Meeting</span>
        </div>
        <div class="legend-item">
          <span class="legend-color category-course"></span>
          <span>Course</span>
        </div>
        <div class="legend-item">
          <span class="legend-color category-exam"></span>
          <span>Exam</span>
        </div>
        <div class="legend-item">
          <span class="legend-color category-other"></span>
          <span>Other</span>
        </div>
      </div>
    </div>
    <div class="calendar-container">
      <!-- Calendar Header -->
      <div class="calendar-header">
        <button @click="previousMonth" class="nav-button">&lt;</button>
        <h2>{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="nav-button">&gt;</button>
      </div>

      <!-- Weekday Headers -->
      <div class="weekdays-header">
        <div v-for="day in weekDays" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          :class="[
            'calendar-day', 
            { 
              'current-month': day.currentMonth,
              'adjacent-month': !day.currentMonth,
              'today': isToday(day.date),
              'past-date': isPastDate(day.date)
            }
          ]"
          @click="handleDayClick(day.date)"
        >
          <span class="day-number">{{ day.dayOfMonth }}</span>
          <div class="events-container">
            <div
              v-for="event in getEventsForDate(day.date)"
              :key="event.id"
              class="event-indicator"
              :class="[
                getCategoryClass(event.category),
                { 'adjacent-month-event': !day.currentMonth }
              ]"
              :title="event.title"
              @click.stop="openEventDetailsModal(event)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Event Modal -->
    <div v-if="showNewEventModal" class="modal-overlay">
      <div class="modal">
        <h3>Add Event for {{ selectedDateFormatted }}</h3>
        <form @submit.prevent="handleSubmit">
          <input
            v-model="newEvent.title"
            type="text"
            placeholder="Event Title"
            required
          />
          <textarea
            v-model="newEvent.description"
            placeholder="Event Description"
          ></textarea>
          <div class="category-selector">
            <label>Category:</label>
            <select v-model="newEvent.category" required>
              <option value="project">Project</option>
              <option value="assignment">Assignment</option>
              <option value="meeting">Meeting</option>
              <option value="course">Course</option>
              <option value="exam">Exam</option>
              <option value="other">Other</option>
            </select>
            <input
              v-if="newEvent.category === 'other'"
              v-model="newEvent.customCategory"
              type="text"
              placeholder="Specify category"
              required
            />
          </div>
          <div v-if="newEvent.category === 'exam'" class="exam-options">
            <label class="revision-checkbox">
              <input
                type="checkbox"
                v-model="newEvent.scheduleRevision"
                id="scheduleRevision"
              />
              Schedule a revision
            </label>
            <p class="revision-note">
              A quiz will be generated automatically and you'll be notified before the exam.
            </p>
            <div v-if="newEvent.scheduleRevision" class="reminder-date">
              <label>Reminder Date:</label>
              <input
                type="date"
                v-model="newEvent.reminderDate"
                :min="formatTodayDate()"
                :max="formatDate(selectedDate)"
                required
              />
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="save-button">Save</button>
            <button type="button" @click="closeNewEventModal" class="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Event Details/Edit Modal -->
    <div v-if="showEventDetailsModal" class="modal-overlay">
      <div class="modal" :class="getCategoryClass(selectedEvent.category)">
        <button @click="closeEventDetailsModal" class="close-x">&times;</button>
        <div v-if="!isEditing">
          <h3 class="modal-title">Event Details</h3>
          <div class="event-details">
            <h4>{{ selectedEvent.title }}</h4>
            <p class="description">{{ selectedEvent.description }}</p>
            <div class="event-metadata">
              <p><strong>Date:</strong> {{ new Date(selectedEvent.date).toLocaleDateString() }}</p>
              <p><strong>Category:</strong> {{ selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1) }}</p>
              <template v-if="selectedEvent.category === 'exam'">
                <p><strong>Revision Scheduled:</strong> {{ selectedEvent.revision ? 'Yes' : 'No' }}</p>
                <p v-if="selectedEvent.revision">
                  <strong>Revision Date:</strong> {{ selectedEvent.revisionDate ? new Date(selectedEvent.revisionDate).toLocaleDateString() : 'Not set' }}
                </p>
              </template>
            </div>
          </div>
          <div class="modal-buttons">
            <button @click="startEditing" class="edit-button">Edit</button>
            <button @click="deleteEvent" class="delete-button">Delete</button>
          </div>
        </div>
        <div v-else>
          <h3>Edit Event</h3>
          <form @submit.prevent="updateEvent">
            <input
              v-model="editedEvent.title"
              type="text"
              placeholder="Event Title"
              required
            />
            <textarea
              v-model="editedEvent.description"
              placeholder="Event Description"
            ></textarea>
            <div class="modal-buttons">
              <button type="submit" class="save-button">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

// Single declaration of Nuxt app utilities
const { $auth, $firestore } = useNuxtApp()
const currentUser = ref(null)

// Watch for auth state changes
onMounted(() => {
  onAuthStateChanged($auth, (user) => {
    currentUser.value = user
    if (user) {
      fetchEvents() // Fetch events when user is authenticated
    }
  })
})

const currentDate = ref(new Date())
const showNewEventModal = ref(false)
const showEventDetailsModal = ref(false)
const selectedDate = ref(null)
const selectedEvent = ref(null)
const isEditing = ref(false)
const editedEvent = ref({})
const events = ref([])

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const newEvent = ref({
  title: '',
  description: '',
  category: 'other',
  customCategory: '',
  scheduleRevision: false,
  reminderDate: ''
})

const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      dayOfMonth: date.getDate(),
      currentMonth: false
    })
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      dayOfMonth: i,
      currentMonth: true
    })
  }
  
  // Add days from next month to complete the last week
  const lastDayOfWeek = lastDay.getDay()
  const remainingDays = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      dayOfMonth: date.getDate(),
      currentMonth: false
    })
  }
  
  return days
})

// Add computed property for number of rows
const numberOfRows = computed(() => {
  return Math.ceil(calendarDays.value.length / 7)
})

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const openNewEventModal = (date) => {
  selectedDate.value = date
  showNewEventModal.value = true
}

const closeNewEventModal = () => {
  showNewEventModal.value = false
  newEvent.value = {
    title: '',
    description: '',
    category: 'other',
    customCategory: '',
    scheduleRevision: false,
    reminderDate: ''
  }
  selectedDate.value = null
}

const handleSubmit = async () => {
  try {
    if (!currentUser.value) {
      alert('Please log in to create events')
      return
    }

    if (!newEvent.value.title || !selectedDate.value) {
      alert('Please fill in all required fields')
      return
    }

    const eventData = {
      user_id: currentUser.value.uid, // Use actual user ID
      title: newEvent.value.title,
      description: newEvent.value.description || '',
      date: selectedDate.value,
      category: newEvent.value.category,
      revision: newEvent.value.scheduleRevision || false,
      revisionDate: newEvent.value.reminderDate || null,
      createdAt: new Date()
    }


    const eventsRef = collection($firestore, 'events')
    const docRef = await addDoc(eventsRef, eventData)
    
    events.value.push({
      id: docRef.id,
      ...eventData
    })

    closeNewEventModal()
    await fetchEvents()
  } catch (error) {
    console.error('Error creating event:', error)
    alert('Error creating event. Please try again.')
  }
}

const getEventsForDate = (date) => {
  return events.value.filter(
    event => event.date.toDateString() === date.toDateString()
  )
}

const openEventDetailsModal = (event) => {
  selectedEvent.value = event
  showEventDetailsModal.value = true
  isEditing.value = false
}

const closeEventDetailsModal = () => {
  showEventDetailsModal.value = false
  selectedEvent.value = null
  isEditing.value = false
}

const startEditing = () => {
  editedEvent.value = { ...selectedEvent.value }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedEvent.value = {}
}

const updateEvent = async () => {
  try {
    if (!currentUser.value) {
      alert('Please log in to update events')
      return
    }

    const eventRef = doc($firestore, 'events', selectedEvent.value.id)
    await updateDoc(eventRef, {
      title: editedEvent.value.title,
      description: editedEvent.value.description,
      updatedAt: new Date()
    })

    const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
    if (index !== -1) {
      events.value[index] = {
        ...selectedEvent.value,
        title: editedEvent.value.title,
        description: editedEvent.value.description
      }
    }
    closeEventDetailsModal()
  } catch (error) {
    console.error('Error updating event:', error)
    alert('Error updating event. Please try again.')
  }
}

const deleteEvent = async () => {
  if (!currentUser.value) {
    alert('Please log in to delete events')
    return
  }

  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await deleteDoc(doc($firestore, 'events', selectedEvent.value.id))
      events.value = events.value.filter(e => e.id !== selectedEvent.value.id)
      closeEventDetailsModal()
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event. Please try again.')
    }
  }
}

const getCategoryClass = (category) => {
  const categories = {
    project: 'category-project',
    assignment: 'category-assignment',
    meeting: 'category-meeting',
    course: 'category-course',
    exam: 'category-exam',
    other: 'category-other'
  }
  return categories[category] || 'category-other'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

// Add function to format today's date for the min attribute
const formatTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Fetch events on mount and when month changes
onMounted(() => {
  fetchEvents()
})

watch(() => currentDate.value, () => {
  fetchEvents()
})

async function fetchEvents() {
  try {
    if (!currentUser.value) {
      return
    }

    // Extend the date range to include adjacent months
    const startDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
    const endDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 2, 0, 23, 59, 59)
    
    
    const eventsRef = collection($firestore, 'events')
    const q = query(
      eventsRef,
      where('user_id', '==', currentUser.value.uid)
    )
    
    const querySnapshot = await getDocs(q)
    
    events.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Date 
          ? data.date 
          : data.date?.toDate?.() 
          ? data.date.toDate() 
          : new Date(data.date)
      }
    }).filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= startDate && eventDate <= endDate
    })

  } catch (error) {
    console.error('Error fetching events:', error)
    events.value = []
  }
}

const isPastDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Add new method to handle day clicks
const handleDayClick = (date) => {
  if (!currentUser.value) {
    alert('Please log in to add events')
    return
  }
  
  if (!isPastDate(date)) {
    openNewEventModal(date)
  }
}
</script>

<style scoped>
.calendar-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  border-radius: 0.375rem;
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  background-color: #f8fafc;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.calendar-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* Update grid-template-rows to be dynamic */
  grid-template-rows: repeat(auto-fit, 1fr);
  gap: 1px;
  background-color: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  min-height: 0;
}

.calendar-day {
  background-color: white;
  min-height: 100px;
  padding: 0.5rem;
  cursor: pointer;
}

.calendar-day:hover {
  background-color: #f8fafc;
}

.current-month {
  background-color: white;
}

.day-number {
  font-weight: 500;
}

.events-container {
  margin-top: 0.5rem;
}

.event-indicator {
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;
}


.event-details {
  margin: 1rem 0;
}

.event-details h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.event-details .description {
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
}

.event-metadata {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 0.375rem;
}

.event-metadata p {
  margin-bottom: 0.5rem;
}

.event-metadata p:last-child {
  margin-bottom: 0;
}

.modal-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.edit-button {
  background-color: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.delete-button {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.edit-button:hover {
  background-color: #d97706;
}

.delete-button:hover {
  background-color: #b91c1c;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  border-top: 5px solid transparent; /* Add colored border on top */
}

.modal input,
.modal textarea {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.save-button {
  background-color: #443bf6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.adjacent-month {
  background-color: #f8fafc !important; /* Very light gray background */
  color: #94a3b8 !important; /* Light gray text */
}

.adjacent-month .event-indicator {
  opacity: 0.6; /* Make events slightly transparent */
}

.today {
  background-color: #dbeafe !important; /* Lighter blue background */
  border: 2px solid #2563eb !important; /* Darker blue border */
  position: relative;
  z-index: 1;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.1); /* Subtle blue glow */
}

.today .day-number {
  color: #2563eb; /* Darker blue text */
  font-weight: 700;
  font-size: 1.1em; /* Slightly larger */
}

/* Ensure today's styling takes precedence even for adjacent months */
.adjacent-month.today {
  background-color: #dbeafe !important;
  color: #2563eb !important;
}

.adjacent-month.today .day-number {
  color: #2563eb !important;
}

.category-selector {
  margin: 1rem 0;
}

.category-selector select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.exam-options {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.375rem;
}

.revision-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.revision-checkbox input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.revision-note {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0;
}

.reminder-date {
  margin-top: 1rem;
}

/* Category Colors */
.category-project { background-color: #3b82f6; }
.category-assignment { background-color: #8b5cf6; }
.category-meeting { background-color: #ef4444; }
.category-course { background-color: #10b981; }
.category-exam { background-color: #f59e0b; }
.category-other { background-color: #6b7280; }

/* Category Hover Colors - slightly darker versions */
.category-project:hover { background-color: #2563eb; }
.category-assignment:hover { background-color: #7c3aed; }
.category-meeting:hover { background-color: #dc2626; }
.category-course:hover { background-color: #059669; }
.category-exam:hover { background-color: #d97706; }
.category-other:hover { background-color: #4b5563; }

.event-indicator {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
}

/* Remove the old hover style if it exists */
.event-indicator:hover {
  /* Remove or comment out any existing hover styles */
}

.calendar-legend {
  max-width: 1000px;
  margin: 0 auto 1rem auto;
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.legend-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
}

/* Category-specific modal styling */
.modal.category-project { border-color: #3b82f6; }
.modal.category-assignment { border-color: #8b5cf6; }
.modal.category-meeting { border-color: #ef4444; }
.modal.category-course { border-color: #10b981; }
.modal.category-exam { border-color: #f59e0b; }
.modal.category-other { border-color: #6b7280; }

.past-date {
  opacity: 0.6;
  cursor: not-allowed !important;
  background-color: #f3f4f6;
}

.past-date:hover {
  background-color: #f3f4f6 !important;
}

.past-date .event-indicator {
  cursor: pointer;
}

/* Add styles for adjacent month events */
.adjacent-month-event {
  opacity: 0.6;
}

.modal-title {
  color: white;
  padding: 1rem;
  margin: -2rem -2rem 0 -2rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Update modal styles for each category */
.modal.category-project .modal-title { background-color: #2563eb; }
.modal.category-assignment .modal-title { background-color: #7c3aed; }
.modal.category-meeting .modal-title { background-color: #dc2626; }
.modal.category-course .modal-title { background-color: #059669; }
.modal.category-exam .modal-title { background-color: #d97706; }
.modal.category-other .modal-title { background-color: #4b5563; }

.event-details {
  padding: 1rem;
  margin-top: 0;
}

.event-details h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.event-details .description {
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  color: #4b5563;
}

.event-metadata {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
}

.event-metadata p {
  margin-bottom: 0.5rem;
  color: #374151;
}

.event-metadata strong {
  color: #1f2937;
}

/* Update button styles */
.edit-button {
  background-color: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.edit-button:hover {
  background-color: #d97706;
}

.delete-button {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background-color: #b91c1c;
}

.cancel-button {
  background-color: #b83c0f;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.cancel-button:hover {
  background-color: #963207;
}

.modal-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

/* Button base styles */
.edit-button, .delete-button, .cancel-button {
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: white;
  transition: background-color 0.2s ease;
}

/* Match button colors with event categories */
.modal.category-project .edit-button { background-color: #2563eb; }
.modal.category-project .edit-button:hover { background-color: #1d4ed8; }

.modal.category-assignment .edit-button { background-color: #7c3aed; }
.modal.category-assignment .edit-button:hover { background-color: #6d28d9; }

.modal.category-meeting .edit-button { background-color: #dc2626; }
.modal.category-meeting .edit-button:hover { background-color: #b91c1c; }

.modal.category-course .edit-button { background-color: #059669; }
.modal.category-course .edit-button:hover { background-color: #047857; }

.modal.category-exam .edit-button { background-color: #d97706; }
.modal.category-exam .edit-button:hover { background-color: #b45309; }

.modal.category-other .edit-button { background-color: #4b5563; }
.modal.category-other .edit-button:hover { background-color: #374151; }

/* Delete and Cancel buttons */
.delete-button {
  background-color: #dc2626;
}

.delete-button:hover {
  background-color: #b91c1c;
}

/* Center the buttons */
.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
}

/* Match modal colors with event colors */
.modal.category-project { background-color: #3b82f6 !important; }
.modal.category-assignment { background-color: #8b5cf6 !important; }
.modal.category-meeting { background-color: #ef4444 !important; }
.modal.category-course { background-color: #10b981 !important; }
.modal.category-exam { background-color: #f59e0b !important; }
.modal.category-other { background-color: #6b7280 !important; }

/* Update text colors for better contrast on colored backgrounds */
.modal {
  color: white;
}

.event-details h4 {
  color: white;
}

.event-details .description {
  color: rgba(255, 255, 255, 0.9);
}

.event-metadata {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.event-metadata p {
  color: rgba(255, 255, 255, 0.9);
}

.event-metadata strong {
  color: white;
}

/* Keep modal text white for viewing mode */
.modal {
  color: white;
}

/* Make edit form text black */
.modal form {
  color: black;
}

.modal form input,
.modal form textarea {
  color: black;
  background-color: white;
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.modal form input::placeholder,
.modal form textarea::placeholder {
  color: #9ca3af;
}

.close-x {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 1.5rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-x:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal {
  position: relative; /* For absolute positioning of close button */
  /* ... rest of modal styles ... */
}

/* Remove the old cancel button styles */
/* ... rest of your existing styles ... */
</style>
