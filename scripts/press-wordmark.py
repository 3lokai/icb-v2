"""Build the ICB wordmark SVGs (icon + "IndianCoffeeBeans") for /press.

Text is outlined from Fraunces 600 (the site's header font) so the SVGs render
identically everywhere, including design tools without the font installed.

  curl -sSL -o /tmp/fraunces.ttf "https://github.com/google/fonts/raw/main/ofl/fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf"
  uv run --with fonttools --with uharfbuzz scripts/press-wordmark.py /tmp/fraunces.ttf <trimmed-icon.png>

Then rasterize with `npm run press:kit`.
"""

import base64
import io
import sys

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

TEXT = "IndianCoffeeBeans"
# Brand tokens from globals.css (oklch → sRGB)
VARIANTS = {
    "icb-wordmark": "#995503",  # --primary (light theme), as in the site header
    "icb-wordmark-dark": "#26170d",  # --foreground (light) — dark text for light backgrounds
    "icb-wordmark-light": "#f2f0ed",  # --foreground (dark) — light text for dark backgrounds
}

font_path, icon_path = sys.argv[1], sys.argv[2]
font = instantiateVariableFont(
    TTFont(font_path), {"wght": 600, "opsz": 24, "SOFT": 0, "WONK": 0}
)
buf = io.BytesIO()
font.save(buf)
upem = font["head"].unitsPerEm
cap = font["OS/2"].sCapHeight

hb_font = hb.Font(hb.Face(buf.getvalue()))
hb_buf = hb.Buffer()
hb_buf.add_str(TEXT)
hb_buf.guess_segment_properties()
hb.shape(hb_font, hb_buf, {"kern": True, "liga": True})

ICON_H = 400  # trimmed icon is 456×400
ICON_W = 456
size = ICON_H * 0.62  # font size in px, matches header proportions
scale = size / upem
gap = ICON_H * 0.2
baseline = ICON_H / 2 + cap * scale / 2  # centre cap height on the icon

glyphs = font.getGlyphSet()
order = font.getGlyphOrder()
pen = SVGPathPen(glyphs)
x = 0
for info, pos in zip(hb_buf.glyph_infos, hb_buf.glyph_positions):
    tx = ICON_W + gap + (x + pos.x_offset) * scale
    glyphs[order[info.codepoint]].draw(
        TransformPen(pen, (scale, 0, 0, -scale, tx, baseline - pos.y_offset * scale))
    )
    x += pos.x_advance
width = round(ICON_W + gap + x * scale)

icon = base64.b64encode(open(icon_path, "rb").read()).decode()
for name, color in VARIANTS.items():
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        f'viewBox="0 0 {width} {ICON_H}" width="{width}" height="{ICON_H}">'
        f"<title>IndianCoffeeBeans</title>"
        f'<image width="{ICON_W}" height="{ICON_H}" xlink:href="data:image/png;base64,{icon}"/>'
        f'<path fill="{color}" d="{pen.getCommands()}"/></svg>'
    )
    open(f"public/press/{name}.svg", "w").write(svg)
    print(name, width, "x", ICON_H)
