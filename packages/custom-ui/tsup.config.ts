import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/**/*.ts",
    "src/components/**/*.tsx",
    "src/auth/**/*.tsx",
    "src/auth/**/*.ts",
    "src/hooks/**/*.ts",
    "src/hooks/**/*.tsx",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react-hook-form", "lucide-react"],
})
