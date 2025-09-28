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
	props: {
		records: { type: Array, default: () => [] }
	},
	data() {
		return {
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
	},
	computed: {
		rows() {
			return Array.isArray(this.records) ? this.records : []
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

