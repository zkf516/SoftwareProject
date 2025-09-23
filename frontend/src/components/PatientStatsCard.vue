<template>
  <div class="card stats-card">
    <h3 class="card-title">患者特征：孕妇</h3>
    <div class="vital-signs">
      <div
        class="data-group"
        v-for="item in items"
        :key="item.key"
      >
        <p class="infomation">{{ item.label }}</p>
        <p class="data">{{ valueOf(item.key) }}</p>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'PatientStatsCard',
  props: {
    patient: { type: Object, default: null }
  },
  computed: {
    p() { return this.patient },
    items() {
      return [
        { key: 'bp', label: '血压', idx: 15 },
        { key: 'gestWeek', label: '孕周', idx: 14 },
        { key: 'gravida', label: '孕次', idx: 16 },
        { key: 'para', label: '产次', idx: 17 },
        { key: 'admDx', label: '入院诊断', idx: 5 },
        { key: 'disDx', label: '出院诊断', idx: 6 },
        { key: 'preWt', label: '孕前体重', idx: 12 },
        { key: 'admWt', label: '入院体重', idx: 13 },
        { key: 'babySex', label: '婴儿性别', idx: 9 },
        { key: 'fetalWt', label: '胎儿体重', idx: 19 },
        { key: 'fetalLen', label: '胎儿身长', idx: 8 },
        { key: 'delivery', label: '分娩方式', idx: 20 }
      ]
    }
  },
  methods: {
    valueOf(key) {
      const cfg = this.items.find((i) => i.key === key)
      if (!cfg || !this.p) return '--'
      // 对象字段映射（尽可能贴近中文列名）
      const map = {
        bp: ['血压', 'bp', 'BloodPressure'],
        gestWeek: ['孕周', 'gestWeek'],
        gravida: ['孕次', 'gravida'],
        para: ['产次', 'para'],
        admDx: ['入院诊断', 'admDx'],
        disDx: ['出院诊断', 'disDx'],
        preWt: ['孕前体重', 'preWt'],
        admWt: ['入院体重', 'admWt'],
        babySex: ['婴儿性别', 'babySex'],
        fetalWt: ['胎儿体重', 'fetalWt'],
        fetalLen: ['胎儿身长', 'fetalLen'],
        delivery: ['分娩方式', 'delivery']
      }
      const keys = map[key] || []
      for (const k of keys) {
        if (this.p[k] !== undefined && this.p[k] !== null && this.p[k] !== '') return this.p[k]
      }
      return '--'
    }
  }
}
</script>

<style scoped>
/* 让卡片本身可以变“矮”，且内部自己滚动 */
.stats-card {
  padding: 0.7rem 1.2rem 1.5rem;
  max-height: 360px;
  display: flex;
  flex-direction: column;
}

.card-title {
  margin: 0.7rem;
  color: var(--accent);
  font-size: 1.4rem;
}

.vital-signs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  overflow: auto;
}

.data-group {
  display: flex;
  gap: 70px;
  padding: 8px 25px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
}

.infomation {
  color: var(--accent);
  border-left: 3px solid var(--accent);
  padding-left: 0.5rem;
  min-width: 74px;
  font-size: 0.95rem;
}

.data {
  color: #fff;
  font-size: 0.95rem;
}

@media (max-width: 1200px) {
  .vital-signs {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .vital-signs {
    grid-template-columns: 1fr;
  }
}
</style>
