import Image from "next/image";
import { Decor } from "@/components/primitives/decor";

type AuthImagePanelProps = {
  src: string;
  /** Honest, brand-voiced description of the photograph. */
  alt: string;
  /** Small print-UI label, e.g. "Field notes". */
  label: string;
  /** One line of field-guide voice — the magazine plate caption. */
  caption: string;
  priority?: boolean;
};

/**
 * AuthImagePanel — the editorial image plate that sits beside every auth form.
 *
 * Replaces the verbatim-duplicated right panel that used to live in each auth
 * page (image + flat scrim + a hand-rolled 32px dot grid — the deprecated
 * texture drift the design system retired). The photograph is now treated as a
 * magazine plate: a bottom-weighted warm scrim carries a captioned line of
 * field-guide voice instead of dimming the whole frame to grey.
 *
 * Hidden below `lg`; the form column stands alone on small screens.
 */
export function AuthImagePanel({
  src,
  alt,
  label,
  caption,
  priority,
}: AuthImagePanelProps) {
  return (
    <figure className="relative hidden overflow-hidden bg-muted lg:block">
      <Image
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-90"
        fill
        priority={priority}
        quality={90}
        sizes="50vw"
        src={src}
      />
      {/* Coarse film grain — the brand's native paper grain, a scale apart from
          the fine grain on the form column so the two bands don't read alike. */}
      <Decor texture="grain-coarse" />
      {/* Bottom-weighted warm scrim: keeps the caption ≥4.5:1 without greying the
          whole photograph. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
        <p className="text-overline text-white/70">{label}</p>
        <p className="text-heading mt-2 max-w-sm text-balance text-white">
          {caption}
        </p>
      </figcaption>
    </figure>
  );
}
