import { defineConfig } from "tsup"

export default defineConfig((options) => ({
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
  dts: {
    entry: "src/index.ts", // Only generate types for the main entry point
    resolve: true,
    compilerOptions: {
      maxNodeModuleJsDepth: 0,
    },
  },
  splitting: false,
  sourcemap: true,
  clean: !options.watch, // Only clean on build, not on watch
  outDir: "dist",
  external: ["react", "react-dom", "react-hook-form", "lucide-react"],
  treeshake: true,
  // Improve watch mode
  ignoreWatch: ["**/dist/**", "**/node_modules/**", "**/.turbo/**"],
}))
