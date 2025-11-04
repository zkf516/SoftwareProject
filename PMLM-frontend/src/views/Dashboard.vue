<template>
  <div :style="{ minHeight: 'calc(100vh - var(--header-height,64px))' }" class="flex flex-col items-center justify-center px-4 py-5 gap-6">
    <!-- 卡片一：实时监测与统计 -->
    <div class="relative w-full max-w-4xl mx-auto flex justify-center h-[50vh]">
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>
      <div class="relative flex flex-col items-stretch justify-start rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full h-full overflow-hidden">
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>
        <div class="relative z-10 w-full h-full">
          <!-- 标题与修改按钮 -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-white tracking-wide">实时监测与统计</h2>
            <button @click="openEditor" class="ml-4 rounded-md border border-gray-600 px-3 py-1.5 text-sm text-white/90 hover:bg-gray-800">修改</button>
          </div>
          <PatientStatsCard :patient="patient" />
        </div>
      </div>
    </div>

    <!-- 卡片二：医生笔记与病程 -->
    <div class="relative w-full max-w-4xl mx-auto flex justify-center h-[35vh]">
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>
      <div class="relative flex flex-col items-stretch justify-start rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full h-full overflow-hidden">
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>
        <div class="relative z-10 w-full h-full overflow-auto">
          <h2 class="mb-4 text-2xl font-bold text-white tracking-wide">医生笔记与病程</h2>
          <PatientNotesCard :patient="patient" />
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 (已移动到组件根部以确保最高层级) -->
    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 z-0" @click="closeEditor"></div>
      <div class="relative z-20 w-full max-w-lg p-6 bg-gray-900 rounded-lg border border-gray-700">
        <h3 class="text-lg font-semibold text-white mb-4">编辑病人信息</h3>
        <form @submit.prevent="savePatient" class="space-y-3">
          <!-- 可滚动表单区域 -->
          <div class="overflow-y-auto no-scrollbar pr-2" style="max-height: 400px;">
            <div class="flex flex-col gap-3">
              <template v-for="field in patientFormFields" :key="field.label">
                <div>
                  <label class="text-sm text-slate-300">{{ field.label }}</label>
                  <input v-model="form[field.label]" :type="field.type" :placeholder="field.placeholder || ''" class="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
                </div>
              </template>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="mt-4 flex justify-end gap-3">
            <button type="button" @click="closeEditor" class="rounded-md border border-gray-600 px-4 py-2 text-sm text-white/90 hover:bg-gray-800">取消</button>
            <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">保存</button>
          </div>
        </form>
      </div>
    </div>

  </div>
  
</template>

<script>
import PatientStatsCard from '../components/PatientStatsCard.vue'
import PatientNotesCard from '../components/PatientNotesCard.vue'
import { usePatientStore } from '../store/patient'
import Meteors from '@/components/ui/meteors/Meteors.vue'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export default {
  name: 'DashboardPage',
  components: { PatientStatsCard, PatientNotesCard, Meteors },
  data() {
    return {
      editing: false,
      patientFormFields: [
        { label: '血压', type: 'string', placeholder: '例如: 120/80' },
        { label: '孕周', type: 'string' },
        { label: '孕次', type: 'string' },
        { label: '产次', type: 'string' },
        { label: '入院诊断', type: 'string' },
        { label: '出院诊断', type: 'string' },
        { label: '孕前体重', type: 'string', placeholder: 'kg' },
        { label: '入院体重', type: 'string', placeholder: 'kg' },
        { label: '婴儿性别', type: 'string', placeholder: '男/女' },
        { label: '胎儿体重', type: 'string', placeholder: 'g' },
        { label: '胎儿身长', type: 'string', placeholder: 'cm' },
        { label: '分娩方式', type: 'string', placeholder: '例如: 顺产/剖宫产' }
      ],
      form: {}
    }
  },
  mounted() {
    this.ensurePatient()
  },
  computed: {
    patient() {
      const store = usePatientStore()
      return store.patient
    },
    pError() {
      return usePatientStore().error
    }
  },
  methods: {
    ensurePatient() {
      const store = usePatientStore()
      const role = localStorage.getItem('role')
      if (role === 'patient') {
        store.fetchMe()
      }
    },
    openEditor() {
      // 从当前 patient 对象初始化表单数据
      this.form = this.patientFormFields.reduce((acc, field) => {
        acc[field.label] = this.patient ? (this.patient[field.label] || '') : ''
        return acc
      }, {})
      this.editing = true
    },
    closeEditor() {
      this.editing = false
    },
    async savePatient() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('认证令牌无效')

        // 后端会处理传入的字段，我们直接发送整个表单
        const payload = this.form
        
        const res = await fetch(`${API_BASE}/api/patient/update`, {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        
        let data = null
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          data = await res.json()
        }

        if (!res.ok) {
          throw new Error(data?.error || `HTTP 错误 ${res.status}`)
        }

        // 成功后，刷新 patient store 中的数据
        const store = usePatientStore()
        await store.fetchMe(true) // 强制刷新
        
        // *** 插入成功反馈 ***
        // 使用 alert 提供最简单的成功反馈
        alert('个人信息保存成功！') 
        // *********************

        this.closeEditor()
      } catch (e) {
        alert(e.message || '保存失败')
      }
    }
  }
}
</script>

<style scoped>
/* 使用全局的 .dashboard-grid 与卡片滚动规则；此处不做覆盖，避免与 PatientInfoCard 冲突 */
.banner { padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; }
.banner.info { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
.banner.error { background: rgba(255,0,0,0.1); color: #ff6b6b; }

/* 隐藏滚动条，保持样式统一 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>