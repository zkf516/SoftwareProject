import { defineStore } from 'pinia'
import { usePatientStore } from './patient'

export const useRecordsStore = defineStore('records', {
    state: () => ({
        records: [],
        loading: false,
        error: null,
        lastLoadedKey: null, // 'self'（病人自己）或具体住院号字符串
        lastLoadedAt: 0
    }),
    actions: {
        async fetchMine(force = false) {
            if (this.lastLoadedKey === 'self' && !force && this.records?.length) return
            await this._doFetch('http://localhost:3000/api/patient/records', 'self')
        },
        async fetchByInNo(inNo, force = false) {
            if (!inNo) { this.error = '缺少住院号'; return }
            if (this.lastLoadedKey === inNo && !force && this.records?.length) return
            const url = `http://localhost:3000/api/patient/records?patient_id=${encodeURIComponent(inNo)}`
            await this._doFetch(url, inNo)
        },
        async fetchForCurrent(force = false) {
            const role = localStorage.getItem('role')
            if (role === 'patient') return this.fetchMine(force)
            // doctor
            const pStore = usePatientStore()
            const inNo = pStore.patient?.['住院号'] || pStore.patient?.inNo
            return this.fetchByInNo(inNo, force)
        },
        _normalizeRecords(list) {
            const map = {
                date: ['date', '日期', '检查日期', '检验日期', '报告时间', '时间'],
                ph: ['ph', '酸碱度'],
                alb: ['alb', '白蛋白'],
                tp: ['tp', '总蛋白'],
                ibil: ['ibil', '间接胆红素'],
                dbil: ['dbil', '直接胆红素'],
                tbil: ['tbil', '总胆红素'],
                alp: ['alp', '碱性磷酸酶'],
                alt: ['alt', '丙氨酸氨基转移酶', '谷丙转氨酶'],
                prealb: ['prealb', '前白蛋白'],
                tba: ['tba', '总胆汁酸'],
                lplt: ['lplt', '大血小板数目'],
                pcrit: ['pcrit', '血小板压积'],
                lpr: ['lpr', '大血小板比率'],
                mpv: ['mpv', '平均血小板体积'],
                pdw: ['pdw', '血小板体积分布宽度'],
                rdw_cv: ['rdw_cv', '红细胞体积分布宽度变异系数'],
                rdw_sd: ['rdw_sd', '红细胞体积分布宽度标准差'],
                baso_abs: ['baso_abs', '嗜碱性粒细胞绝对数'],
                eos_abs: ['eos_abs', '嗜酸性粒细胞绝对数'],
                mono_abs: ['mono_abs', '单核细胞绝对数'],
                lymph_abs: ['lymph_abs', '淋巴细胞绝对数'],
                neut_abs: ['neut_abs', '中性粒细胞绝对数'],
                baso_pct: ['baso_pct', '嗜碱性粒细胞比率'],
                eos_pct: ['eos_pct', '嗜酸性粒细胞比率'],
                mono_pct: ['mono_pct', '单核细胞比率'],
                lymph_pct: ['lymph_pct', '淋巴细胞比率'],
                neut_pct: ['neut_pct', '中性粒细胞比率'],
                mchc: ['mchc', '平均红细胞血红蛋白浓度'],
                mch: ['mch', '平均红细胞血红蛋白含量'],
                hct: ['hct', '血细胞比容'],
                wbc: ['wbc', '白细胞计数'],
                platelet: ['platelet', '血小板总数', 'plt'],
                hgb: ['hgb', '血红蛋白'],
                mcv: ['mcv', '平均红细胞体积'],
                rbc: ['rbc', '红细胞计数']
            }
            const pick = (obj, keys) => {
                for (const k of keys) if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k]
                return undefined
            }
            return (Array.isArray(list) ? list : []).map(raw => {
                const norm = {}
                for (const canon in map) norm[canon] = pick(raw, map[canon])
                return norm
            })
        },
        async _doFetch(url, key) {
            try {
                this.loading = true
                this.error = null
                const token = localStorage.getItem('token')
                const res = await fetch(url, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
                const data = await res.json()
                if (!res.ok) throw new Error(data?.error || '加载记录失败')
                this.records = this._normalizeRecords(data)
                this.lastLoadedKey = key
                this.lastLoadedAt = Date.now()
            } catch (e) {
                console.error('[recordsStore] fetch error:', e)
                this.error = e.message
                this.records = []
            } finally {
                this.loading = false
            }
        },
        clear() {
            this.records = []
            this.error = null
            this.loading = false
            this.lastLoadedKey = null
            this.lastLoadedAt = 0
        }
    }
})
