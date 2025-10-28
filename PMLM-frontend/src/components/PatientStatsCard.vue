<template>
  <div class="w-full">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-auto">
      <div
        v-for="item in items"
        :key="item.key"
        class="flex flex-col p-4 rounded-xl bg-gray-800 bg-opacity-60"
      >
        <span class="text-xs text-slate-400">{{ item.label }}</span>
        <span class="text-base font-medium text-white">{{ valueOf(item.key) }}</span>
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
</style>
