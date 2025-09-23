// 一个可配置的 HTTP 提供者（占位实现）：
// - send: POST 消息到指定 endpoint
// - onToken: 处理流式分片（此处演示简单逐字符回调）

export function createHttpProvider({ endpoint }) {
    let controller = null
    return {
        name: 'http',
        abort() { if (controller) controller.abort() },
        async send({ messages, onToken }) {
            controller = new AbortController()
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages }),
                signal: controller.signal
            })
            if (!res.ok) throw new Error('Chat API 请求失败')
            // 简版：一次性文本，逐字符回调模拟流式
            const data = await res.json()
            const text = data?.text || ''
            for (const ch of text) {
                onToken && onToken(ch)
                await new Promise(r => setTimeout(r, 10))
            }
            return { text }
        }
    }
}
