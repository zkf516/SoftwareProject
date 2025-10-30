<template>
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/30 border-b border-gray-700/40">
    <div class="relative mx-auto max-w-4xl grid grid-cols-[1fr_auto_1fr] items-center h-14 px-0">
      <!-- 左：头像 + 信息 -->
      <div class="flex items-center gap-3 justify-self-start">
        <div class="w-9 h-9 rounded-full bg-button-bg flex items-center justify-center text-white text-sm font-semibold ring-2 ring-blue-300/40 shadow">
          {{ initials }}
        </div>
        <div class="hidden sm:flex flex-col leading-tight min-w-0">
          <span class="text-white text-sm font-semibold truncate max-w-[120px]">{{ userName || '未登录' }}</span>
          <span class="text-[10px] text-slate-400 tracking-wide">编号 {{ patientId || '--' }}</span>
        </div>
      </div>

      <!-- 中：切换菜单（居中） -->
      <div class="justify-self-center">
        <MorphingTabs
          :tabs="tabs"
          :active-tab="activeTab"
          @update:active-tab="handleTabChange"
        />
      </div>

      <!-- 右：按钮（末端） -->
      <div class="flex items-center justify-self-end text-background">
        <InteractiveHoverButton text="返回" hover-text-color="rgba(30, 40, 60, 0.8)" @click="handleBack" aria-label="返回"/>
      </div>
    </div>
  </header>
</template>

<script>
import MorphingTabs from "@/components/ui/morphing-tabs/MorphingTabs.vue";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button/InteractiveHoverButton.vue";

export default {
  name: 'TopBar',
  components: { MorphingTabs, InteractiveHoverButton },
  data() {
    return {
      userName: '',
      patientId: '',
      tabs: ['首页','记录','咨询','面板'],
      activeTab: '首页',
      tabRouteMap: {
        '首页': '/home',
        '记录': '/records',
        '咨询': '/aichat',
        '面板': '/dashboard'
      }
    }
  },
  computed: {
    initials() {
      const name = (this.userName || 'U').trim();
      return name.slice(0,2).toUpperCase();
    }
  },
  methods: {
    syncActiveTabByRoute(path) {
      for (const [tab, route] of Object.entries(this.tabRouteMap)) {
        if (route === path) { this.activeTab = tab; return }
      }
    },
    handleBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else if (this.$router) {
        this.$router.push('/home');
      }
    },
    handleTabChange(tab) {
      this.activeTab = tab;
      const target = this.tabRouteMap[tab];
      if (this.$router && target && this.$route.path !== target) {
        this.$router.push(target);
      }
    }
  },
  mounted() {
    try {
      const cached = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (Array.isArray(cached)) {
        this.userName = cached[1] || '';
        this.patientId = cached[2] || '';
      }
    } catch (_) {}
    const path = this.$route ? this.$route.path : '/home';
    this.syncActiveTabByRoute(path)
  },
  watch: {
    '$route.path'(val) {
      this.syncActiveTabByRoute(val)
    }
  }
}
</script>

<style scoped>
/* 仅承载顶部栏视觉，主体页面需要自行设置 pt-15 避免遮挡 */
</style>
