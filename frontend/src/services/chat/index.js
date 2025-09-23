import { createMockProvider } from './providers/mock'
import { createHttpProvider } from './providers/http'

export function createChatService() {
    // 简单选择：优先 HTTP，否则 mock
    const endpoint = import.meta.env.VITE_CHAT_ENDPOINT
    const provider = endpoint ? createHttpProvider({ endpoint }) : createMockProvider()
    return provider
}
