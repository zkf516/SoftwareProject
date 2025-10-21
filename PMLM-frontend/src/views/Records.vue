<template>
  <div class="dashboard-grid dashboard-grid--single-right">
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
      <div v-if="rError" class="banner error">{{ rError }}</div>
      <RecordsCard :records="records" />
    </div>
  </div>
</template>

<script>
import PatientInfoCard from '../components/PatientInfoCard.vue'
import RecordsCard from '../components/RecordsCard.vue'
import { usePatientStore } from '../store/patient'
import { useRecordsStore } from '../store/records'

export default {
  name: 'RecordsPage',
  components: { PatientInfoCard, RecordsCard },
  computed: {
    patient() {
      const store = usePatientStore()
      return store.patient
    },
    records() {
      const rStore = useRecordsStore()
      return rStore.records
    },
    pError() { return usePatientStore().error },
    rError() { return useRecordsStore().error }
  },
  async mounted() {
    const pStore = usePatientStore()
    const role = localStorage.getItem('role')
    // 病人角色才需要获取个人信息；医生角色通常由选择患者来决定当前上下文
    if (role === 'patient') {
      await pStore.fetchMe()
    }
    const rStore = useRecordsStore()
    await rStore.fetchForCurrent()
  },
  methods: {}
}
</script>

<style scoped>
/* 复用全局 .dashboard-grid */
</style>
