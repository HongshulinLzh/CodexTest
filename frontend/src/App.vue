<script setup>
import axios from 'axios'
import { reactive, ref } from 'vue'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

const registerForm = reactive({
  username: '',
  password: ''
})

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const message = ref('')
const error = ref('')
const token = ref(localStorage.getItem('token') || '')
const currentUser = ref(localStorage.getItem('username') || '')

const resetFeedback = () => {
  message.value = ''
  error.value = ''
}

const register = async () => {
  resetFeedback()
  loading.value = true
  try {
    const { data } = await api.post('/register', registerForm)
    message.value = data.message
    registerForm.username = ''
    registerForm.password = ''
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败'
  } finally {
    loading.value = false
  }
}

const login = async () => {
  resetFeedback()
  loading.value = true
  try {
    const { data } = await api.post('/login', loginForm)
    token.value = data.token
    currentUser.value = data.user.username
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.user.username)
    message.value = '登录成功'
    loginForm.password = ''
  } catch (err) {
    error.value = err.response?.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}

const logout = () => {
  token.value = ''
  currentUser.value = ''
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  message.value = '已退出登录'
}
</script>

<template>
  <main class="container">
    <h1>Vue3 + Express 用户登录系统</h1>

    <section class="grid">
      <article class="card">
        <h2>注册</h2>
        <label for="register-username">用户名</label>
        <input id="register-username" v-model="registerForm.username" type="text" placeholder="输入用户名" />
        <label for="register-password">密码</label>
        <input id="register-password" v-model="registerForm.password" type="password" placeholder="输入密码" />
        <button :disabled="loading" @click="register">立即注册</button>
      </article>

      <article class="card">
        <h2>登录</h2>
        <label for="login-username">用户名</label>
        <input id="login-username" v-model="loginForm.username" type="text" placeholder="输入用户名" />
        <label for="login-password">密码</label>
        <input id="login-password" v-model="loginForm.password" type="password" placeholder="输入密码" />
        <button :disabled="loading" @click="login">登录</button>
      </article>
    </section>

    <section class="card" style="margin-top: 16px">
      <h2>用户信息</h2>
      <template v-if="token">
        <div class="info">
          <p><strong>当前用户：</strong>{{ currentUser }}</p>
          <p><strong>JWT Token：</strong></p>
          <p class="token">{{ token }}</p>
          <button @click="logout">退出登录</button>
        </div>
      </template>
      <p v-else>尚未登录，请先登录。</p>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </section>
  </main>
</template>
