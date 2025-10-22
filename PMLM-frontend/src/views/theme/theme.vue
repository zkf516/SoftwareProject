<template>
  <SimplePopover :position="['right', 'bottom-end']" trigger="click">
    <template #content>
      <div class="matechat-theme-content">
        <div class="title">{{ $t('theme.themeTitle') }}</div>
        <div class="theme-list">
          <d-radio
            v-for='item in themeList'
            v-model='themeStore.theme'
            :key='item.name'
            :value='item.value'
            class="mb-2 "
            @change='handleChange'
          >
            {{ t(item.cnName) }}

          </d-radio>
        </div>
      </div>
    </template>
    <div class="switch-lang-container">
      <i class="icon-theme system-setting" />
    </div>
  </SimplePopover>
</template>

<script setup lang='ts'>
import { ThemeEnum } from '@/global-config-types';
import { useTheme } from '@/hooks';
import { useThemeStore } from '@/store';
import { useI18n } from 'vue-i18n';
import SimplePopover from '@/components/ui/SimplePopover.vue'

const { t } = useI18n();

const themeList = [
  { name: 'light', cnName: 'theme.lightTheme', value: ThemeEnum.Light },
  { name: 'dark', cnName: 'theme.darkTheme', value: ThemeEnum.Dark },
];
const themeStore = useThemeStore();
const { applyTheme } = useTheme();

applyTheme();
const handleChange = (_val: string) => {
  applyTheme();
};
</script>

<style lang='scss' scoped>
.matechat-theme-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
  box-sizing: border-box;

  .title {
    color: var(--text, #252b3a);
    font-weight: 600;
    text-align: center;
    padding-bottom: 4px;
    line-height: 1.5;
    border-bottom: 1px dashed var(--devui-line, #adb0b8);
  }

  .theme-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    /* 调整圆点与文本之间的距离 */
    :deep(.devui-radio__label) {
      margin-left: 5px !important;
    }

    /* 垂直居中 d-radio 的内容（图标与文本） */
    :deep(.devui-radio),
    :deep(.devui-radio__wrapper) {
      display: flex !important;
      align-items: center !important;
    }
  }
}
</style>
