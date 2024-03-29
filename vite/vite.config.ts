import { defineConfig } from "vite"

export default defineConfig({
  plugins: [],
  build: {
    target: "esnext",
    rollupOptions: {
      shimMissingExports: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: { target: "es2022" },
  },
  define: {
    "process.env.CAPI_SERVER": JSON.stringify(process.env.CAPI_SERVER),
    "process.env.CAPI_TARGET": JSON.stringify(process.env.CAPI_TARGET),
  },
})
