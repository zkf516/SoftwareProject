<template>
  <!-- 触发器：包裹默认插槽 -->
  <span
    ref="triggerEl"
    class="popover-trigger"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onClick"
  >
    <slot />
  </span>

  <!-- 浮层：挂到 body，避免被父容器裁剪 -->
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        ref="popEl"
  class="simple-popover"
  :class="contentClass && typeof contentClass==='string' ? contentClass : ''"
        :style="popStyle"
        role="tooltip"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
      >
        <slot name="content">{{ content }}</slot>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom'

const props = defineProps({
  content: { type: String, default: '' },
  trigger: { type: String, default: 'hover' }, // 'hover' | 'click' | 'manually'
  position: { type: Array, default: () => ['top'] }, // 优先级数组：['top','bottom','right','left']
  gap: { type: Number, default: 8 },
  isOpen: { type: Boolean, default: undefined }, // 手动控制模式
  contentClass: { type: [String, Array, Object], default: '' }, // 传入内容层的 class
})

const visible = ref(false)
const triggerEl = ref(null)
const popEl = ref(null)
const popStyle = ref('position:absolute;')
let cleanup = null
let removeOutsideClick = null

const place = async () => {
  if (!triggerEl.value || !popEl.value) return
  const placement = props.position?.[0] || 'top'
  const { x, y } = await computePosition(triggerEl.value, popEl.value, {
    placement,
    middleware: [offset(props.gap), flip(), shift({ padding: 8 })],
  })
  popStyle.value = `position:absolute; left:${x}px; top:${y}px; z-index: var(--devui-z-index-pop-up, 3000);`
}

const startAutoUpdate = () => {
  if (cleanup || !triggerEl.value || !popEl.value) return
  cleanup = autoUpdate(triggerEl.value, popEl.value, place)
}
const stopAutoUpdate = () => { if (cleanup) { cleanup(); cleanup = null } }

// 点击触发时，点击外部自动关闭
const onOutsideClick = (e) => {
  const t = e.target
  if (!popEl.value || !triggerEl.value) return
  const inPop = popEl.value.contains(t)
  const inTrigger = triggerEl.value.contains(t)
  if (!inPop && !inTrigger) {
    visible.value = false
  }
}
const addOutsideClick = () => {
  if (removeOutsideClick) return
  const handler = (e) => onOutsideClick(e)
  document.addEventListener('mousedown', handler, true)
  removeOutsideClick = () => {
    document.removeEventListener('mousedown', handler, true)
    removeOutsideClick = null
  }
}
const stopOutsideClick = () => { if (removeOutsideClick) { removeOutsideClick() } }

const onEnter = () => { if (props.trigger === 'hover') visible.value = true }
const onLeave = () => { if (props.trigger === 'hover') visible.value = false }
const onClick = () => { if (props.trigger === 'click') visible.value = !visible.value }

// 手动控制：由父组件传 isOpen 决定显隐
watch(() => props.isOpen, (v) => {
  if (props.trigger === 'manually' && typeof v === 'boolean') {
    visible.value = v
  }
}, { immediate: true })

watch(visible, async (v) => {
  if (v) {
    await nextTick();
    place();
    startAutoUpdate();
    if (props.trigger === 'click') addOutsideClick()
  } else {
    stopAutoUpdate();
    if (props.trigger === 'click') stopOutsideClick()
  }
})

onBeforeUnmount(() => { stopAutoUpdate(); stopOutsideClick() })
</script>

<style scoped>
.simple-popover {
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--devui-base-bg, #1f2937);
  color: var(--text, #ffffff);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  max-width: 280px;
}
.popover-trigger { display: inline-flex; align-items: center; }

.fade-enter-active, .fade-leave-active { transition: opacity .12s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
