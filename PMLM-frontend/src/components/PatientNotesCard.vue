<template>
  <div class="card notes-card">
    <h3 class="card-title">患者体征</h3>
    <div class="data"><p style="white-space: pre-line">{{ notes }}</p></div>
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
.notes-card { 
  padding: 0.7rem 1.2rem 1.5rem; 
}
.card-title {
  margin: 0.7rem;
  color: var(--accent); 
  font-size: 1.4rem;
}
.data { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px; }
</style>
