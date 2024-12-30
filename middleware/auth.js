export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/']
  
  if (!auth.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth/login')
  }
  
  if (auth.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/signup')) {
    return navigateTo('/dashboard')
  }
}) 