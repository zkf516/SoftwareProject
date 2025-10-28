<template>
  <div :style="{ minHeight: 'calc(100vh - var(--header-height,64px))' }" class="flex flex-col items-center justify-center px-4 py-5 gap-6">
    <!-- 卡片一：实时监测与统计（参考 Home 布局） -->
    <div class="relative w-full max-w-4xl mx-auto flex justify-center h-[50vh]">
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>
      <div class="relative flex flex-col items-stretch justify-start rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full h-full overflow-hidden">
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>
        <div class="relative z-10 w-full h-full">
          <h2 class="mb-4 text-2xl font-bold text-white tracking-wide">实时监测与统计</h2>
          <PatientStatsCard :patient="patient" />
        </div>
      </div>
    </div>

    <!-- 卡片二：医生笔记与病程（参考 Home 布局） -->
    <div class="relative w-full max-w-4xl mx-auto flex justify-center h-[35vh]">
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>
      <div class="relative flex flex-col items-stretch justify-start rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full h-full overflow-hidden">
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>
        <div class="relative z-10 w-full h-full overflow-auto">
          <h2 class="mb-4 text-2xl font-bold text-white tracking-wide">医生笔记与病程</h2>
          <PatientNotesCard :patient="patient" />
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import PatientStatsCard from '../components/PatientStatsCard.vue'
import PatientNotesCard from '../components/PatientNotesCard.vue'
import { usePatientStore } from '../store/patient'
import Meteors from '@/components/ui/meteors/Meteors.vue'

export default {
  name: 'DashboardPage',
  components: { PatientStatsCard, PatientNotesCard, Meteors },
  mounted() {
    this.ensurePatient()
  },
  computed: {
    patient() {
      const store = usePatientStore()
      return store.patient
    },
    pError() {
      return usePatientStore().error
    }
  },
  methods: {
    ensurePatient() {
      const store = usePatientStore()
      const role = localStorage.getItem('role')
      if (role === 'patient') {
        store.fetchMe()
      }
    }
  }
}
</script>

<style scoped>
/* 使用全局的 .dashboard-grid 与卡片滚动规则；此处不做覆盖，避免与 PatientInfoCard 冲突 */
.banner { padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; }
.banner.info { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
.banner.error { background: rgba(255,0,0,0.1); color: #ff6b6b; }
</style>
