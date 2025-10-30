<template>
  <div
    :style="{ minHeight: 'calc(100vh - var(--header-height,146px))' }"
    class="flex flex-col items-center justify-center px-4 py-5 gap-6"
  >
    <!-- 卡片：血常规历史数据（统一样式） -->
    <div class="relative w-full max-w-4xl mx-auto flex justify-center h-[80vh]">
      <!-- 背景模糊层 -->
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>

      <!-- 主卡片层 -->
      <div
        class="relative flex flex-col items-stretch justify-start rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full h-full overflow-hidden"
      >
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>

        <!-- 移除 overflow-auto，保持和 PatientStatsCard 容器一致，滚动由 RecordsCard 内部处理 -->
        <div class="relative z-10 w-full h-full">
          <h2 class="mb-4 text-2xl font-bold text-white tracking-wide">血常规历史数据</h2>
          <RecordsCard :records="records" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecordsCard from '../components/RecordsCard.vue'
import { useRecordsStore } from '../store/records'
import Meteors from '@/components/ui/meteors/Meteors.vue'

export default {
  name: 'RecordsPage',
  components: { RecordsCard, Meteors },
  computed: {
    records() {
      const rStore = useRecordsStore()
      return rStore.records
    },
    rError() {
      return useRecordsStore().error
    }
  },
  async mounted() {
    const rStore = useRecordsStore()
    await rStore.fetchForCurrent()
  }
}
</script>

<style scoped>
.banner {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.banner.info {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
}
.banner.error {
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
}
</style>