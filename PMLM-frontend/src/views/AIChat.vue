<template>
  <div class="min-h-[93vh] flex items-center justify-center my-2">
    <div ref="rootEl" class="aichat-root bg-gray-900/60 w-4/5 max-h-[90vh] h-[90vh] flex flex-col rounded-2xl border border-gray-700">
      <Layout :class="['flex-1 overflow-auto flex flex-col', displayShape]">
        <template #header>
          <NavBar v-if="displayShape === DisplayShape.Immersive" />
        </template>
        <template #content>
          <template v-if="displayShape === DisplayShape.Immersive">
            <HistoryList />
          </template>
          <ChatView />
        </template>
      </Layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import GlobalConfig from '@/global-config';
import { DisplayShape } from '@/global-config-types';
import { ChatView } from '@view/chat-view';
import { HistoryList } from '@view/history';
import { Layout } from '@view/layout';
import { LangType } from '@/types';
import { NavBar } from '@view/navbar';


const displayShape = GlobalConfig.displayShape;

// 仅在本组件生效的 i18n（不继承全局）
const { t, locale } = useI18n({
  useScope: 'local',
  inheritLocale: false,
  locale: GlobalConfig.language === LangType.EN ? 'en-us' : 'zh-cn'
})

// 仅在本组件根容器上应用主题变量
const rootEl = ref<HTMLElement | null>(null)

function applyLocalTheme() {
  const el = rootEl.value
  if (!el) return
  el.setAttribute('ui-theme-scope', 'aichat')
  const vars: Record<string, string> = {
    '--devui-text': 'var(--text, #FFFFFF)',
    '--devui-global-bg': 'var(--input-bg, #121C2B)',
    '--mc-icon-hover-bg': 'rgba(255,255,255,0.12)',
    '--card-bg': 'rgba(30, 40, 60, 0.8)',
  }
  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v))
}

onMounted(() => {
  applyLocalTheme()
})
</script>

<style scoped lang="scss">
// 仅对本组件生效：在 scoped 样式块中引入公共 scss
// 使用 @use（推荐）或 @import（若你的样式文件依赖全局输出）
@use '@/assets/style.scss' as *;

.aichat-root {
  .Assistant {
    &.matechat-layout {
      padding: 8px;
    }

    :deep(.navbar-top-container) {
      display: flex;

      .icon-history {
        display: inline-block !important;
      }
    }
  }
}
</style>
