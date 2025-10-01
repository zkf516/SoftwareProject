import { defineStore } from 'pinia'

const API_BASE = import.meta.env.VITE_API_BASE

export const usePatientStore = defineStore('patient', {
    state: () => ({
        patient: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchMe(force = false) {
            if (this.patient && !force) return
            try {
                this.loading = true
                this.error = null
                const token = localStorage.getItem('token')
                const res = await fetch(`${API_BASE}/api/patient/me`, {
                    headers: { Authorization: token ? `Bearer ${token}` : '' }
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || '获取个人信息失败')
                this.patient = data
            } catch (e) {
                console.error('[patientStore] fetchMe error:', e)
                this.error = e.message
                this.patient = null
            } finally {
                this.loading = false
            }
        },
        clear() {
            this.patient = null
            this.error = null
            this.loading = false
        }
    }
})
