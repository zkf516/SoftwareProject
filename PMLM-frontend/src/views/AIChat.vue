<template>
  <div class="max-w-4xl mx-auto px-4">
    <div class="aichat-body">
      <h1 class="text-2xl font-bold text-white mb-2">AIChat</h1>
      <p class="text-slate-300 mb-4">这是一个空白的新页面，后续可以在这里接入聊天 UI。</p>
      <button class="btn" @click="handleBack">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'AIChat' })

const router = useRouter()

const userName = ref('')
const patientId = ref('')

const initials = computed(() => {
  const name = (userName.value || 'U').trim()
  return name.slice(0, 2).toUpperCase()
})

function handleBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else if (router) {
    router.push('/home')
  }
}

onMounted(() => {
  try {
    const cached = JSON.parse(localStorage.getItem('loggedInUser') || 'null')
    if (Array.isArray(cached)) {
      userName.value = cached[1] || ''
      patientId.value = cached[2] || ''
    }
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.aichat-body {
  padding: 16px 0 24px;
}
.btn {
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(26, 35, 51, 0.9);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.18);
  cursor: pointer;
}
</style>
