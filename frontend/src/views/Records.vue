<template>
  <div class="dashboard-grid dashboard-grid--single-right">
    <div class="left">
      <PatientInfoCard
        @to-dashboard="() => $router.push('/dashboard')"
        @to-records="() => $router.push('/records')"
        @to-chat="() => $router.push('/chat')"
        @next="goNext"
      />
    </div>
    <div class="right-top">
      <RecordsCard />
    </div>
  </div>
</template>

<script>
import PatientInfoCard from '../components/PatientInfoCard.vue'
import RecordsCard from '../components/RecordsCard.vue'

export default {
  name: 'RecordsPage',
  components: { PatientInfoCard, RecordsCard },
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
/* 复用全局 .dashboard-grid */
</style>
