<template>
  <div class="card notes-card">
    <h3 class="card-title">患者体征</h3>
    <div class="data"><p style="white-space: pre-line">{{ notes }}</p></div>
  </div>
</template>

<script>
export default {
  name: 'PatientNotesCard',
  props: { patient: { type: Array, default: null } },
  computed: {
    // 原始脚本中似乎从 firstRow[23] 取备注（未完全确定），这里提供占位逻辑
    notes() {
      // 优先从 localStorage 的某个键读取（如果你有定义的话），否则返回占位
      const k = 'patientNotes'
      try { const s = localStorage.getItem(k); if (s) return s } catch (_) {}
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
