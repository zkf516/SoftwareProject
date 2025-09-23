<template>
	<div class="card chat-card">
		<h3 class="card-title">AI 医疗助手</h3>
		<div class="chat-history" ref="historyEl">
			<div class="chat-inner">
				<div v-for="(m,i) in messages" :key="i" class="message" :class="m.role==='user' ? 'user' : 'ai'">
					<strong v-if="m.role==='ai'">AI：</strong>{{ m.text }}
				</div>
				<div v-if="isStreaming" class="message ai streaming">
					<strong>AI：</strong>{{ streamingText }}
					<span class="cursor">▋</span>
				</div>
			</div>
		</div>
		<div class="chat-input">
			<textarea
				v-model="draft"
				placeholder="输入您的医疗问题（Shift+Enter 换行，Enter 发送）"
				@keydown.enter.exact.prevent="send"
				@keydown.enter.shift.exact.stop
			></textarea>
			<div class="actions">
				<button class="btn" @click="send" :disabled="isStreaming">发送</button>
				<button class="btn btn-outline" @click="stop" v-if="isStreaming">停止</button>
				<button class="btn btn-outline" @click="clearAll" :disabled="isStreaming">清空</button>
			</div>
		</div>
	</div>
</template>

<script>
import { createChatService } from '../services/chat'

export default {
	name: 'ChatCard',
	data() {
		return {
			draft: '',
			messages: [{ role: 'ai', text: '您好，我是 AI 医疗助手，我会基于病历数据提供参考建议。' }],
			provider: null,
			isStreaming: false,
				streamingText: '',
				abortedByUser: false
		}
	},
	created() {
		this.provider = createChatService()
	},
	methods: {
		async send() {
			const t = this.draft.trim()
			if (!t || this.isStreaming) return
			this.messages.push({ role: 'user', text: t })
			this.draft = ''
			this.$nextTick(this.scrollToBottom)

			// 组装上下文
			const history = this.messages.map(m => ({ role: m.role, content: m.text }))
			this.isStreaming = true
			this.streamingText = ''

			try {
				await this.provider.send({
					messages: history,
					onToken: (tok) => {
						this.streamingText += tok
						this.$nextTick(this.scrollToBottom)
					}
				})
					this.messages.push({ role: 'ai', text: this.streamingText || '（无内容）' })
			} catch (e) {
					console.error(e)
					if (this.abortedByUser) {
						// 用户手动停止：保留已生成的部分，不提示错误
						if (this.streamingText) {
							this.messages.push({ role: 'ai', text: this.streamingText })
						}
					} else {
						this.messages.push({ role: 'ai', text: '抱歉，生成失败，请稍后重试。' })
					}
			} finally {
				this.isStreaming = false
					this.streamingText = ''
					this.abortedByUser = false
				this.$nextTick(this.scrollToBottom)
			}
		},
		stop() {
				this.abortedByUser = true
				try { this.provider?.abort?.() } catch (_) {}
				this.isStreaming = false
		},
		clearAll() {
			if (this.isStreaming) return
			this.messages = [{ role: 'ai', text: '您好，我是 AI 医疗助手，我会基于病历数据提供参考建议。' }]
		},
		scrollToBottom() {
			const el = this.$refs.historyEl
			if (el) el.scrollTop = el.scrollHeight
		}
	}
}
</script>

<style scoped>
.chat-card { 
	padding: 0.7rem 1.2rem 1rem;
	color: var(--text);
}
.card-title {
	margin: 0.7rem;
	color: var(--accent);
	font-size: 1.4rem;
}
.chat-history {
	background: rgba(26, 35, 51, 0.9);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	padding: 12px;
	min-height: 0; /* 与全局 .dashboard-grid 的 min-height:0 协同允许内部滚动 */
	overflow: auto;
}
/* 居中窄列容器，类似 GPT/DeepSeek */
.chat-inner {
	width: 100%;
	/* 取消居中窄列，使用两侧对齐的全宽布局 */
	padding: 6px 4px 10px;
	box-sizing: border-box;
}
/* 更友好的滚动条 */
.chat-history::-webkit-scrollbar { width: 8px; height: 8px; }
.chat-history::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 6px; }
.chat-history::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }

.message {
	margin: 10px 0;
	padding: 10px 12px;
	border-radius: 10px;
	/* 行长限制与溢出换行 */
	max-width: 100%;
	width: fit-content;
	word-break: break-word;
	overflow-wrap: anywhere;
	line-height: 1.6;
	font-size: 14.5px;
	color: var(--text);
}
.message strong { color: var(--accent); margin-right: 4px; font-weight: 600; }
.message.user {
	margin-left: auto;
	background: linear-gradient(135deg, #4A6572, #2F4353);
	border: 1px solid rgba(74,101,114,0.5);
	color: #EEF6FF;
	box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}
.message.ai {
	background: rgba(255,255,255,0.045);
	border: 1px solid rgba(255,255,255,0.16);
	color: #E9F1FF;
	box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}
.message.ai,
.message.user {
	/* 在居中列内再限制左右两侧气泡的最大宽度 */
	max-width: min(75%, 70ch);
}
.message.ai.streaming { opacity: 0.96; }
.cursor { display: inline-block; width: 8px; animation: blink 1s step-end infinite; color: var(--accent); }
@keyframes blink { 50% { opacity: 0; } }

.chat-input { display: flex; gap: 10px; margin-top: 8px; align-items: center; }
.chat-input textarea {
	flex: 1;
	background: rgba(74,101,114,0.28);
	border: 1px solid rgba(255,255,255,0.18);
	border-radius: 10px;
	color: var(--text);
	height: 60px; /* 略微降低默认高度 */
	resize: vertical;
	padding: 10px 12px;
	transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}
.chat-input textarea::placeholder { color: rgba(235, 242, 255, 0.58); }
.chat-input textarea:focus {
	outline: none;
	border-color: var(--accent);
	box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
	background: rgba(74,101,114,0.34);
}

.actions { display: flex; flex-direction: column; gap: 8px; }
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	padding: 0 12px;
	border-radius: 10px;
	cursor: pointer;
	user-select: none;
	border: 1px solid transparent;
	color: #F2F6FF;
	background: linear-gradient(135deg, #3B6C79, #2A3E50);
	transition: transform .05s ease, filter .15s ease, background .2s ease, border-color .2s ease, opacity .2s ease;
}
.btn:hover { filter: brightness(1.05); }
.btn:active { transform: translateY(1px); }
.btn[disabled] { opacity: 0.6; cursor: not-allowed; filter: none; }

.btn.btn-outline {
	background: transparent;
	color: var(--text);
	border-color: rgba(255,255,255,0.28);
}
.btn.btn-outline:hover { background: rgba(255,255,255,0.06); }
.btn.btn-outline:active { background: rgba(255,255,255,0.09); }
</style>

