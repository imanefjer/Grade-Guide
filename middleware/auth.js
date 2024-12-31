export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  
  // Define routes that should be accessible only to non-authenticated users
  const authRoutes = ['/auth/login', '/auth/signup', '/auth/recover-password']
  
  // If auth is still loading, wait for it
  if (auth.loading) {
    await new Promise(resolve => {
      const unwatch = watch(() => auth.loading, (newValue) => {
        if (!newValue) {
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
  }

  // After auth is loaded, handle routing
  if (auth.isAuthenticated && authRoutes.includes(to.path)) {
    console.log('Authenticated user trying to access auth route, redirecting to dashboard')
    return navigateTo('/dashboard')
  }

  // Handle non-authenticated users trying to access protected routes
  if (!auth.isAuthenticated && !authRoutes.includes(to.path) && to.path !== '/') {
    console.log('Non-authenticated user trying to access protected route, redirecting to login')
    return navigateTo('/auth/login')
  }
}) 