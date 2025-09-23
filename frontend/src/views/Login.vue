<template>
  <div class="login-page">
    <div class="login-container">
      <LoginCard @register="onRegister" @patient-submit="onPatientSubmit" @doctor-submit="onDoctorSubmit" />
    </div>
  </div>
</template>

<script>
import LoginCard from '../components/LoginCard.vue'

export default {
  name: 'LoginPage',
  components: { LoginCard },
  methods: {
    onRegister() {
      this.$router.push('/register')
    },
    async onPatientSubmit(payload) {
      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // LoginCard 发出的字段为 { name, number }，后端期望 cardno，这里做字段映射
          body: JSON.stringify({ role: 'patient', cardno: payload.cardno || payload.number })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '登录失败')
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        this.$router.push('/dashboard')
      } catch (e) {
        alert(e.message)
      }
    },
    async onDoctorSubmit(payload) {
      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // LoginCard 发出的字段为 { name, phone }，后端期望 username/password，这里做字段映射
          body: JSON.stringify({ role: 'doctor', username: payload.username || payload.name, password: payload.password || payload.phone })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '登录失败')
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        this.$router.push('/doctor')
      } catch (e) {
        alert(e.message)
      }
    },
  },
  mounted() {},
  beforeUnmount() {}
}
</script>

<style scoped>

.login-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  color: var(--text);
}

/* 基础重置限定在页面容器内，避免污染全局 */
.login-page, .login-page * {
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 粒子与背景已迁移到全局 App.vue */

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  z-index: 1;
  min-height: 100vh;
}

/* 限制卡片最大宽度与与原设计一致 */
.login-container :deep(.login-card) {
  width: 100%;
  max-width: 450px;
}

/* 统一字体与行高，避免不同环境导致高度差 */
.login-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
}
</style>
