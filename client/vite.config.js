import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as glob from "glob";
import { defineConfig } from "vite";
import concat from "@vituum/vite-plugin-concat";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src",
  build: {
    outDir: join(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: glob.sync(resolve(__dirname, "src", "**", "*.html")),
    },
  },
  plugins: [
    concat({
      input: ["app.js"],
    }),
  ],
});
