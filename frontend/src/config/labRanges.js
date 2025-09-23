// 参考区间配置（可根据科室标准持续扩展/调整）
// 约定：若某端缺省，则使用 -Infinity/Infinity 作为边界
export const labRanges = {
    // 白细胞 (×10^9/L)
    wbc: { low: 4, high: 10, unit: '×10^9/L', name: '白细胞' },
    // 血红蛋白 (g/L) — 这里给一个中性下限范例；实际常按性别/年龄调整
    hgb: { low: 120, high: Infinity, unit: 'g/L', name: '血红蛋白' },
    // 红细胞压积（HCT，比例）
    hct: { low: 0.35, high: 0.50, unit: '', name: '血细胞比容' },
    // 平均红细胞体积（MCV，fL）
    mcv: { low: 80, high: 100, unit: 'fL', name: '平均红细胞体积' },
    // 血小板 (×10^9/L)
    platelet: { low: 100, high: 300, unit: '×10^9/L', name: '血小板' },

    // 扩展项目（以下均为示例区间，需按医院/人群标准调整）
    ph: { low: 7.35, high: 7.45, unit: '', name: '酸碱度' },
    alb: { low: 35, high: 52, unit: 'g/L', name: '白蛋白' },
    tp: { low: 60, high: 80, unit: 'g/L', name: '总蛋白' },
    ibil: { low: 1.7, high: 13.7, unit: 'µmol/L', name: '间接胆红素' },
    dbil: { low: 0, high: 3.4, unit: 'µmol/L', name: '直接胆红素' },
    tbil: { low: 5.1, high: 21.4, unit: 'µmol/L', name: '总胆红素' },
    alp: { low: 40, high: 150, unit: 'U/L', name: '碱性磷酸酶' },
    alt: { low: 7, high: 56, unit: 'U/L', name: '丙氨酸氨基转移酶' },
    prealb: { low: 200, high: 400, unit: 'mg/L', name: '前白蛋白' },
    tba: { low: 0, high: 10, unit: 'µmol/L', name: '总胆汁酸' },
    lplt: { low: 0, high: Infinity, unit: '×10^9/L', name: '大血小板数目' },
    pcrit: { low: 0.108, high: 0.282, unit: '', name: '血小板压积' }, // 示意
    lpr: { low: 0, high: 0.4, unit: '', name: '大血小板比率' }, // 示意
    mpv: { low: 7.4, high: 10.4, unit: 'fL', name: '平均血小板体积' },
    pdw: { low: 9, high: 17, unit: 'fL', name: '血小板体积分布宽度' },
    rdw_cv: { low: 11.5, high: 14.5, unit: '%', name: '红细胞体积分布宽度变异系数' },
    rdw_sd: { low: 37, high: 54, unit: 'fL', name: '红细胞体积分布宽度标准差' },
    baso_abs: { low: 0, high: 0.06, unit: '×10^9/L', name: '嗜碱性粒细胞绝对数' },
    eos_abs: { low: 0.02, high: 0.52, unit: '×10^9/L', name: '嗜酸性粒细胞绝对数' },
    mono_abs: { low: 0.12, high: 0.8, unit: '×10^9/L', name: '单核细胞绝对数' },
    lymph_abs: { low: 0.8, high: 4.0, unit: '×10^9/L', name: '淋巴细胞绝对数' },
    neut_abs: { low: 1.8, high: 6.3, unit: '×10^9/L', name: '中性粒细胞绝对数' },
    baso_pct: { low: 0, high: 1, unit: '%', name: '嗜碱性粒细胞比率' },
    eos_pct: { low: 0.5, high: 5, unit: '%', name: '嗜酸性粒细胞比率' },
    mono_pct: { low: 2, high: 8, unit: '%', name: '单核细胞比率' },
    lymph_pct: { low: 20, high: 50, unit: '%', name: '淋巴细胞比率' },
    neut_pct: { low: 40, high: 75, unit: '%', name: '中性粒细胞比率' },
    mchc: { low: 320, high: 360, unit: 'g/L', name: '平均红细胞血红蛋白浓度' },
    mch: { low: 27, high: 34, unit: 'pg', name: '平均红细胞血红蛋白含量' },
    rbc: { low: 3.5, high: 5.5, unit: '×10^12/L', name: '红细胞计数' }
}

// 可选：根据患者维度返回个体化范围（示例占位）
export function getPersonalizedRanges(patientProfile) {
    // patientProfile: { sex: 'F'|'M', age: number, pregnant: boolean, gestWeek?: number, ... }
    // TODO: 按需返回动态范围；当前返回静态表
    return labRanges
}
