
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          shadcn: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          llm: ['@tanstack/react-query'],
          llama: ['wasm-llm'] // this is a placeholder chunk for llama.cpp WASM files
        }
      }
    },
    assetsInlineLimit: 0, // Don't inline WASM files
  },
  optimizeDeps: {
    exclude: ['llama-cpp-wasm'] // Exclude llama.cpp WASM bindings from optimization
  }
}));
