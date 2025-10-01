<template>
  <span
    v-for="index in count"
    :key="'meteor ' + index"
    :class="
      cn(
  `animate-meteor absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]`,
  `before:absolute before:top-1/2 before:h-[1px] before:w-[180px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:opacity-80 before:content-['']`,
        $props.class,
      )
    "
    :style="spawnStyle()"
  ></span>
</template>

<script setup>
import { cn } from "@/lib/utils";

defineProps({
  count: {
    type: Number,
    default: 20,
  },
  class: String,
  // 是否在整个容器内随机分布（包含纵向）
  fullArea: {
    type: Boolean,
    default: true,
  },
});

function spawnStyle() {
  // 在父容器边界外少量偏移，保证流星轨迹能覆盖卡片四角
  const topPercent = (Math.random() * 140 - 20).toFixed(2); // -20% ~ 120%
  const leftPercent = (Math.random() * 140 - 20).toFixed(2); // -20% ~ 120%
  const delay = (Math.random() * (0.8 - 0.2) + 0.2).toFixed(2) + "s";
  const duration = Math.floor(Math.random() * (14 - 7) + 7) + "s"; // 7s ~ 14s
  return {
    top: `${topPercent}%`,
    left: `${leftPercent}%`,
    animationDelay: delay,
    animationDuration: duration,
  };
}
</script>

<style scoped>
@keyframes meteor {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(215deg) translateX(-1100px);
    opacity: 0;
  }
}

.animate-meteor {
  animation: meteor 5s linear infinite;
}
</style>
