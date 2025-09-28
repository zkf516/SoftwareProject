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
  <button class="nav-btn" @click="onLogout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { usePatientStore } from '../stores/patient'
import { useRecordsStore } from '../stores/records'
export default {
  name: 'PatientInfoCard',
  props: {
    // 仅保留对象形态：来自 /api/patient/me
    patient: { type: Object, required: false, default: null }
  },
  methods: {
    onLogout() {
      try { localStorage.removeItem('token'); localStorage.removeItem('role') } catch (_) {}
      try { usePatientStore().clear() } catch (_) {}
      try { useRecordsStore().clear() } catch (_) {}
      this.$router.push('/login')
    }
  },
  computed: {
    p() { return this.patient },
    // 以下字段从对象键读取
    name() {
      if (!this.p) return '---'
      return this.p['姓名'] || this.p['name'] || '---'
    },
    idNo() {
      if (!this.p) return '--'
      return this.p['身份证号'] || this.p['id'] || this.p['idNo'] || '--'
    },
    inNo() {
      if (!this.p) return '--'
      return this.p['住院号'] || this.p['inNo'] || '--'
    },
    cardNo() {
      if (!this.p) return '--'
      return this.p['CARDNO'] || this.p['cardNo'] || '--'
    },
    gender() {
      if (!this.p) return '--'
      return this.p['性别'] || this.p['gender'] || '--'
    },
    age() {
      if (!this.p) return '--'
      return this.p['年龄'] || this.p['age'] || '--'
    },
    height() {
      if (!this.p) return '--'
      return this.p['身高'] || this.p['height'] || '--'
    },
    inpatient() {
      if (!this.p) return '--'
      return this.p['是否住院'] || this.p['inpatient'] || '--'
    }
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
