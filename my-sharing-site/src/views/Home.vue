<!-- src/views/Home.vue -->
<template>
    <div>
      <h1>视频图片分享</h1>
      <div v-if="store.user">
      <p>欢迎您，{{ store.user.username }}</p>
     </div>
      <input type="file" @change="handleFileUpload" />
      <button @click="upload">上传</button>
      <div v-for="post in posts" :key="post.id">
        <img v-if="post.type === 'image'" :src="post.url" />
        <video v-if="post.type === 'video'" :src="post.url" controls></video>
      </div>
      <!-- 退出登录按钮，仅在用户登录时显示 -->
    <button v-if="store.isAuthenticated()" @click="handleLogout">退出登录</button>
    <!-- 可选：未登录时的提示 -->
    <p v-else>
      请 <router-link to="/login">登录</router-link> 或 <router-link to="/register">注册</router-link>
    </p>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue'
  const store = useUserStore()
  const router = useRouter()
  
  let selectedFile = null

  
  const handleFileUpload = (event) => {
    selectedFile = event.target.files[0]
  }
  
  const upload = () => {
    if (selectedFile) store.uploadContent(selectedFile)
  }
  
  onMounted(() => {
    if (store.isAuthenticated()) {
    store.fetchPosts() // 这里调用 fetchPosts，可能是第 42 行
  }
  })

  // 处理退出登录的函数
 const handleLogout = () => {
  // 调用 user store 中的 logout 方法清除登录状态
  store.logout();
  // 重定向到登录页面
  router.push('/login');
};
  
  const posts = store.posts
  </script>