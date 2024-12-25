import { defineStore } from 'pinia'

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
    userAnswers: [],
    isComplete: false
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
        if (state.subjectId === subjectId) {
          this.quiz = state.quiz
          this.currentQuestionIndex = state.currentQuestionIndex
          this.selectedAnswer = state.selectedAnswer
          this.isAnswered = state.isAnswered
          this.score = state.score
          this.subjectId = state.subjectId
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
      this.saveState()
    }
  }
}) 