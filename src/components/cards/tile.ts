// Pressed frame shared by the coffee packaging tile and the roaster logo tile: hairline border,
// heavier bottom edge, inner highlight and a soft drop shadow. Background is set by the caller
// (TILE_PAPER for packaging, contrast plate for logos).
export const TILE_FRAME =
  "relative block w-full overflow-hidden rounded-xl border border-border border-b-[3px] p-2 shadow-[inset_0_0_0_4px_rgb(251_246_236/0.6),0_3px_7px_rgb(45_21_14/0.11)] transition-colors motion-reduce:transition-none group-hover:border-foreground/30";

// Packaging paper. Stays paper in dark, one step dimmer: packs are multiplied into it, so a
// dark tile would turn every white pack-shot muddy.
export const TILE_PAPER = "bg-[#F6EFE3] dark:bg-[#E2D4BE]";
