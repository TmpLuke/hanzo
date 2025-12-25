import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "hanzocheats.com",
      "www.hanzocheats.com",
      "cdbcb744f8cc.ngrok-free.app",
      ".ngrok-free.app", // Allow all ngrok hosts
      ".ngrok.io", // Allow all ngrok.io hosts
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
