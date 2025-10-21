<template>
  <div class="dashboard-grid dashboard-grid--top-auto">
    <div class="left">
      <div v-if="pError" class="banner error">{{ pError }}</div>
      <PatientInfoCard
        :patient="patient"
        @to-dashboard="() => $router.push('/dashboard')"
        @to-records="() => $router.push('/records')"
        @to-chat="() => $router.push('/chat')"
      />
    </div>
    <div class="right-top">
      <PatientStatsCard :patient="patient" />
    </div>
    <div class="right-bottom">
      <PatientNotesCard :patient="patient" />
    </div>
  </div>
</template>

<script>
import PatientInfoCard from '../components/PatientInfoCard.vue'
import PatientStatsCard from '../components/PatientStatsCard.vue'
import PatientNotesCard from '../components/PatientNotesCard.vue'
import { usePatientStore } from '../store/patient'

export default {
  name: 'DashboardPage',
  components: { PatientInfoCard, PatientStatsCard, PatientNotesCard },
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
