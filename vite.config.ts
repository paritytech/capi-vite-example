import { defineConfig } from "vite"

export default defineConfig({
  plugins: [],
  build: { target: "esnext" },
  optimizeDeps: {
    esbuildOptions: { target: "es2022" },
  },
})
