export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/recover-password']
  
  // Check if route requires authentication
  const requiresAuth = !publicRoutes.includes(to.path)

  try {
    // Wait for auth initialization if not already done
    if (!auth.isInitialized) {
      await Promise.race([
        auth.init(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Auth initialization timeout')), 5000))
      ])
    }

    // If route requires auth and user is not authenticated, redirect to login
    if (requiresAuth && !auth.isAuthenticated) {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }

    // If user is authenticated and tries to access auth pages, redirect to subjects
    if (auth.isAuthenticated && ['/auth/login', '/auth/signup'].includes(to.path)) {
      return navigateTo('/subjects')
    }

  } catch (error) {
    console.error('Auth middleware error:', error)
    if (requiresAuth) {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
  }
})