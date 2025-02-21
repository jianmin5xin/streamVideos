// src/stores/user.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '' // 从 localStorage 获取 token
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('/api/login', { email, password })
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('token', this.token) // 登录成功后保存 token
      } catch (error) {
        throw new Error('登录失败，请检查邮箱和密码')
      }
    },
    async register(email, username, password) {
      try {
        const response = await axios.post('/api/register', { email, username, password })
        this.user = response.data.user // 假设后端返回用户信息
        // 注册成功后可能需要登录
        await this.login(email, password) // 自动登录
      } catch (error) {
        throw new Error('注册失败，请重试')
      }
    },
    async fetchUser() {
      if (this.token) {
        try {
          const response = await axios.get('/api/user', {
            headers: { Authorization: `Bearer ${this.token}` }
          })
          this.user = response.data.user
        } catch (error) {
          console.error('获取用户信息失败', error)
          this.logout() // 如果 token 无效，退出登录
        }
      }
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token') // 退出登录时清除 token
    },
    isAuthenticated() {
      return !!this.token // 检查 token 是否存在
    }
  }
})