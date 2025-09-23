<template>
  <div class="dashboard-grid dashboard-grid--top-auto">
    <div class="left">
      <PatientInfoCard
        @to-dashboard="() => $router.push('/dashboard')"
        @to-records="() => $router.push('/records')"
        @to-chat="() => $router.push('/chat')"
        @next="goNext"
      />
    </div>
    <div class="right-top">
      <PatientStatsCard />
    </div>
    <div class="right-bottom">
      <PatientNotesCard />
    </div>
  </div>
</template>

<script>
import PatientInfoCard from '../components/PatientInfoCard.vue'
import PatientStatsCard from '../components/PatientStatsCard.vue'
import PatientNotesCard from '../components/PatientNotesCard.vue'

export default {
  name: 'DashboardPage',
  components: { PatientInfoCard, PatientStatsCard, PatientNotesCard },
  methods: {
    async goNext() {
      try {
        const currentIndex = parseInt(localStorage.getItem('loggedInIndex'))
        const nextIndex = isNaN(currentIndex) ? 0 : currentIndex + 1
        const resp = await fetch(`http://localhost:3000/getRowByIndex?index=${nextIndex}`)
        if (!resp.ok) throw new Error('无数据或服务器错误')
        const nextRow = await resp.json()
        localStorage.setItem('loggedInIndex', nextIndex)
        localStorage.setItem('loggedInUser', JSON.stringify(nextRow))
        this.$router.push('/dashboard')
      } catch (e) {
        alert('已经是最后一位病人或发生错误！')
        console.error('获取下一位病人失败：', e)
      }
    }
  }
}
</script>

<style scoped>
/* 使用全局的 .dashboard-grid 与卡片滚动规则；此处不做覆盖，避免与 PatientInfoCard 冲突 */
</style>
