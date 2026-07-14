import DOMPurify from "isomorphic-dompurify";

type BroadcastContentProps = {
  html: string;
};

/**
 * Kit emails ship with hardcoded light-theme colors (hex text colors, cream
 * backgrounds, light borders). Strip color-related declarations from inline
 * styles so the site's light/dark theme tokens paint the content instead;
 * layout declarations (spacing, typography, tables) are kept. Border colors
 * are remapped to the theme border token rather than dropped, so hairline
 * separators survive without flashing light-grey on a dark ground.
 */
function themeNeutralizeStyle(style: string): string {
  return style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const colonIndex = declaration.indexOf(":");
      if (colonIndex === -1) return null;
      const property = declaration.slice(0, colonIndex).trim().toLowerCase();

      if (property === "color" || property.startsWith("background")) {
        return null;
      }
      if (property.startsWith("border")) {
        return declaration.replace(
          /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi,
          "var(--border)"
        );
      }
      return declaration;
    })
    .filter((declaration): declaration is string => declaration !== null)
    .join("; ");
}

/**
 * Email-only housekeeping that makes no sense on the web: the footer row
 * with the unsubscribe link, mailing address, and copyright block. The
 * unsubscribe anchor marks the row; removing its enclosing table row drops
 * the whole block. Un-rendered Liquid tags ({{ address }}, {% if %}) that
 * Kit substitutes at send time are scrubbed as a fallback.
 */
function trimEmailFooter(root: HTMLElement): void {
  for (const anchor of root.querySelectorAll('a[href*="unsubscribe"]')) {
    (anchor.closest("tr") ?? anchor.closest("p") ?? anchor).remove();
  }
}

const LIQUID_TAG = /\{\{[^{}]*\}\}|\{%[^%]*%\}/g;

function sanitizeBroadcastHtml(html: string): string {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    const style = node.getAttribute?.("style");
    if (style) {
      const neutralized = themeNeutralizeStyle(style);
      if (neutralized) {
        node.setAttribute("style", neutralized);
      } else {
        node.removeAttribute("style");
      }
    }
  });

  try {
    // isomorphic-dompurify types RETURN_DOM as Node; it is a <body> element.
    const root = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target"],
      // style blocks carry the email's light-theme CSS; bgcolor/color are
      // legacy HTML color attributes that bypass the style neutralization.
      FORBID_TAGS: ["form", "input", "button", "style"],
      FORBID_ATTR: ["bgcolor", "background", "color"],
      RETURN_DOM: true,
    }) as HTMLElement;
    trimEmailFooter(root);
    return root.innerHTML.replace(LIQUID_TAG, "");
  } finally {
    DOMPurify.removeHook("afterSanitizeAttributes");
  }
}

/**
 * Renders a Kit broadcast's email HTML on-site, restyled to follow the
 * site's light/dark theme (see sanitizeBroadcastHtml).
 */
export function BroadcastContent({ html }: BroadcastContentProps) {
  const sanitized = sanitizeBroadcastHtml(html);

  return (
    <div
      className={[
        "newsletter-content mx-auto w-full max-w-2xl overflow-hidden",
        "text-foreground",
        "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
        "[&_table]:w-full [&_table]:max-w-full",
        "[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_p]:leading-relaxed",
        "[&_h1]:text-balance [&_h2]:text-balance [&_h3]:text-balance",
        "[&_hr]:border-border",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
