<template>
  <div class="input-container">
    <McInput
      :value="inputValue"
      :maxLength="2000"
      variant="borderless"
      @change="(e:string) => (inputValue = e)"
      @submit="onSubmit"
    >
      <template #extra>
        <div class="input-foot-wrapper">
          <InputOnlineSearch />
          <span class="input-foot-dividing-line"></span>
          <InputAtModel @click="onModelClick" />
          <SimplePopover
            :content="$t('underDevelop')"
            trigger="hover"
            :position="['top']"
          >
            <div class="input-word-container">
              <PromptsIcon />
              <span>{{ $t("thesaurus") }}</span>
            </div>
          </SimplePopover>
          <InputAppendix />
          <span class="input-foot-dividing-line"></span>
          <span class="input-foot-maxlength">
            {{ inputValue.length }}/2000
          </span>
        </div>
      </template>
    </McInput>
  </div>
</template>

<script setup lang="ts">
import { PromptsIcon } from '@/components/Collapse';
import SimplePopover from '@/components/ui/SimplePopover.vue'
import { useChatMessageStore, useChatModelStore } from '@/store';
import { InputAppendix } from '@view/appendix';
import { InputAtModel } from '@view/chat-model';
import { InputOnlineSearch } from '@view/online-search';
import { ref } from 'vue';

const chatMessageStore = useChatMessageStore();
const chatModelStore = useChatModelStore();

const inputValue = ref('');

chatMessageStore.$onAction(({ name }) => {
  if (name === 'ask') {
    inputValue.value = '';
  }
});

const onSubmit = (val: string) => {
  chatMessageStore.ask(val);
};

const onModelClick = () => {
  inputValue.value += `@${chatModelStore.currentModel?.modelName}`;
};
</script>

<style scoped lang="scss">
@import "devui-theme/styles-var/devui-var.scss";

.input-container {
  width: 100%;
  max-width: 1200px;
  padding: 0 12px 15px 12px;

  .input-foot-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start; /* 保证整体靠左对齐 */
      gap: 8px; /* 控制各项水平间距 */
      width: 100%;
      height: 100%;
      margin-right: 8px;
      flex-wrap: nowrap; /* 禁止换行，避免竖排堆叠 */

      /* 统一子项展示为内联水平排列，避免被默认块级撑满换行 */
      > * {
        display: inline-flex;
        align-items: center;
        height: 32px; /* 与 .mc-input-foot 的高度保持一致 */
        line-height: 32px;
        white-space: nowrap;
      }

    .input-word-container {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 32px; /* 跟随底部工具条高度 */
      color: $devui-text;
      font-size: $devui-font-size;
      border-radius: 4px;
        padding: 0 8px; /* 横向内边距，去除多余垂直内边距避免高度不匹配 */
      cursor: pointer;

      svg {
        width: 14px;
        height: 14px;
      }

      span {
        font-size: $devui-font-size-sm;
      }

      &:hover {
        background-color: var(--devui-icon-hover-bg);
      }
    }

    span {
      color: $devui-text;
      cursor: pointer;
        white-space: nowrap;
    }

    .input-foot-dividing-line {
        width: 1px;
        height: 16px; /* 稍微拉高分隔线以居中对齐 */
      background-color: $devui-line;
      margin: 0 8px;
    }

    .input-foot-maxlength {
      font-size: $devui-font-size-sm;
      color: $devui-aide-text;
        white-space: nowrap;
    }
  }
  :deep() {
    /* 底部工具条整体靠左并保持单行 */
    .mc-input-foot {
      justify-content: flex-start;
      gap: 8px;
      flex-wrap: nowrap;
    }
    .mc-input-foot-left {
      overflow-x: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; } /* WebKit browsers */
    }
    .mc-button svg path {
      transition: fill $devui-animation-duration-slow
        $devui-animation-ease-in-out-smooth;
    }
    .mc-textarea { 
      background-color: transparent; 
    }
  }



  .statement-box {
    font-size: 12px;
    margin-top: 8px;
    color: $devui-aide-text;
    text-align: center;

    .separator {
      height: 12px;
      margin: 0 4px;
      border: 0.6px solid $devui-disabled-text;
    }

    .link-span {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

body[ui-theme="galaxy-theme"] {
  .input-container {
    :deep() {
      .mc-button:disabled {
        color: $devui-disabled-text;
        background-color: $devui-disabled-bg;
        svg path {
          fill: $devui-disabled-text;
        }
      }
    }
  }
}

@media screen and (max-width: 520px) {
  .input-word-container span {
    display: none;
  }
}
</style>
