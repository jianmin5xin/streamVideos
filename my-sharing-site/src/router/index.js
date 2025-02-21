// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue' // 新增注册页面
import Profile from '../views/Profile.vue' // 新增个人页面
import { useUserStore } from '../stores/user' // 导入 user store

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // 需登录
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register // 注册页面
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true } // 需登录
  },
  {
    path: '/',
    redirect: '/home' // 将根路径重定向到 /home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  console.log('Navigating to:', to.path)
  console.log('Is authenticated:', userStore.isAuthenticated())

  // 检查目标路由是否需要登录
  if (to.meta.requiresAuth) {
    if (userStore.isAuthenticated()) {
      next() // 已登录，允许访问
    } else {
      next('/login') // 未登录，重定向到登录页
    }
  } else {
    // 不需要登录的路由，直接放行
    if ((to.path === '/login' || to.path === '/register') && userStore.isAuthenticated()) {
      next('/home') // 如果已登录且访问登录/注册页，重定向到首页
    } else {
      next() // 放行
    }
  }
})

export default router