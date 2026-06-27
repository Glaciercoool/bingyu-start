# 冰屿起始页开发说明

## 当前迁移目标

这个项目正在从单文件静态页迁移为 WXT + React + TypeScript 的 Edge/Chrome 新标签页扩展。原始 `index.html` 暂时保留，新的工程入口在 `entrypoints/newtab/`。

## 常用命令

```bash
npm.cmd install
npm.cmd run dev:chrome
npm.cmd run build
npm.cmd run typecheck
```

PowerShell 如果直接运行 `npm` 被执行策略拦截，请使用 `npm.cmd`。

## Edge 本地加载扩展

1. 运行 `npm.cmd run build`。
2. 打开 Edge，进入 `edge://extensions/`。
3. 打开“开发人员模式”。
4. 选择“加载解压缩的扩展”。
5. 选择 `.output/chrome-mv3` 目录。

加载后，新标签页会被 `entrypoints/newtab` 替换。Edge 顶部收藏夹栏仍由浏览器控制，页面内读取收藏夹则通过 `chrome.bookmarks` 权限完成。

## 迁移节奏

第一轮保留核心视觉与主要功能：背景、时钟、搜索、快捷入口、Dock、便签、设置、导入导出、浏览器收藏夹读取。后续建议继续拆分：站点管理、便签文件夹、云同步、壁纸存储、扩展选项页。
