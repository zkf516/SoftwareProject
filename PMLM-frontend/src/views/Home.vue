<template>
  <!-- 顶部透明状态栏 -->
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/30 border-b border-gray-700/40">
    <div class="relative mx-auto max-w-4xl flex items-center h-14 px-0"> <!-- 调整 max-w 与 px 以对齐卡片 -->
      <!-- 左侧：返回 + 头像 + 信息 -->
      <div class="flex items-center gap-3">
        <button @click="handleBack" class="p-2 rounded-lg hover:bg-white/10 text-slate-200 inline-flex items-center" aria-label="返回">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <img :src="userAvatar" alt="avatar" class="w-9 h-9 rounded-full ring-2 ring-white/10 object-cover bg-gray-700" />
        <div class="hidden sm:flex flex-col leading-tight min-w-0">
          <span class="text-white text-sm font-semibold truncate max-w-[120px]">{{ userName || '未登录' }}</span>
          <span class="text-[10px] text-slate-400 tracking-wide">编号 {{ patientId || '--' }}</span>
        </div>
      </div>
      <!-- 中间：导航栏（绝对居中） -->
      <nav class="absolute left-1/2 -translate-x-1/2 flex gap-2">
        <button
          v-for="item in navItems"
          :key="item.key"
          @click="goNav(item)"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-medium transition',
            currentPath === item.to ? 'bg-white/15 text-white backdrop-blur' : 'text-slate-300 hover:bg-white/10'
          ]"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
  </header>

  <div class="pt-15"> <!-- 主体内容增加顶部间距避免被固定栏遮挡 -->
    <!-- 病人信息卡片区块，流星特效参考原InspiraUI布局优化 -->
    <div class="relative w-full max-w-4xl mx-auto my-6 flex justify-center">
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>
      <div class="relative flex flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full max-w-4xl overflow-hidden">
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>
        <div class="relative z-10 w-full">
          <h2 class="mb-4 text-2xl font-bold text-white tracking-wide">病人信息卡片</h2>
          <div class="w-full grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">姓名</span>
              <span class="text-base font-semibold text-white">---</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">身份证号</span>
              <span class="text-base font-semibold text-white">--</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">住院号</span>
              <span class="text-base font-semibold text-white">1031289</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">CARDNO</span>
              <span class="text-base font-semibold text-white">103399592</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">性别</span>
              <span class="text-base font-semibold text-white">--</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">年龄</span>
              <span class="text-base font-semibold text-white">35</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">身高 (cm)</span>
              <span class="text-base font-semibold text-white">155</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">是否住院</span>
              <span class="text-base font-semibold text-white">是</span>
            </div>
          </div>
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="flex flex-col p-4 rounded-xl bg-gray-800 bg-opacity-60">
              <span class="text-xs text-slate-400">入院诊断</span>
              <span class="text-base font-medium text-white">妊娠高血压</span>
            </div>
            <div class="flex flex-col p-4 rounded-xl bg-gray-800 bg-opacity-60">
              <span class="text-xs text-slate-400">出院诊断</span>
              <span class="text-base font-medium text-white">顺产</span>
            </div>
          </div>
          <button class="rounded-lg border border-gray-600 px-6 py-2 text-gray-100 font-semibold shadow-md hover:bg-gray-800 transition mb-2">查看更多</button>
        </div>
      </div>
    </div>

    <!-- 四个翻转卡片区块 -->
    <div class="w-full max-w-4xl mx-auto py-5 overflow-x-auto">
      <div class="flex flex-col md:flex-row flex-nowrap justify-center items-stretch gap-5 min-w-0">
        <FlipCard>
          <template #default>
            <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 w-full md:w-56" />
            <div class="absolute bottom-4 left-4 text-xl font-bold text-white">卡片一</div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-56">
              <h1 class="text-xl font-bold text-white">卡片一</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容一：病人健康数据展示。</p>
            </div>
          </template>
        </FlipCard>
        <FlipCard>
          <template #default>
            <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 w-full md:w-56" />
            <div class="absolute bottom-4 left-4 text-xl font-bold text-white">卡片二</div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-56">
              <h1 class="text-xl font-bold text-white">卡片二</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容二：用药记录与提醒。</p>
            </div>
          </template>
        </FlipCard>
        <FlipCard>
          <template #default>
            <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 w-full md:w-56" />
            <div class="absolute bottom-4 left-4 text-xl font-bold text-white">卡片三</div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-56">
              <h1 class="text-xl font-bold text-white">卡片三</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容三：随访与健康建议。</p>
            </div>
          </template>
        </FlipCard>
        <FlipCard>
          <template #default>
            <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 w-full md:w-56" />
            <div class="absolute bottom-4 left-4 text-xl font-bold text-white">卡片四</div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-56">
              <h1 class="text-xl font-bold text-white">卡片四</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容四：历史就诊记录。</p>
            </div>
          </template>
        </FlipCard>
      </div>
    </div>
  </div>
</template>

<script>
import FlipCard from '../components/InspiraUI/FlipCard.vue'
import Meteors from "@/components/ui/meteors/Meteors.vue";

export default {
  name: 'Home',
  components: { FlipCard, Meteors },
  data() {
    return {
      userName: '',
      patientId: '',
      navItems: [
        { key: 'home', label: '首页', to: '/' },
        { key: 'records', label: '记录', to: '/records' },
        { key: 'chat', label: '咨询', to: '/chat' },
        { key: 'dashboard', label: '面板', to: '/dashboard' }
      ]
    }
  },
  computed: {
    currentPath() {
      return this.$route ? this.$route.path : ''
    },
    userAvatar() {
      const seed = this.userName || 'User';
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
    }
  },
  mounted() {
    try {
      const cached = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (Array.isArray(cached)) {
        this.userName = cached[1] || '';
        this.patientId = cached[2] || '';
      }
    } catch (e) { /* ignore */ }
  },
  methods: {
    handleBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else if (this.$router) {
        this.$router.push('/');
      }
    },
    goNav(item) {
      if (this.$router && item.to) {
        this.$router.push(item.to);
      }
    }
  }
}
</script>

<style>
/* 顶部居中导航若与其它元素冲突可以在小屏隐藏或改为下方 Tab */
</style>