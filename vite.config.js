import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: "wss",
    },
    proxy: {
      "/api": {
        target: "http://0.0.0.0:3001",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://0.0.0.0:3001",
        changeOrigin: true,
        secure: false,
      },
      "/credentials": {
        target: "http://0.0.0.0:3001",
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: "http://0.0.0.0:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));