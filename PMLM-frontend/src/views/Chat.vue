<template>
  <div class="mx-auto px-4 py-5 max-w-6xl">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div class="md:col-span-1">
        <ChatHistory
          :items="historyItems"
          :selected-id="selectedId"
          @select="onSelectHistory"
          @new="onNewChat"
        />
      </div>
      <div class="md:col-span-3 card aichat-card">
      <McLayout class="aichat-layout">
        <McLayoutHeader class="aichat-header">
          <McHeader :logoImg="'/logo.svg'" :title="'MateChat'" />
        </McLayoutHeader>
        <McLayoutContent class="aichat-content">
          <McBubble content="Hello MateChat" align="right"/>
          <McBubble content="Hello, what can I do for you?" />
        </McLayoutContent>
        <McLayoutSender class="aichat-sender">
          <McInput
            :value="inputValue"
            @update:value="onInput"
            :maxLength="2000"
            showCount
            placeholder="请输入消息…"
          >
            <template #head>
              <div class="appendix-wrap">
                <div class="appendix-item">
                  <span>README.md</span>
                  <i class="icon-code-editor-close"></i>
                </div>
              </div>
            </template>
            <template #extra>
              <div class="input-foot-left">
                <span><i class="icon-at"></i>智能体</span>
                <span><i class="icon-appendix"></i>附件</span>
              </div>
            </template>
          </McInput>
        </McLayoutSender>
      </McLayout>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { McLayoutAside, McLayoutContent, McLayoutHeader, McLayout, McLayoutSender } from '@matechat/core';
import ChatHistory from '@/components/ChatHistory.vue'

defineOptions({ name: 'AIChat' })

const router = useRouter()

const userName = ref('')
const patientId = ref('')
const inputValue = ref('')
const selectedId = ref(null)
const historyItems = ref([
  { id: 1, title: 'Tailwind Classes', date: '12 Mar' },
  { id: 2, title: 'explain quantum computing', date: '10 Feb' },
  { id: 3, title: 'How to create ERP Diagram', date: '22 Jan' },
  { id: 4, title: 'API Scaling Strategies', date: '1 Jan' },
  { id: 5, title: 'What is GPT UI?', date: '1 Jan' },
  { id: 6, title: 'How to use Tailwind components?', date: '1 Jan' },
])

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

function onInput(v) {
  inputValue.value = v
}

function onSelectHistory(id) {
  selectedId.value = id
}

function onNewChat() {
  // TODO: 清空当前会话、发起新对话
  selectedId.value = null
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
/* 容器卡片：使用全局主题变量 */
.aichat-card {
  padding: 0;
  backdrop-filter: blur(12px);
}

/* 布局占位：让内容区域自适应高度并滚动 */
.aichat-layout {
  display: flex;
  flex-direction: column;
  min-height: 70vh;
}

/* 头部简洁透明，分隔线弱化 */
.aichat-header {
  background: transparent;
  color: var(--text, #FFFFFF);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* 内容区域滚动，留出内边距 */
.aichat-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

/* 底部输入条固定在卡片底部，半透明背景与分隔线 */
.aichat-sender {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
}
</style>
