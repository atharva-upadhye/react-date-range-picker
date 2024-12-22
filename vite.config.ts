// / <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { peerDependencies } from "./package.json";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  define:
    env.command === "build"
      ? { "process.env.NODE_ENV": "'production'" }
      : undefined,
  plugins: [react()],
  resolve: {
    //
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src", "lib", "index.ts"),
      name: "MyLib",
      formats: ["cjs", "es", "iife", "umd"],
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        // "react/jsx-runtime",
        // ...Object.keys(dependencies),
      ],
      output: {
        globals: {
          react: "React",
        },
      },
    },
    target: "esnext",
    sourcemap: true,
  },
}));
