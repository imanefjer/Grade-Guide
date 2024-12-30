export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  
  // Initialize the auth store
  await auth.init()
}) 