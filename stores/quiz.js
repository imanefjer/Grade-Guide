import { defineStore } from 'pinia'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quiz: null,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    isAnswered: false,
    score: 0,
    subjectId: null,
    isComplete: false,
    userAnswers: []
  }),

  getters: {
    currentQuestion: (state) => 
      state.quiz?.questions[state.currentQuestionIndex] || null,
    
    isQuizComplete: (state) => state.isComplete,
    
    totalQuestions: (state) => 
      state.quiz?.questions.length || 0
  },

  actions: {
    initializeQuiz(quiz, subjectId) {
      const shuffledQuiz = {
        ...quiz,
        questions: quiz.questions.map(question => ({
          ...question,
          options: shuffleArray([...question.options])
        }))
      }
      
      this.quiz = shuffledQuiz
      this.subjectId = subjectId
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.userAnswers = new Array(shuffledQuiz.questions.length).fill(null)
      this.score = 0
      this.isComplete = false
      this.quizStartTime = Date.now()
      this.saveState()
    },

    selectAnswer(answer) {
      this.selectedAnswer = answer
      this.userAnswers[this.currentQuestionIndex] = answer
      this.saveState()
    },

    calculateScore() {
      this.score = this.userAnswers.reduce((score, answer, index) => {
        return score + (answer === this.quiz.questions[index].correctAnswer ? 1 : 0)
      }, 0)
      this.saveState()
    },

    checkAnswer() {
      if (this.selectedAnswer === this.currentQuestion?.correctAnswer) {
        this.score++
      }
      this.isAnswered = true
      this.saveState()
    },

    nextQuestion() {
      if (this.currentQuestionIndex < (this.quiz?.questions.length || 0) - 1) {
        this.currentQuestionIndex++
        this.selectedAnswer = null
        this.isAnswered = false
        this.saveState()
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.selectedAnswer = null
        this.isAnswered = false
        this.saveState()
      }
    },

    resetQuiz() {
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.isAnswered = false
      this.score = 0
      this.isComplete = false
      this.userAnswers = new Array(this.quiz?.questions.length || 0).fill(null)
      this.saveState()
    },

    saveState() {
      if (this.subjectId) {
        localStorage.setItem(`quiz_state_${this.subjectId}`, JSON.stringify({
          quiz: this.quiz,
          currentQuestionIndex: this.currentQuestionIndex,
          selectedAnswer: this.selectedAnswer,
          isAnswered: this.isAnswered,
          score: this.score,
          subjectId: this.subjectId,
          isComplete: this.isComplete,
          userAnswers: this.userAnswers
        }))
      }
    },

    loadState(subjectId) {
      const savedState = localStorage.getItem(`quiz_state_${subjectId}`)
      if (savedState) {
        const state = JSON.parse(savedState)
        if (state.subjectId === subjectId && !state.isComplete) {
          this.quiz = state.quiz
          this.currentQuestionIndex = state.currentQuestionIndex
          this.selectedAnswer = state.selectedAnswer
          this.isAnswered = state.isAnswered
          this.score = state.score
          this.subjectId = state.subjectId
          this.isComplete = state.isComplete
          this.userAnswers = state.userAnswers || []
          return true
        }
      }
      return false
    },

    clearState() {
      if (this.subjectId) {
        localStorage.removeItem(`quiz_state_${this.subjectId}`)
      }
      this.$reset()
    },

    finishQuiz() {
      this.calculateScore()
      this.isComplete = true
      this.saveProgress()
      // Clear the saved state when quiz is completed
      if (this.subjectId) {
        localStorage.removeItem(`quiz_state_${this.subjectId}`)
      }
    },

    async saveProgress() {
      const nuxtApp = useNuxtApp()
      const { $firestore, $auth } = nuxtApp
      
      if (!$firestore || !$auth.currentUser) return

      const progressRef = doc($firestore, 'progress', this.subjectId)
      const quizEndTime = Date.now()
      const quizDuration = (quizEndTime - this.quizStartTime) / 1000 // Convert to seconds
      
      try {
        // Get existing progress document
        const progressDoc = await getDoc(progressRef)
        const existingData = progressDoc.exists() ? progressDoc.data() : null

        // Calculate performance metrics
        const performance = {
          totalQuestions: this.quiz.questions.length,
          correctAnswers: this.score,
          percentage: (this.score / this.quiz.questions.length) * 100
        }

        // Generate AI analysis using Gemini
        const analysis = await this.generateProgressAnalysis(performance, existingData)

        // Calculate achievements
        const achievements = await this.calculateAchievements(performance, existingData)

        // Prepare new progress data
        const progressData = {
          numQuizzesTaken: (existingData?.numQuizzesTaken || 0) + 1,
          totalTimeSpentOnQuizzes: (existingData?.totalTimeSpentOnQuizzes || 0) + quizDuration,
          achievementsEarned: [...new Set([...(existingData?.achievementsEarned || []), ...achievements])],
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          focusAreas: analysis.focusAreas,
          levelHistory: [...(existingData?.levelHistory || []), {
            date: new Date().toISOString(),
            level: performance.percentage
          }]
        }

        // Save to Firestore
        if (existingData) {
          await updateDoc(progressRef, progressData)
        } else {
          await setDoc(progressRef, progressData)
        }
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    },

    async generateProgressAnalysis(performance, existingData) {
      // Create a summary of questions and answers
      const questionSummary = this.quiz.questions.map((q, index) => ({
        question: q.question,
        userAnswer: this.userAnswers[index],
        correctAnswer: q.correctAnswer,
        isCorrect: this.userAnswers[index] === q.correctAnswer
      }));

      // Group questions by correct/incorrect
      const correctQuestions = questionSummary.filter(q => q.isCorrect);
      const incorrectQuestions = questionSummary.filter(q => !q.isCorrect);

      const prompt = `
        Based on the following quiz performance in ${this.quiz.subject || 'this subject'}:

        Overall Performance:
        - Score: ${performance.correctAnswers}/${performance.totalQuestions}
        - Percentage: ${performance.percentage}%
        ${existingData ? `- Previous quiz history: ${existingData.levelHistory?.length || 0} quizzes taken` : ''}

        Correctly Answered Questions (${correctQuestions.length}):
        ${correctQuestions.map(q => `- ${q.question}`).join('\n')}

        Incorrectly Answered Questions (${incorrectQuestions.length}):
        ${incorrectQuestions.map(q => 
          `- Question: ${q.question}
           - Student answered: ${q.userAnswer}
           - Correct answer: ${q.correctAnswer}`
        ).join('\n')}

        Based on this detailed performance data, provide a concise analysis with:
        1. Student's specific strengths based on correctly answered questions (one sentence)
        2. Areas needing improvement based on incorrect answers (one sentence)
        3. Recommended focus areas and study strategy (one sentence)
        
        IMPORTANT: Respond ONLY with a JSON object in this exact format, no additional text or markdown:
        {
          "strengths": "one sentence about specific strengths",
          "improvements": "one sentence about specific improvements",
          "focusAreas": "one sentence about specific focus areas"
        }`

      try {
        const response = await $fetch('/api/generate-analysis', {
          method: 'POST',
          body: { prompt }
        })
        return response
      } catch (error) {
        console.error('Error generating analysis:', error)
        return {
          strengths: 'Unable to analyze strengths at this time',
          improvements: 'Unable to analyze improvements at this time',
          focusAreas: 'Unable to analyze focus areas at this time'
        }
      }
    },

    async calculateAchievements(performance, existingData) {
      const newAchievements = []
      const existingAchievements = existingData?.achievementsEarned || []

      // Perfect Score Achievement
      if (performance.percentage === 100 && !existingAchievements.includes('Perfect Score')) {
        newAchievements.push('Perfect Score')
      }

      // First Quiz Achievement
      if (!existingData?.numQuizzesTaken) {
        newAchievements.push('First Quiz Completed')
      }

      // Consistency Achievement
      if ((existingData?.numQuizzesTaken || 0) >= 5 && !existingAchievements.includes('Consistent Learner')) {
        newAchievements.push('Consistent Learner')
      }

      // Improvement Achievement
      if (existingData?.levelHistory?.length > 0) {
        const lastScore = existingData.levelHistory[existingData.levelHistory.length - 1].level
        if (performance.percentage > lastScore + 10) {
          newAchievements.push('Significant Improvement')
        }
      }

      return newAchievements
    },

    $reset() {
      this.quiz = null
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.isAnswered = false
      this.score = 0
      this.subjectId = null
      this.isComplete = false
      this.userAnswers = []
    }
  }
}) 