import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        tailwindcss(),
        AutoImport({
            include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
            imports: ["vue"],
            dirs: ["./src"],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // 静默 Dart Sass 的弃用告警（来源于第三方依赖 devui-theme 的 @import 与 legacy JS API）
                silenceDeprecations: ['import', 'legacy-js-api']
            },
            additionalData: `
                @use "devui-theme/styles-var/devui-var.scss" as *;
                @use "src/assets/tokens.scss" as *;
                `
        }
    },
    resolve: {
        alias: {
            '@view': path.resolve(__dirname, 'src/views'),
            '@': path.resolve(__dirname, 'src')
        }
    }
})
