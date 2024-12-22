import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        // storybook
        "**/**.stories.**",
        // barrel exports
        "**/index.ts",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
