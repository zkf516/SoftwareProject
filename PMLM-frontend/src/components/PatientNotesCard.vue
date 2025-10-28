<template>
  <div class="w-full">
    <div class="flex flex-col p-4 rounded-xl bg-gray-800 bg-opacity-60">
      <span class="text-base font-medium text-white/90 whitespace-pre-line pb-2">备注</span>
      <p class="text-xs text-slate-400 p-1">{{ notes }}</p>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'PatientNotesCard',
  props: { patient: { type: Object, default: null } },
  computed: {
    // 原始脚本中似乎从 firstRow[23] 取备注（未完全确定），这里提供占位逻辑
    notes() {
      const p = this.patient
      if (p && typeof p === 'object') {
        const candidates = ['备注', 'notes', '体征', 'signs']
        for (const k of candidates) { if (p[k]) return String(p[k]) }
      }
      return '— 无备注 —'
    }
  }
}
</script>

<style scoped>
</style>
