<template>
  <div class="login-page">
    <!-- 分屏布局：左侧粒子区域(自适应剩余空间)，右侧固定宽度登录区 -->
    <div class="flex w-full min-h-screen">
      <!-- 左侧：仅展示粒子特效，保持原粒子图自身尺寸，不放大 -->
      <div class="flex flex-col flex-1 items-center justify-center relative px-1">
        <ParticleImage
          image-src="/og-image.png"
          :responsive-width="true"
          particle-size="4"
          particle-gap="1"
        />
      </div>

      <!-- 右侧：登录功能面板，保持卡片最大宽 450px，不改变原样 -->
      <div class="login-container !min-h-screen w-full max-w-[560px] flex flex-col items-center justify-center px-8 mr-15">
        <LoginCard @register="onRegister" @patient-submit="onPatientSubmit" @doctor-submit="onDoctorSubmit" />
      </div>
    </div>
    <!-- 全屏遮罩放在最外层，覆盖左右两侧 -->
    <div v-if="busy" class="overlay">
      <div class="spinner" />
      <div class="msg">{{ busyMessage }}</div>
    </div>
  </div>
</template>

<script>
import LoginCard from '../components/LoginCard.vue'
import { usePatientStore } from '../store/patient'
import { useRecordsStore } from '../store/records'
import FlipCard from '../components/InspiraUI/FlipCard.vue'
import GradientButton from '../components/InspiraUI/GradientButton.vue'
import ParticleImage from "@/components/ui/particle-image/ParticleImage.vue";

import { computed } from "vue";
import { useColorMode } from "@vueuse/core";



export default {
  name: 'LoginPage',
  components: { LoginCard, FlipCard, GradientButton, ParticleImage },
  data() {
    //const isDark = computed(() => useColorMode().value == "dark");
    //const bgColor = computed(() => (isDark.value ? "#000" : "#fff"));
    return {
      busy: false,
      busyMessage: '',
      //bgColor
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
        const API_BASE = import.meta.env.VITE_API_BASE
        const res = await fetch(`${API_BASE}/api/auth/login`, {
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
        this.$router.push('/home')
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
  const API_BASE = import.meta.env.VITE_API_BASE
  const res = await fetch(`${API_BASE}/api/auth/login`, {
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
    
    mounted() {},
    beforeUnmount() {}
  }
}
</script>

<style scoped>

.to-home-btn {
  margin-top: 32px;
  padding: 10px 32px;
  background: var(--accent, #1e88e5);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.to-home-btn:hover {
  background: #1565c0;
}

.login-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  color: var(--text);
}

/* 右侧登录区域容器内字体与布局 */
.login-container :deep(.login-card) { width:100%; max-width:520px; }
.login-container { font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.5; }

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
