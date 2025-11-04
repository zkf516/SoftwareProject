<template>
  <div
    :style="{ minHeight: 'calc(100vh - var(--header-height,146px))' }"
    class="flex flex-col items-center justify-center px-4 py-5 gap-6"
  >
    <!-- 卡片：血常规历史数据（统一样式） -->
    <div class="relative w-full max-w-4xl mx-auto flex justify-center h-[80vh]">
      <!-- 背景模糊层 -->
      <div class="absolute inset-0 scale-95 rounded-2xl bg-gray-800 blur-2xl opacity-40"></div>

      <!-- 主卡片层 -->
      <div
        class="relative flex flex-col items-stretch justify-start rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8 shadow-xl w-full h-full overflow-hidden"
      >
        <div class="absolute inset-0 pointer-events-none z-0">
          <Meteors />
        </div>

        <!-- 移除 overflow-auto，保持和 PatientStatsCard 容器一致，滚动由 RecordsCard 内部处理 -->
        <div class="relative z-10 w-full h-full">
          <div class="flex items-center justify-between mb-7">
            <h2 class="text-2xl font-bold text-white tracking-wide">血常规历史数据</h2>
            <button @click="openEditor" class="ml-4 rounded-md border border-gray-600 px-3 py-1.5 text-sm text-white/90 hover:bg-gray-800">修改</button>
          </div>
          <RecordsCard :records="records" />

          <!-- 编辑弹窗 -->
          <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50 z-0" @click="closeEditor"></div>
            <div class="relative z-20 w-full max-w-lg p-6 bg-gray-900 rounded-lg border border-gray-700">
              <h3 class="text-lg font-semibold text-white mb-4">添加 / 编辑 血常规记录</h3>
              <form @submit.prevent="saveRecord" class="space-y-3">
                    <div>
                      <label class="text-sm text-slate-300">检查日期</label>
                      <input v-model="form.date" type="date" class="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" required />
                    </div>

                    <!-- 列滑动窗口（垂直）：上下箭头控制，使用 scroll-snap-y 对齐 -->
                    <div class="relative mt-2">

                      <!-- 可滚动容器（垂直滚动） -->
                      <div ref="colScroller" class="overflow-y-auto no-scrollbar px-4" style="scroll-snap-type: y mandatory; max-height: 320px;">
                        <div class="flex flex-col gap-3 py-4">
                          <template v-for="field in formFields" :key="field.label">
                            <div class="w-full h-24" style="scroll-snap-align:start;">
                              <label class="text-sm text-slate-300">{{ field.label }}</label>
                              <input v-model="form[field.label]" :type="field.type || 'text'" step="any" class="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
                            </div>
                          </template>
                        </div>
                      </div>

                      <!--（已移除上下箭头，保留垂直滚动）-->
                    </div>

                    <div>
                      <label class="text-sm text-slate-300">备注</label>
                      <input v-model="form.note" type="text" class="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
                    </div>

                <div class="mt-4 flex justify-end gap-3">
                  <button type="button" @click="closeEditor" class="rounded-md border border-gray-600 px-4 py-2 text-sm text-white/90 hover:bg-gray-800">取消</button>
                  <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">保存</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecordsCard from '../components/RecordsCard.vue'
import { useRecordsStore } from '../store/records'
import Meteors from '@/components/ui/meteors/Meteors.vue'
const API_BASE = import.meta.env.VITE_API_BASE || ''

export default {
  name: 'RecordsPage',
  components: { RecordsCard, Meteors },
  computed: {
    records() {
      const rStore = useRecordsStore()
      return rStore.records
    },
    rError() {
      return useRecordsStore().error
    }
  },
  async mounted() {
    const rStore = useRecordsStore()
    await rStore.fetchForCurrent()
  }
  ,
  data() {
    return {
      editing: false,
      // 初始化 formFields 以确保模板使用时稳定并保持响应性
      formFields: [
        { label: '酸碱度', type: 'string' },
        { label: '白蛋白', type: 'string' },
        { label: '总蛋白', type: 'string' },
        { label: '间接胆红素', type: 'string' },
        { label: '直接胆红素', type: 'string' },
        { label: '总胆红素', type: 'string' },
        { label: '碱性磷酸酶', type: 'string' },
        { label: '丙氨酸氨基转移酶', type: 'string' },
        { label: '前白蛋白', type: 'string' },
        { label: '总胆汁酸', type: 'string' },
        { label: '大血小板数目', type: 'string' },
        { label: '血小板压积', type: 'string' },
        { label: '大血小板比率', type: 'string' },
        { label: '平均血小板体积', type: 'string' },
        { label: '血小板体积分布宽度', type: 'string' },
        { label: '红细胞体积分布宽度变异系数', type: 'string' },
        { label: '红细胞体积分布宽度标准差', type: 'string' },
        { label: '嗜碱性粒细胞绝对数', type: 'string' },
        { label: '嗜酸性粒细胞绝对数', type: 'string' },
        { label: '单核细胞绝对数', type: 'string' },
        { label: '淋巴细胞绝对数', type: 'string' },
        { label: '中性粒细胞绝对数', type: 'string' },
        { label: '嗜碱性粒细胞比率', type: 'string' },
        { label: '嗜酸性粒细胞比率', type: 'string' },
        { label: '单核细胞比率', type: 'string' },
        { label: '淋巴细胞比率', type: 'string' },
        { label: '中性粒细胞比率', type: 'string' },
        { label: '平均红细胞血红蛋白浓度', type: 'string' },
        { label: '平均红细胞血红蛋白含量', type: 'string' },
        { label: '血细胞比容', type: 'string' },
        { label: '白细胞计数', type: 'string' },
        { label: '血小板总数', type: 'string' },
        { label: '血红蛋白', type: 'string' },
        { label: '平均红细胞体积', type: 'string' },
        { label: '红细胞计数', type: 'string' }
      ],
      form: {
        // 使用中文标签作为键名
        '检查日期': '',
        '备注': '',
        '酸碱度': '', '白蛋白': '', '总蛋白': '', '间接胆红素': '', '直接胆红素': '', '总胆红素': '', '碱性磷酸酶': '', '丙氨酸氨基转移酶': '', '前白蛋白': '', '总胆汁酸': '', '大血小板数目': '', '血小板压积': '', '大血小板比率': '', '平均血小板体积': '', '血小板体积分布宽度': '', '红细胞体积分布宽度变异系数': '', '红细胞体积分布宽度标准差': '', '嗜碱性粒细胞绝对数': '', '嗜酸性粒细胞绝对数': '', '单核细胞绝对数': '', '淋巴细胞绝对数': '', '中性粒细胞绝对数': '', '嗜碱性粒细胞比率': '', '嗜酸性粒细胞比率': '', '单核细胞比率': '', '淋巴细胞比率': '', '中性粒细胞比率': '', '平均红细胞血红蛋白浓度': '', '平均红细胞血红蛋白含量': '', '血细胞比容': '', '白细胞计数': '', '血小板总数': '', '血红蛋白': '', '平均红细胞体积': '', '红细胞计数': ''
      }
    }
  },
  
  methods: {
    openEditor() {
      // 初始化表单，默认日期为今天
      const d = new Date().toISOString().slice(0,10)
      // 使用中文标签初始化所有字段
      const labels = [
        '检查日期', '备注', '酸碱度', '白蛋白', '总蛋白', '间接胆红素', '直接胆红素', '总胆红素', '碱性磷酸酶', '丙氨酸氨基转移酶', '前白蛋白', '总胆汁酸', '大血小板数目', '血小板压积', '大血小板比率', '平均血小板体积', '血小板体积分布宽度', '红细胞体积分布宽度变异系数', '红细胞体积分布宽度标准差', '嗜碱性粒细胞绝对数', '嗜酸性粒细胞绝对数', '单核细胞绝对数', '淋巴细胞绝对数', '中性粒细胞绝对数', '嗜碱性粒细胞比率', '嗜酸性粒细胞比率', '单核细胞比率', '淋巴细胞比率', '中性粒细胞比率', '平均红细胞血红蛋白浓度', '平均红细胞血红蛋白含量', '血细胞比容', '白细胞计数', '血小板总数', '血红蛋白', '平均红细胞体积', '红细胞计数'
      ]
      const obj = { '检查日期': d, '备注': '' }
      for (const label of labels) if (!(label in obj)) obj[label] = ''
      this.form = obj
      this.editing = true
    },
    closeEditor() {
      this.editing = false
    },
    async saveRecord() {
      try {
        const token = localStorage.getItem('token')
        // 构建符合要求的数据结构，使用中文标签作为键
        const payload = {}
        
        // 处理检查日期
        if (this.form['检查日期']) {
          payload['检查日期'] = this.form['检查日期']
        }
        
        // 处理所有检测项，只包含有值的字段
        for (const field of this.formFields) {
          payload[field.label] = this.form[field.label]
        }
        
        // 处理备注
        if (this.form['备注']) {
          payload['备注'] = this.form['备注']
        }
        
        const res = await fetch(`${API_BASE}/api/record`, {
          method: 'POST', // 或其他 HTTP 方法
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        
        // 尝试解析响应，若非 JSON 则读取文本用于消息
        let data = null
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) data = await res.json()
        else data = { ok: res.ok }

        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

        // 刷新记录
        const rStore = useRecordsStore()
        await rStore.fetchForCurrent(true)
        
        // *** 插入成功反馈 ***
        // 使用 alert 提供最简单的成功反馈，保持与错误处理一致
        // 在实际应用中，推荐使用不那么侵入式的通知/Toast组件。
        alert('记录保存成功！') 
        // *********************

        this.editing = false
      } catch (e) {
        alert(e.message || '保存失败')
      }
    }
  }
}
</script>

<style scoped>
.banner {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.banner.info {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
}
.banner.error {
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
}
</style>