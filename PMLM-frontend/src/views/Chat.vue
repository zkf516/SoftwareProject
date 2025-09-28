<template>
  <div class="dashboard-grid dashboard-grid--single-right">
    <div class="left">
      <PatientInfoCard
        :patient="patient"
        @to-dashboard="() => $router.push('/dashboard')"
        @to-records="() => $router.push('/records')"
        @to-chat="() => $router.push('/chat')"
      />
    </div>
    <div class="right-top">
      <ChatCard />
    </div>
  </div>
</template>

<script>
import PatientInfoCard from '../components/PatientInfoCard.vue'
import ChatCard from '../components/ChatCard.vue'
import { usePatientStore } from '../stores/patient'

export default {
  name: 'ChatPage',
  components: { PatientInfoCard, ChatCard },
  computed: {
    patient() {
      const store = usePatientStore()
      return store.patient
    }
  },
  mounted() {
    const store = usePatientStore()
    const role = localStorage.getItem('role')
    if (role === 'patient') {
      store.fetchMe()
    }
  }
}
</script>

<style scoped>
/* 页面自身无需额外布局，复用全局 .dashboard-grid 样式 */
</style>
