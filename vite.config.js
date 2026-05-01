import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url';

function completePath(url) {
  return fileURLToPath(new URL(url, import.meta.url));
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": completePath("./src"),
      "@components": completePath("./src/components"),
      "@assets": completePath("./src/assets"),
      "@utils": completePath("./src/utils"),
    }
  }
})
