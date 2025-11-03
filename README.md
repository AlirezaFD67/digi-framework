# Nexus Framework

A comprehensive monorepo framework built on top of shadcn/ui with custom components, API management, and development tools.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## 🚀 Features

- **🎨 Custom UI Components** - Enhanced components built on shadcn/ui
- **🔧 Framework Package** - Complete API management with React Query
- **📚 Documentation** - Built-in docs with Fumadocs
- **⚡ TypeScript** - Full TypeScript support across all packages
- **🔄 Monorepo** - Organized workspace with shared packages

## 📦 Packages

- `@workspace/ui` - Base UI components (shadcn/ui)
- `@workspace/custom-ui` - Enhanced custom components
- `@workspace/framework` - API management and data fetching
- `@workspace/eslint-config` - Shared ESLint configuration
- `@workspace/typescript-config` - Shared TypeScript configuration

## 🛠️ Usage

### Adding components

To add components to your app, run the following command:

```bash
pnpm dlx shadcn@latest add button -c apps/your-app
```

### Using components

Import components from the workspace packages:

```tsx
import { Button } from "@workspace/ui/components/button"
import { CustomButton } from "@workspace/custom-ui"
import { useGenericQuery } from "@workspace/framework"
```

### Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages (for production)
pnpm build
```

#### 🔥 Dev Mode (No Build Required)

All packages (`@workspace/custom-ui`, `@workspace/framework`, `@workspace/ui`) are configured to work directly from source code without requiring a build step during development.

**Benefits:**
- ✅ Instant changes - No need to rebuild packages
- ✅ Faster development workflow
- ✅ Direct source code debugging
- ✅ Automatic TypeScript compilation via Next.js

**How it works:**
- Packages export their source files directly (`.ts`/`.tsx` from `src/`)
- Next.js transpiles them using `transpilePackages` configuration
- Changes are reflected immediately when you save

**See individual package DEV_MODE.md files for details:**
- [custom-ui/DEV_MODE.md](./packages/custom-ui/DEV_MODE.md)
- [framework/DEV_MODE.md](./packages/framework/DEV_MODE.md)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
