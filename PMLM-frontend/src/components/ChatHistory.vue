<template>
  <div
    class="rounded-lg border border-slate-300 bg-slate-50 py-6 dark:border-slate-200/10 dark:bg-slate-900"
  >
    <div class="flex items-start px-4">
      <h2 class="inline text-lg font-medium text-slate-800 dark:text-slate-200">
        Chats
      </h2>
      <span
        class="ml-3 rounded-full bg-blue-600 px-2 py-1 text-xs text-slate-200"
        >{{ items.length }}</span
      >
    </div>

    <form class="mx-2 mt-6">
      <label for="chat-input" class="sr-only">Search chats</label>
      <div class="relative">
        <input
          id="search-chats"
          v-model="keyword"
          type="text"
          class="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          placeholder="Search chats"
          rows="1"
        />
        <button
          type="button"
          class="absolute bottom-2 right-2.5 rounded-lg p-2 text-sm text-slate-500 hover:text-blue-700 focus:outline-none sm:text-base"
          @click="onSearchClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            aria-hidden="true"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 9h8"></path>
            <path d="M8 13h5"></path>
            <path
              d="M11.008 19.195l-3.008 1.805v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"
            ></path>
            <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
            <path d="M20.2 20.2l1.8 1.8"></path>
          </svg>
          <span class="sr-only">Search chats</span>
        </button>
      </div>
    </form>

    <div class="my-4 h-80 overflow-y-auto px-2 md:h-[70vh]">
      <div class="space-y-2">
        <button
          v-for="it in filtered"
          :key="it.id"
          class="flex w-full flex-col gap-y-1 rounded-lg px-3 py-2 text-left transition-colors duration-200 focus:outline-none"
          :class="[
            it.id === selectedId
              ? 'bg-slate-200 dark:bg-slate-800'
              : 'hover:bg-slate-200 dark:hover:bg-slate-800'
          ]"
          @click="$emit('select', it.id)"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
            {{ it.title }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ it.date }}</p>
        </button>
      </div>
    </div>

    <div class="mx-2 mt-6">
      <button
        class="flex w-full flex-row-reverse justify-between rounded-lg bg-slate-600 p-4 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-blue-600 focus:outline-none dark:bg-slate-800 dark:hover:bg-blue-600"
        @click="$emit('new')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 5l0 14"></path>
          <path d="M5 12l14 0"></path>
        </svg>
        <span>New Chat</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedId: { type: [String, Number], default: null }
})
const emit = defineEmits(['select', 'new'])

const keyword = ref('')
const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return props.items
  return props.items.filter(it => it.title?.toLowerCase().includes(k))
})

function onSearchClick() {
  // 预留：可触发父组件的搜索事件；目前仅过滤列表
}
</script>
