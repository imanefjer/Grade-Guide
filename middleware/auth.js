export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  if (!auth.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login')
  }
  
  if (auth.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/dashboard')
  }
}) 