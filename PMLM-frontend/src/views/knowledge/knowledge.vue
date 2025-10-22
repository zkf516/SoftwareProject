<template>
  <SimplePopover
    :content="$t('underDevelop')"
    trigger="hover"
    :position="['top']"
  >
    <div class="knowledge-wrapper">
      <AddKnowledgeIcon />
      <span>{{ $t("knowledge.addKnowledge") }}</span>
    </div>
  </SimplePopover>
</template>

<script setup lang="ts">
import { AddKnowledgeIcon } from "@/components/Collapse";
import SimplePopover from '@/components/ui/SimplePopover.vue'
</script>

<style scoped lang="scss">
@import "devui-theme/styles-var/devui-var.scss";

.knowledge-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: $devui-font-size;
  color: $devui-text;
  cursor: pointer;
  flex: none;
}
</style>
