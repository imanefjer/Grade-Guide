<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Add LoadingOverlay at the top -->
    <LoadingOverlay 
      :show="isLoading" 
      message="Generating your quiz... This may take a few moments."
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz Generator
          </span>
          <span v-if="subject" class="text-gray-900"> - {{ subject.name }}</span>
          <span v-else class="text-gray-400">Loading...</span>
        </h1>
        <NuxtLink 
          :to="`/subjects/${route.params.subjectID}/tutor`" 
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Tutor
        </NuxtLink>
      </div>

      <!-- Quiz Configuration -->
      <div v-if="!quiz || showConfigCard" class="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
        <div class="p-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Quiz Configuration</h2>
          <div class="space-y-6">
            <!-- File Upload -->
            <TutorFileUpload
              :is-loading="isLoading"
              :clear-files="shouldClearFiles"
              @files-selected="handleFiles"
              @files-cleared="clearFiles"
            />

            <!-- Custom Prompt -->
            <div>
              <label for="customPrompt" class="block text-sm font-medium text-gray-700 mb-2">
                Custom Instructions (Optional)
              </label>
              <textarea
                id="customPrompt"
                v-model="customPrompt"
                rows="3"
                class="w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-4 text-base shadow-sm"
                placeholder="Add specific instructions for your quiz (e.g., 'Focus on chapter 5' or 'Include more multiple choice questions')"
              ></textarea>
            </div>

            <!-- Quiz Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="questionCount" class="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  id="questionCount"
                  v-model="questionCount"
                  class="w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-4 text-base shadow-sm"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>

              <div>
                <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  v-model="difficulty"
                  class="w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-4 text-base shadow-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <!-- Generate Button -->
            <div class="flex justify-end">
              <button
                @click="generateQuiz"
                class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                :disabled="isLoading"
              >
                <span>Generate Quiz</span>
                <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate New Quiz Button -->
      <div v-if="quiz" class="mb-8 flex gap-4">
        <button
          @click="toggleConfigCard"
          class="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            :class="{ 'rotate-180': showConfigCard }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          {{ showConfigCard ? 'Hide Configuration' : 'Show Configuration' }}
        </button>
        <button
          v-if="!showConfigCard"
          @click="handleResetQuiz"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700"
        >
          Generate New Quiz
        </button>
      </div>

      <!-- Interactive Quiz Display -->
      <div v-if="quiz" class="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div class="p-8">
          <template v-if="!isQuizComplete">
            <div class="space-y-6">
              <QuizProgressBar
                :current="currentQuestionIndex + 1"
                :total="quiz.questions.length"
              />
              
              <QuizQuestion
                v-if="currentQuestion"
                :question="currentQuestion"
                :selected-answer="selectedAnswer"
                @select="selectAnswer"
              />

              <div class="flex justify-between mt-8">
                <button
                  @click="previousQuestion"
                  :disabled="currentQuestionIndex === 0"
                  class="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  @click="handleNextOrFinish"
                  :disabled="!selectedAnswer"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
                >
                  {{ currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question' }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </template>

          <QuizResults
            v-else
            :questions="quiz.questions"
            :user-answers="quizStore.userAnswers"
            :score="score"
            @retry="handleResetQuiz"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '~/stores/quiz';
import { doc, getDoc } from 'firebase/firestore';

const route = useRoute();
const { $firestore } = useNuxtApp();
const quizStore = useQuizStore();

const subject = ref(null);
const customPrompt = ref('');
const questionCount = ref('10');
const difficulty = ref('medium');
const isLoading = ref(false);
const selectedFiles = ref([]);
const shouldClearFiles = ref(false);
const showConfigCard = ref(!quizStore.quiz);

// Fetch subject data
onMounted(async () => {
  try {
    const subjectDoc = await getDoc(doc($firestore, 'subjects', route.params.subjectID));
    if (subjectDoc.exists()) {
      subject.value = { id: subjectDoc.id, ...subjectDoc.data() };
    }
  } catch (error) {
    console.error('Error fetching subject:', error);
  }
  
  quizStore.loadState(route.params.subjectID);
});

const handleFiles = (files) => {
  selectedFiles.value = files
}

const clearFiles = () => {
  selectedFiles.value = []
}

const generateQuiz = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('subject', JSON.stringify(subject.value))
    formData.append('questionCount', questionCount.value)
    formData.append('difficulty', difficulty.value)
    formData.append('customPrompt', customPrompt.value)
    
    selectedFiles.value.forEach(file => {
      formData.append('files', file)
    })

    const response = await $fetch('/api/generate-quiz', {
      method: 'POST',
      body: formData
    })

    quizStore.initializeQuiz(response.quiz, route.params.subjectID)
    showConfigCard.value = false
    shouldClearFiles.value = true
    await nextTick()
    shouldClearFiles.value = false
  } catch (error) {
    console.error('Failed to generate quiz:', error)
  } finally {
    isLoading.value = false
  }
}

// Use store getters and state
const quiz = computed(() => quizStore.quiz)
const currentQuestion = computed(() => quizStore.currentQuestion)
const isQuizComplete = computed(() => quizStore.isQuizComplete)
const currentQuestionIndex = computed(() => quizStore.currentQuestionIndex)
const selectedAnswer = computed(() => quizStore.selectedAnswer)
const isAnswered = computed(() => quizStore.isAnswered)
const score = computed(() => quizStore.score)

// Map store actions
const selectAnswer = quizStore.selectAnswer
const checkAnswer = quizStore.checkAnswer
const nextQuestion = quizStore.nextQuestion
const previousQuestion = quizStore.previousQuestion
const resetQuiz = quizStore.resetQuiz

// Handle next question or finish quiz
const handleNextOrFinish = () => {
  if (currentQuestionIndex.value === quiz.value.questions.length - 1) {
    quizStore.finishQuiz()
  } else {
    nextQuestion()
  }
}

// Update resetQuiz to show config card
const handleResetQuiz = () => {
  showConfigCard.value = true
  resetQuiz()
}

const toggleConfigCard = () => {
  showConfigCard.value = !showConfigCard.value
}

</script> 