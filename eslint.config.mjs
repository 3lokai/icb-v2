import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noDirectTextSizeClasses from "./eslint-rules/no-direct-text-size-classes.js";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "custom": {
        rules: {
          "no-direct-text-size-classes": noDirectTextSizeClasses,
        },
      },
    },
    rules: {
      // Allow console for debugging
      "no-console": "off",
      // Allow any types (project uses them)
      "@typescript-eslint/no-explicit-any": "off",
      // Allow non-null assertions
      "@typescript-eslint/no-non-null-assertion": "off",
      // Allow unused variables (warn instead)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // React rules
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      // Allow array index in keys when necessary
      "react/no-array-index-key": "off",
      // Custom rule: Prevent direct Tailwind text size classes
      "custom/no-direct-text-size-classes": "error",
    },
  },
  // Global ignores (flat config: explicit ignores object, not globalIgnores helper)
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "dist/**",
      "*.config.{js,ts,mjs}",
      "**/components/ui/**",
      "src/types/supabase-types.ts",
      // Deno Edge Functions (linted by Supabase deploy)
      "supabase/**",
      "supabase/**/*",
    ],
  },
]);

export default eslintConfig;

