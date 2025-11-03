# @workspace/utils

A collection of utility functions and helpers for the workspace.

**Note:** This package is used directly from source (no build step required).

## Installation

This package is part of the workspace and can be used in other packages:

```json
{
  "dependencies": {
    "@workspace/utils": "workspace:*"
  }
}
```

## Usage

```typescript
import { ImageURL } from "@workspace/utils";

// Example:
const imageUrl = ImageURL("https://example.com/images/", "photo");
// Returns: "https://example.com/images/photo.webp"
```

## Development

```bash
# Lint
pnpm lint

# Clean
pnpm clean
```

## Adding Utilities

Add your utility functions in the `src` directory and export them from `src/index.ts`.

## Available Utilities

### ImageURL

Generates a complete image URL with `.webp` extension.

```typescript
ImageURL(baseUrl: string, fileName: string): string
```

