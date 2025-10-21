import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // 静默 Dart Sass 的弃用告警（来源于第三方依赖 devui-theme 的 @import 与 legacy JS API）
                silenceDeprecations: ['import', 'legacy-js-api']
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@views': path.resolve(__dirname, 'src/views')
        }
    }
})
