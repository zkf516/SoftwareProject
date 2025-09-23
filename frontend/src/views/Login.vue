<template>
  <div class="login-page">
    <div class="login-container">
      <LoginCard @register="onRegister" @patient-submit="onPatientSubmit" @doctor-submit="onDoctorSubmit" />
      <div v-if="busy" class="overlay">
        <div class="spinner" />
        <div class="msg">{{ busyMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginCard from '../components/LoginCard.vue'
import { usePatientStore } from '../stores/patient'
import { useRecordsStore } from '../stores/records'

export default {
  name: 'LoginPage',
  components: { LoginCard },
  data() {
    return {
      busy: false,
      busyMessage: ''
    }
  },
  methods: {
    // 跳转注册页面
    onRegister() {
      this.$router.push('/register')
    },

    // 处理病人登录
    async onPatientSubmit(payload) {
      try {
        this.busy = true
        this.busyMessage = '正在登录…'
        // 先清空全局状态，避免连续登录残留数据
        try { usePatientStore().clear() } catch (_) {}
        try { useRecordsStore().clear() } catch (_) {}
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
        // 预拉取：病人信息与其检查记录，提升进入页面的首屏速度
        const pStore = usePatientStore()
        this.busyMessage = '正在加载个人信息…'
        await pStore.fetchMe(true)
        const rStore = useRecordsStore()
        this.busyMessage = '正在加载检查记录…'
        await rStore.fetchForCurrent(true)
        this.$router.push('/dashboard')
      } catch (e) {
        alert(e.message)
      } finally {
        this.busy = false
        this.busyMessage = ''
      }
    },

    // 处理医生登录
    async onDoctorSubmit(payload) {
      try {
        this.busy = true
        this.busyMessage = '正在登录…'
        // 清空全局状态，避免连续登录数据残留
        try { usePatientStore().clear() } catch (_) {}
        try { useRecordsStore().clear() } catch (_) {}
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
        // 医生端通常需要先选择患者，这里仅完成登录与状态清空
        this.$router.push('/dashboard')
      } catch (e) {
        alert(e.message)
      } finally {
        this.busy = false
        this.busyMessage = ''
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

/* 提交后的全屏遮罩与进度提示 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.spinner {
  width: 46px;
  height: 46px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: var(--accent, #00ffe0);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 14px;
}
.msg { color: #fff; font-size: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
