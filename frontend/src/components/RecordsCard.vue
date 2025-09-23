<template>
	<div class="card records-card">
		<h3 class="card-title">血常规历史数据</h3>
		<div class="table-scroll">
			<table class="data-table">
				<thead>
					<tr>
						<th v-for="col in columns" :key="col.key">{{ col.label }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(row, idx) in rows" :key="idx">
						<td v-for="col in columns" :key="col.key"
							:class="col.key !== 'date' ? abnClass(col.key, row[col.key]) : null">
							{{ col.key === 'date' ? row.date : formatVal(col.key, row[col.key]) }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { labRanges } from '../config/labRanges'

export default {
	name: 'RecordsCard',
	data() {
		return {
			rows: this.loadRows(),
			columns: [
				{ key: 'date', label: '检查日期' },
				{ key: 'ph', label: '酸碱度' },
				{ key: 'alb', label: '白蛋白' },
				{ key: 'tp', label: '总蛋白' },
				{ key: 'ibil', label: '间接胆红素' },
				{ key: 'dbil', label: '直接胆红素' },
				{ key: 'tbil', label: '总胆红素' },
				{ key: 'alp', label: '碱性磷酸酶' },
				{ key: 'alt', label: '丙氨酸氨基转移酶' },
				{ key: 'prealb', label: '前白蛋白' },
				{ key: 'tba', label: '总胆汁酸' },
				{ key: 'lplt', label: '大血小板数目' },
				{ key: 'pcrit', label: '血小板压积' },
				{ key: 'lpr', label: '大血小板比率' },
				{ key: 'mpv', label: '平均血小板体积' },
				{ key: 'pdw', label: '血小板体积分布宽度' },
				{ key: 'rdw_cv', label: '红细胞体积分布宽度变异系数' },
				{ key: 'rdw_sd', label: '红细胞体积分布宽度标准差' },
				{ key: 'baso_abs', label: '嗜碱性粒细胞绝对数' },
				{ key: 'eos_abs', label: '嗜酸性粒细胞绝对数' },
				{ key: 'mono_abs', label: '单核细胞绝对数' },
				{ key: 'lymph_abs', label: '淋巴细胞绝对数' },
				{ key: 'neut_abs', label: '中性粒细胞绝对数' },
				{ key: 'baso_pct', label: '嗜碱性粒细胞比率' },
				{ key: 'eos_pct', label: '嗜酸性粒细胞比率' },
				{ key: 'mono_pct', label: '单核细胞比率' },
				{ key: 'lymph_pct', label: '淋巴细胞比率' },
				{ key: 'neut_pct', label: '中性粒细胞比率' },
				{ key: 'mchc', label: '平均红细胞血红蛋白浓度' },
				{ key: 'mch', label: '平均红细胞血红蛋白含量' },
				{ key: 'hct', label: '血细胞比容' },
				{ key: 'wbc', label: '白细胞计数' },
				{ key: 'platelet', label: '血小板总数' },
				{ key: 'hgb', label: '血红蛋白' },
				{ key: 'mcv', label: '平均红细胞体积' },
				{ key: 'rbc', label: '红细胞计数' }
			]
		}
	},
	methods: {
		loadRows() {
			// 预留从 localStorage 或 API 加载
			try {
				const s = localStorage.getItem('labRecords')
				if (s) return JSON.parse(s)
			} catch (_) {
				// ignore
			}
			// 占位示例
			const strip = (v) => typeof v === 'string' ? parseFloat(v.replace(/[^\d.\-]/g, '')) : v
			return [
				{
					date: '2023-09-01',
					ph: strip('12.5↑'), alb: 4.2, tp: 135, ibil: 210, dbil: 0.2, tbil: 1.4,
					alp: 120, alt: 30, prealb: 15, tba: 5.5, lplt: 150, pcrit: 300, lpr: 1.5,
					mpv: 10.0, pdw: 10.5, rdw_cv: 0.1, rdw_sd: 0.9, baso_abs: 0.3, eos_abs: 0.7,
					mono_abs: 2.0, lymph_abs: 1.5, neut_abs: 3.0, baso_pct: 20, eos_pct: 25,
					mono_pct: 0.25, lymph_pct: 35, neut_pct: 8.5, mchc: 5.0, mch: 14.0,
					hct: 38.5, wbc: 4.6, platelet: 0.45, hgb: 38.5, mcv: 4.6, rbc: 0.45
				},
				{
					date: '2023-08-25',
					ph: 7.4, alb: 34.5, tp: 59.0, ibil: 1.0, dbil: 0.1, tbil: 1.2,
					alp: 115, alt: 28, prealb: 16, tba: 5.0, lplt: 140, pcrit: 310, lpr: 1.3,
					mpv: 9.5, pdw: 10.0, rdw_cv: 0.2, rdw_sd: 0.8, baso_abs: 0.4, eos_abs: 0.6,
					mono_abs: 1.8, lymph_abs: 1.3, neut_abs: 2.8, baso_pct: 18, eos_pct: 22,
					mono_pct: 0.23, lymph_pct: 33, neut_pct: 8.2, mchc: 4.8, mch: 13.5,
					hct: 37.2, wbc: 4.7, platelet: 0.44, hgb: 38.5, mcv: 4.6, rbc: 0.45
				},
				{
					date: '2023-08-18',
					ph: strip('15.1↑'), alb: 3.9, tp: 142, ibil: strip('80↓'), dbil: 0.1, tbil: 1.2,
					alp: 115, alt: 28, prealb: 16, tba: 5.0, lplt: 140, pcrit: 310, lpr: 1.3,
					mpv: 9.5, pdw: 10.0, rdw_cv: 0.2, rdw_sd: 0.8, baso_abs: 0.4, eos_abs: 0.6,
					mono_abs: 1.8, lymph_abs: 1.3, neut_abs: 2.8, baso_pct: 18, eos_pct: 22,
					mono_pct: 0.23, lymph_pct: 33, neut_pct: 8.2, mchc: 4.8, mch: 13.5,
					hct: 37.2, wbc: 4.7, platelet: 0.44, hgb: 38.5, mcv: 4.6, rbc: 0.45
				}
			]
		},
		// 判断异常类型：'' | 'high' | 'low'
		abnormalType(name, val) {
			const n = typeof val === 'number' ? val : parseFloat(val)
			if (isNaN(n)) return ''
			const r = labRanges[name]
			if (!r) return ''
			const low = Number.isFinite(r.low) ? r.low : -Infinity
			const high = Number.isFinite(r.high) ? r.high : Infinity
			if (n > high) return 'high'
			if (n < low) return 'low'
			return ''
		},
		// 返回 class 绑定对象
		abnClass(name, val) {
			return { abnormal: !!this.abnormalType(name, val) }
		},
		// 返回带箭头“↑/↓”的文本，并在数字与箭头之间加入窄空格（\u2009）
		formatVal(name, val) {
			if (val === undefined || val === null || val === '') return '--'
			const t = this.abnormalType(name, val)
			if (!t) return val
			const arrow = t === 'high' ? '↑' : '↓'
			return `${val}\u2009${arrow}`
		}
	}
}
</script>

<style scoped>
.records-card {
	padding: 0.7rem 1.2rem 1.5rem;
	color: var(--text);
}

.card-title {
	margin: 0.7rem;
	color: var(--accent);
	font-size: 1.4rem;
}

.table-scroll {
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	padding: 8px;
	background: rgba(26, 35, 51, 0.8);
	min-height: 0;
	overflow-x: auto; /* 横向滚动 */
	-webkit-overflow-scrolling: touch; /* 移动端顺滑滚动 */
}

.data-table {
	width: max-content; /* 根据内容宽度展开，配合外层横向滚动 */
	border-collapse: collapse;
	table-layout: fixed;
}

th,
td {
	padding: 8px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	text-align: center;
	color: rgba(255, 255, 255, 0.9);
	min-width: 120px; /* 列最小宽度，便于横向浏览 */
}

th {
	background: rgba(255, 255, 255, 0.04);
	color: rgba(255, 255, 255, 0.95);
	font-weight: 600;
}

.abnormal {
	color: var(--accent);
	font-weight: 700;
}

/* 异常值前显示警告符号 */
.abnormal::before {
	content: '⚠';
	margin-right: 6px;
}

/* 美化横向滚动条（WebKit） */
.table-scroll::-webkit-scrollbar {
	height: 10px;
}
.table-scroll::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.06);
	border-radius: 8px;
}
.table-scroll::-webkit-scrollbar-thumb {
	background: linear-gradient(135deg, var(--primary), var(--secondary));
	border-radius: 8px;
}
</style>

