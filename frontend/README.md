# PMLM Web

基于 Vue 3 + Vite 的前端项目模板，已集成 Vue Router 与 Pinia。

## 快速开始

在 Windows PowerShell 中运行以下命令：

```powershell
# 进入项目目录
cd "c:\Users\26834\Desktop\Notebook\大创\医疗大模型\frontend\PMLM"

# 安装依赖
npm install

# 开发启动
npm run dev
```

启动后访问控制台输出的网址（通常为 http://localhost:5173/ ）。默认路由将跳转至 `/login` 显示深色登录页。

## 项目结构

- `index.html`：Vite 入口 HTML（已引入 Font Awesome CDN）。
- `vite.config.js`：Vite 配置。
- `package.json`：脚本与依赖。
- `src/main.js`：应用入口，挂载 Router 与 Pinia。
- `src/App.vue`：应用根组件，渲染 `<router-view/>`。
- `src/router/index.js`：路由定义，默认重定向到 `/login`。
- `src/components/LoginDark.vue`：从 `123.html` 转换的登录页组件，保留原样式与交互。

## 常见问题

- 若图标不显示：组件会自动兜底加载 Font Awesome，但推荐保留 `index.html` 中的 CDN 引用。
- 若粒子效果未显示：确保联网以从 CDN 加载 `particles.js`。如需离线，可将库下载到 `public/` 并调整组件内的 `script.src`。
