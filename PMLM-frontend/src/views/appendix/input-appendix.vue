<template>
  <SimplePopover
    :content="$t('underDevelop')"
    trigger="hover"
    :position="['top']"
  >
    <div class="container">
      <i class="icon-add"></i>
      <span>{{ $t("appendix") }}</span>
    </div>
  </SimplePopover>
</template>

<script setup lang="ts">
import SimplePopover from '@/components/ui/SimplePopover.vue'
</script>

<style scoped lang="scss">
@import "devui-theme/styles-var/devui-var.scss";

.container {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 30px;
  color: $devui-text;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;

  span {
    font-size: $devui-font-size-sm;
  }

  &:hover {
    background-color: var(--devui-icon-hover-bg);
  }
}

@media screen and (max-width: 520px) {
  .container span {
    display: none;
  }
}
</style>
