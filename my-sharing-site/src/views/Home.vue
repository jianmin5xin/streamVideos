<!-- src/views/Home.vue -->
<template>
    <div>
      <h1>视频图片分享</h1>
      <input type="file" @change="handleFileUpload" />
      <button @click="upload">上传</button>
      <div v-for="post in posts" :key="post.id">
        <img v-if="post.type === 'image'" :src="post.url" />
        <video v-if="post.type === 'video'" :src="post.url" controls></video>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '../stores/user'
  import { onMounted } from 'vue'
  
  const store = useUserStore()
  let selectedFile = null
  
  const handleFileUpload = (event) => {
    selectedFile = event.target.files[0]
  }
  
  const upload = () => {
    if (selectedFile) store.uploadContent(selectedFile)
  }
  
  onMounted(() => {
    store.fetchPosts()
  })
  
  const posts = store.posts
  </script>