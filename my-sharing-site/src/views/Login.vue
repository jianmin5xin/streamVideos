<!-- src/views/Login.vue -->
<template>
    <div class="login-container">
      <h1>登录</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">邮箱:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="请输入邮箱"
          />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="请输入密码"
          />
        </div>
        <button type="submit">登录</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p>没有账号？<router-link to="/register">去注册</router-link></p>
        <button @click="handleLogout" v-if="userStore.isAuthenticated()">退出登录</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const userStore = useUserStore()
  const router = useRouter()
  
  const handleLogin = async () => {
    try {
      await userStore.login(email.value, password.value)
      router.push('/profile') // 登录成功后跳转到 /profile 页面
    } catch (err) {
      error.value = err.message || '登录失败，请检查邮箱和密码'
      console.error(err)
    }
  }
  
  const handleLogout = () => {
    userStore.logout()
    router.push('/login') // 退出登录后跳转到登录页
  }
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  </style>