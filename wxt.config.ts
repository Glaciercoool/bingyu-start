import { fileURLToPath } from 'node:url';
import { defineConfig } from 'wxt';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
  }),
  manifest: {
    name: '冰屿起始页',
    description: '面向科研、AI 工具与个人效率工作流的新标签页。',
    permissions: ['storage', 'bookmarks', 'geolocation'],
    chrome_url_overrides: {
      newtab: 'newtab.html',
    },
  },
});
