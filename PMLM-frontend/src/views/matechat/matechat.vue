<template>
	<Layout :class="[displayShape]">
		<template #content>
			<template v-if="displayShape === DisplayShape.Immersive">
				<HistoryList />
			</template>
			<ChatView />
		</template>
	</Layout>
  
</template>

<script setup lang="ts">
import GlobalConfig from '@/global-config';
import { DisplayShape } from '@/global-config-types';
import { ChatView } from '@view/chat-view';
import { HistoryList } from '@view/history';
import { Layout } from '@view/layout';

const displayShape = GlobalConfig.displayShape;
</script>

<style scoped lang="scss">
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
</style>
