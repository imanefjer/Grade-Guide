export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  
  const authRoutes = ['/auth/login', '/auth/signup', '/auth/recover-password']
  
  if (auth.loading) {
    await auth.initializationPromise
  }

  watch(() => auth.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated && authRoutes.includes(to.path)) {
      navigateTo('/dashboard', { replace: true })
    }
  }, { immediate: true })

  if (authRoutes.includes(to.path)) {
    if (auth.isAuthenticated) {
      console.log('Authenticated user trying to access auth route, redirecting to dashboard')
      return navigateTo('/dashboard', { replace: true })
    }
    return 
  }

  if (to.path !== '/') {
    if (!auth.isAuthenticated) {
      console.log('Non-authenticated user trying to access protected route, redirecting to login')
      return navigateTo('/auth/login', { replace: true })
    }
  }
}) 