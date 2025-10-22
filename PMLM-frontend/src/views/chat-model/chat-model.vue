<template>
  <SimplePopover
    trigger="manually"
    :isOpen="isAgentOpen"
    :position="['bottom-start']"
    :gap="8"
    :contentClass="'agent-menu'"
  >
    <div class="agent-wrapper" @click="toggleAgent">
      <img :src="selectedAgent.iconPath" />
      <span>{{ selectedAgent.label }}</span>
      <i :class="['icon-chevron-down-2', { 'is-open': isAgentOpen }] "></i>
    </div>
    <template #content>
      <McList :data="agentList" @select="onSelectModel">
        <template #item="{ item }">
          <div class='agent-list-item'>
            <img :src="item.iconPath" />
            {{ item.label }}
          </div>
        </template>
      </McList>
    </template>
  </SimplePopover>
</template>

<script setup lang="ts">
import { LLM_MODELS } from '@/models/config';
import type { ModelOption } from '@/models/types';
import { useChatModelStore } from '@/store';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import SimplePopover from '@/components/ui/SimplePopover.vue'

const chatModelStore = useChatModelStore();
const isAgentOpen = ref(false);
const agentList = ref<ModelOption[]>([]);

for (const item of LLM_MODELS) {
  if (item.models?.length) {
    for (const model of item.models) {
      agentList.value.push({
        label: model.name,
        modelName: model.name,
        providerKey: item.providerKey,
        clientKey: item.clientKey,
        active: false,
        iconPath: model.iconPath,
      });
    }
  }
}

const selectedAgent = ref(agentList.value[0]);
chatModelStore.currentModel = selectedAgent.value;
selectedAgent.value.active = true;

const onSelectModel = (val: ModelOption) => {
  for (const item of agentList.value) {
    item.active = item.label === val.label;
  }
  selectedAgent.value = val;
  chatModelStore.currentModel = val;
  chatModelStore.currentModelName = val.modelName;
  isAgentOpen.value = false; // 选择后关闭下拉
};

const toggleAgent = () => { isAgentOpen.value = !isAgentOpen.value }

// 点击外部关闭（与 SimplePopover 的手动模式配合）
const onDocClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const inTrigger = (target.closest('.agent-wrapper') !== null)
  const inPopover = (target.closest('.simple-popover.agent-menu') !== null)
  if (!inTrigger && !inPopover) {
    isAgentOpen.value = false
  }
}
onMounted(() => { document.addEventListener('mousedown', onDocClick, true) })
onBeforeUnmount(() => { document.removeEventListener('mousedown', onDocClick, true) })
</script>

<style scoped lang="scss">
@import "devui-theme/styles-var/devui-var.scss";

.agent-wrapper {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: $devui-border-radius-full;
  background-color: $devui-base-bg;
  box-shadow: 0px 1px 8px 0px rgba(25, 25, 25, 0.06);
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  span {
    font-size: $devui-font-size;
    color: var(--text);
    margin-right: 8px;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  i {
    font-size: $devui-font-size;
    color: $devui-text;
    transition: transform 0.3s ease-in-out;

    &:last-child {
      margin-left: 4px;
    }
  }

  .is-open {
    transform: rotate(180deg);
  }
}

.agent-list-item {
  display: flex;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}
</style>

<style lang='scss'>
.agent-menu {
  width: 230px;
  padding: 8px;
}
</style>
