<template>
  <div class="card patient-card">
    
    <div class="info-list">
      <div class="row"><span class="label">姓名</span><span class="value">{{ name }}</span></div>
      <div class="row"><span class="label">身份证号</span><span class="value">{{ idNo }}</span></div>
      <div class="row"><span class="label">住院号</span><span class="value">{{ inNo }}</span></div>
      <div class="row"><span class="label">CARDNO</span><span class="value">{{ cardNo }}</span></div>
      <div class="row"><span class="label">性别</span><span class="value">{{ gender }}</span></div>
      <div class="row"><span class="label">年龄</span><span class="value">{{ age }}</span></div>
      <div class="row"><span class="label">身高</span><span class="value">{{ height }}</span></div>
      <div class="row"><span class="label">是否住院</span><span class="value">{{ inpatient }}</span></div>
    </div>

    <div class="nav">
      <button class="nav-btn" @click="$emit('to-dashboard')">基本信息</button>
      <button class="nav-btn" @click="$emit('to-records')">病历数据</button>
      <button class="nav-btn" @click="$emit('to-chat')">医疗建议</button>
      <button class="nav-btn" @click="$emit('next')">下一页</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientInfoCard',
  props: {
    patient: { type: Array, default: null }
  },
  computed: {
    p() {
      if (this.patient && Array.isArray(this.patient)) return this.patient
      try {
        const cached = JSON.parse(localStorage.getItem('loggedInUser'))
        return Array.isArray(cached) ? cached : null
      } catch (_) { return null }
    },
    name() { return this.p?.[1] ?? '---' },
    idNo() { return '--' },
    inNo() { return this.p?.[2] ?? '--' },
    cardNo() { return this.p?.[4] ?? '--' },
    gender() { return '--' },
    age() { return this.p?.[10] ?? '--' },
    height() { return this.p?.[11] ?? '--' },
    inpatient() { return this.p?.[3] ?? '--' }
  }
}
</script>

<style scoped>
.patient-card {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-title { margin: 0 0 0.75rem 0; color: var(--accent); }

/* 顶部信息区：自然高度，正常间距，不产生滚动条 */
.info-list {
  /* 顶部信息区占卡片高度上限约 40%（内容少时不强制拉伸） */
  max-height: 50%;
  overflow: auto; /* 仅当内容超出 40% 时才出现滚动 */
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 12px;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.row:last-child { border-bottom: none; }
.label { color: rgba(255,255,255,0.85); }
.value { color: #fff; }

/* 底部按钮区：固定在父容器底部 */
.nav {
  flex: 0 0 auto; /* 不参与拉伸 */
  display: flex;
  flex-direction: column;
  gap: 20px;              /* 按钮之间更大间隔 */
  margin-top: auto;       /* 推到容器底部 */
}
.nav-btn {
  background: rgba(26, 35, 51, 0.9);
  color: #fff;
  padding: 0 20px;        /* 横向留白增大 */
  min-height: 65px;       /* 按钮更高，更易点击 */
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(0,255,224,0.1);
  transition: transform .2s ease, opacity .2s ease;
}
.nav-btn:hover { transform: translateY(-1px); opacity: .95; }
</style>
