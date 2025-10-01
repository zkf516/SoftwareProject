<template>
  <!-- 病人信息卡片区块，流星特效参考原InspiraUI布局优化 -->
  <div class="relative w-full max-w-4xl mx-auto my-6 flex justify-center">
    <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>
    <div class="relative flex flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full max-w-4xl overflow-hidden">
      <!-- Meteors特效绝对定位在卡片顶部，overflow-hidden限制范围 -->
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
  <div class="w-full max-w-4xl mx-auto py-8 overflow-x-auto">
    <div class="flex flex-col md:flex-row flex-nowrap justify-center items-stretch gap-6 min-w-0">
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
</template>

<script>
import FlipCard from '../components/InspiraUI/FlipCard.vue'
import Meteors from "@/components/ui/meteors/Meteors.vue";

export default {
  name: 'Home',
  components: { FlipCard, Meteors }
}
</script>

<style>
/* 移除横向滚动的 min-width，保证响应式 */
</style>