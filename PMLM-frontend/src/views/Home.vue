<template>
  <div>
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
  <FlipCard back-class="bg-[#0f172a]/95 p-4 text-slate-200">
          <template #default>
            <div class="size-full rounded-2xl bg-[#0f172a]/90 flex items-center justify-center shadow-2xl shadow-black/40">
              <img src="/icons/病历信息.svg" alt="病历信息" class="w-24 h-24 opacity-90" />
              <div class="absolute bottom-4 left-4 text-xl font-bold text-white">病历信息</div>
            </div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-44">
              <h1 class="text-xl font-bold text-white">病历信息</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容一：病人状况与病程。</p>
              <button class="mt-2 rounded-md border border-gray-600 px-3 py-1.5 text-sm text-white/90 hover:bg-gray-800"
                      @click.stop="$router.push('/dashboard')">进入面板</button>
            </div>
          </template>
        </FlipCard>
  <FlipCard back-class="bg-[#0f172a]/95 p-4 text-slate-200">
          <template #default>
            <div class="size-full rounded-2xl bg-[#0f172a]/90 flex items-center justify-center shadow-2xl shadow-black/40">
              <img src="/icons/检测记录.svg" alt="检测记录" class="w-24 h-24 opacity-90" />
              <div class="absolute bottom-4 left-4 text-xl font-bold text-white">检测记录</div>
            </div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-44">
              <h1 class="text-xl font-bold text-white">检测记录</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容二：检测记录与提醒。</p>
              <button class="mt-2 rounded-md border border-gray-600 px-3 py-1.5 text-sm text-white/90 hover:bg-gray-800"
                      @click.stop="$router.push('/records')">进入记录</button>
            </div>
          </template>
        </FlipCard>
  <FlipCard back-class="bg-[#0f172a]/95 p-4 text-slate-200">
          <template #default>
            <div class="size-full rounded-2xl bg-[#0f172a]/90 flex items-center justify-center shadow-2xl shadow-black/40 cursor-pointer hover:ring-2 ring-blue-400/40 transition"
                 @click="goToConsult" role="button" aria-label="前往 AI 咨询" tabindex="0"
                 @keydown.enter.prevent="goToConsult" @keydown.space.prevent="goToConsult">
              <img src="/icons/AI咨询.svg" alt="AI 咨询" class="w-24 h-24 opacity-90" />
              <div class="absolute bottom-4 left-4 text-xl font-bold text-white">AI 咨询</div>
            </div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-44">
              <h1 class="text-xl font-bold text-white">AI咨询</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">内容三：随访与健康建议。</p>
              <button class="mt-2 rounded-md border border-gray-600 px-3 py-1.5 text-sm text-white/90 hover:bg-gray-800"
                      @click.stop="goToConsult">进入咨询</button>
            </div>
          </template>
        </FlipCard>
  <FlipCard back-class="bg-[#0f172a]/95 p-4 text-slate-200">
          <template #default>
            <div class="size-full rounded-2xl bg-[#0f172a]/90 flex items-center justify-center shadow-2xl shadow-black/40">
              <img src="/icons/更多功能.svg" alt="更多功能" class="w-24 h-24 opacity-90" />
              <div class="absolute bottom-4 left-4 text-xl font-bold text-white">更多功能</div>
            </div>
          </template>
          <template #back>
            <div class="flex min-h-full flex-col gap-2 w-full md:w-44">
              <h1 class="text-xl font-bold text-white">更多功能</h1>
              <p class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">敬请期待</p>
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
import MorphingTabs from "@/components/ui/morphing-tabs/MorphingTabs.vue";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button/InteractiveHoverButton.vue";

export default {
  name: 'Home',
  components: { FlipCard, Meteors },
  data() {
    return {
      userName: '',
      patientId: ''
    }
  },
  computed: {
    initials() {
      const name = (this.userName || 'U').trim();
      // 取前两个字符（兼容中文或英文），中文直接显示一个/两个汉字
      return name.slice(0,2).toUpperCase();
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
    goToConsult() {
      if (this.$router) {
        this.$router.push('/aichat')
      } else {
        window.location.href = '/aichat'
      }
    }
  }
}
</script>

<style>
/* 顶部居中导航若与其它元素冲突可以在小屏隐藏或改为下方 Tab */
</style>