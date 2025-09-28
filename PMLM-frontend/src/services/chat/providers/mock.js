// 一个简单的本地 Mock 提供者：按关键字返回占位建议，并以分片形式回调模拟流式输出

export function createMockProvider() {
    let aborted = false

    return {
        name: 'mock',
        abort() { aborted = true },
        async send({ messages, onToken }) {
            aborted = false
            const last = messages[messages.length - 1]
            const q = (last?.content || '').toLowerCase()
            let answer = '这是示例建议：请结合病史与检查结果综合评估，并在必要时咨询专业医生。'
            if (q.includes('贫血') || q.includes('hgb')) {
                answer = '可能存在贫血风险，建议进一步检测铁代谢与维生素B12/叶酸水平。'
            } else if (q.includes('肝') || q.includes('胆红素') || q.includes('alt') || q.includes('ast')) {
                answer = '肝功能指标异常需结合影像与病史判断，必要时复查肝胆胰指标。'
            } else if (q.includes('感染') || q.includes('wbc') || q.includes('发热')) {
                answer = '白细胞升高可能提示感染，请结合体温与CRP/降钙素原等指标评估。'
            }

            // 模拟分片输出
            const chunks = answer.match(/.{1,8}/g) || [answer]
            let full = ''
            for (const c of chunks) {
                if (aborted) break
                await new Promise(r => setTimeout(r, 120))
                full += c
                onToken && onToken(c)
            }
            return { text: full }
        }
    }
}
