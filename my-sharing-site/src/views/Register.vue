<!-- src/views/Register.vue -->
<template>
    <div class="register-container">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister">
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
          <label for="username">用户名:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="请输入用户名"
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
        <button type="submit">注册</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p>已有账号？<router-link to="/login">去登录</router-link></p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const username = ref('')
  const password = ref('')
  const error = ref('')
  const userStore = useUserStore()
  const router = useRouter()
  
  const handleRegister = async () => {
    try {
      // 假设后端 /api/register 接收 { email, username, password }
      const response = await userStore.register(email.value, username.value, password.value)
      // 注册成功后，自动登录
      await userStore.login(email.value, password.value)
      router.push('/home') // 注册后跳转到首页
    } catch (err) {
      error.value = err.message || '注册失败，请重试'
      console.error(err)
    }
  }
  </script>
  
  <style scoped>
  .register-container {
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
    background-color: #28a745; /* 绿色按钮，区别于登录按钮 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  .error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  </style>