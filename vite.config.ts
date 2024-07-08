import { defineConfig } from "vite";
import path from "node:path";
import { loadEnv } from "vite";
import createVitePlugins from "./vite/plugins";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProduction = mode === 'prod';

  return {
    build: {
      target: 'es2015',
      sourcemap: !isProduction,
      minify: isProduction,
      manifest: true,
      cssCodeSplit: true,
      rollupOptions: {
        external: [],
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
    plugins: createVitePlugins(),
    base: "./", // Updated to "./"
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "#": path.resolve(__dirname, "src/types"),
      },
      extensions: [
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".vue",
      ],
    },
    server: {
      open: false,
      proxy: {
        "/api": {
          target: env.VITE_SERVICE_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/style/index.scss";`,
        },
      },
    },
    optimizeDeps: {
      include: ['axios', 'pinia', 'vue', 'vue-router'],
    },
  };
});