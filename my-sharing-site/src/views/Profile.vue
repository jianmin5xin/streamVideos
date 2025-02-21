<!-- src/views/Profile.vue -->
<template>
    <div class="profile-container">
      <h1>个人资料</h1>
      <div v-if="userStore.user">
        <p>用户名: {{ userStore.user.username }}</p>
        <p>邮箱: {{ userStore.user.email }}</p>
        <!-- 其他用户信息 -->
        <button @click="handleLogout">退出登录</button>
      </div>
      <p v-else>加载中...</p>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router'
  
  const userStore = useUserStore()
  const router = useRouter()
  
  const handleLogout = () => {
    userStore.logout()
    router.push('/login') // 退出登录后跳转到登录页
  }
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  h1 {
    color: #2c3e50;
  }
  </style>