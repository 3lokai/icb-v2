/**
 * ESLint rule to prevent direct Tailwind text size classes
 * in favor of typography classes from src/app/styles/typography.css
 */

const TEXT_SIZE_CLASSES = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
];

// Regex to match text size classes (including responsive variants)
// Note: Currently unused, kept for potential future use
const _TEXT_SIZE_PATTERN = new RegExp(
  `\\b(?:${TEXT_SIZE_CLASSES.map((cls) => cls.replace("text-", "")).join("|")}):text-(?:xs|sm|base|lg|xl|[2-9]xl)\\b|\\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\\b|\\btext-\\[`,
  "g"
);

// Note: Currently unused, kept for potential future use
const _TYPOGRAPHY_CLASSES = [
  "text-hero",
  "text-display",
  "text-title",
  "text-heading",
  "text-subheading",
  "text-body",
  "text-body-large",
  "text-body-muted",
  "text-caption",
  "text-overline",
];

const REPLACEMENT_MAP = {
  "text-xs": "text-caption or text-overline",
  "text-sm": "text-caption or text-body",
  "text-base": "text-body",
  "text-lg": "text-body-large or text-subheading",
  "text-xl": "text-heading",
  "text-2xl": "text-title",
  "text-3xl": "text-title",
  "text-4xl": "text-display or text-hero",
  "text-5xl": "text-display or text-hero",
  "text-6xl": "text-display or text-hero",
  "text-7xl": "text-hero",
  "text-8xl": "text-hero",
  "text-9xl": "text-hero",
};

function getReplacement(classValue) {
  for (const [directClass, replacement] of Object.entries(REPLACEMENT_MAP)) {
    if (classValue.includes(directClass)) {
      return replacement;
    }
  }
  return "a typography class from typography.css";
}

function extractClassNameValue(node) {
  if (!node) return null;

  // Handle JSXExpressionContainer
  if (node.type === "JSXExpressionContainer") {
    const expr = node.expression;

    // Handle template literals
    if (expr.type === "TemplateLiteral") {
      return expr.quasis.map((q) => q.value.cooked).join("");
    }

    // Handle string literals
    if (expr.type === "Literal" && typeof expr.value === "string") {
      return expr.value;
    }

    // Handle function calls (clsx, cn, etc.) - check first argument if it's a string
    if (expr.type === "CallExpression" && expr.arguments.length > 0) {
      const firstArg = expr.arguments[0];
      if (firstArg.type === "Literal" && typeof firstArg.value === "string") {
        return firstArg.value;
      }
      if (firstArg.type === "TemplateLiteral") {
        return firstArg.quasis.map((q) => q.value.cooked).join("");
      }
    }
  }

  // Handle direct string literals
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }

  return null;
}

function findTextSizeClasses(classValue) {
  if (typeof classValue !== "string") return [];

  const matches = [];
  const classList = classValue.split(/\s+/);

  for (const className of classList) {
    // Check for direct text size classes
    for (const textClass of TEXT_SIZE_CLASSES) {
      if (
        className === textClass ||
        className.startsWith(`${textClass} `) ||
        className.endsWith(` ${textClass}`) ||
        className.includes(` ${textClass} `)
      ) {
        matches.push(textClass);
      }
    }

    // Check for responsive variants (sm:text-sm, md:text-base, etc.)
    if (/^(sm|md|lg|xl|2xl):text-(xs|sm|base|lg|xl|[2-9]xl)$/.test(className)) {
      const baseClass = className.split(":")[1];
      matches.push(baseClass);
    }

    // Check for arbitrary values (text-[14px])
    if (/^text-\[/.test(className)) {
      matches.push("text-[...]");
    }
  }

  return [...new Set(matches)];
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent direct Tailwind text size classes in favor of typography classes",
      category: "Stylistic Issues",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noDirectTextSize:
        "Direct Tailwind text size class '{{class}}' is not allowed. Use {{replacement}} instead. See: src/app/styles/typography.css",
    },
  },
  create(context) {
    const filename = context.getFilename();

    // Skip files in components/ui directory (shadcn imports)
    if (
      filename.includes("components/ui") ||
      filename.includes("components\\ui")
    ) {
      return {};
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== "className") return;

        const classValue = extractClassNameValue(node.value);
        if (!classValue) return;

        const violations = findTextSizeClasses(classValue);

        for (const violation of violations) {
          if (violation === "text-[...]") {
            context.report({
              node: node.value,
              messageId: "noDirectTextSize",
              data: {
                class: violation,
                replacement: "a typography class from typography.css",
              },
            });
          } else {
            context.report({
              node: node.value,
              messageId: "noDirectTextSize",
              data: {
                class: violation,
                replacement: getReplacement(violation),
              },
            });
          }
        }
      },
    };
  },
};
