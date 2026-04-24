#!/usr/bin/env python3
"""
Generate placeholder CADES branding (icon.png + splash-screen.png) for the
Cades FPS Godot project. Pure Python stdlib — no PIL / ImageMagick — so
the build box doesn't need an image toolchain installed.

Output is intentionally simple: black background, orange CADES wordmark
in a hand-coded 5×7 bitmap font, thin accent line underneath. Reads
cleanly at any size, signals "not Kenney starter kit" without requiring
real art production.

Run from the repo root:
    python3 games/cades-fps/scripts/gen_branding.py
"""

import os
import struct
import sys
import zlib

# --- 5×7 bitmap font: each glyph is a list of 7 rows, each row 5 chars --

FONT = {
    "C": [".XXXX", "X....", "X....", "X....", "X....", "X....", ".XXXX"],
    "A": [".XXX.", "X...X", "X...X", "XXXXX", "X...X", "X...X", "X...X"],
    "D": ["XXXX.", "X...X", "X...X", "X...X", "X...X", "X...X", "XXXX."],
    "E": ["XXXXX", "X....", "X....", "XXXX.", "X....", "X....", "XXXXX"],
    "S": [".XXXX", "X....", "X....", ".XXX.", "....X", "....X", "XXXX."],
    "U": ["X...X", "X...X", "X...X", "X...X", "X...X", "X...X", ".XXX."],
    "N": ["X...X", "XX..X", "XX..X", "X.X.X", "X..XX", "X..XX", "X...X"],
    "I": ["XXXXX", "..X..", "..X..", "..X..", "..X..", "..X..", "XXXXX"],
    "T": ["XXXXX", "..X..", "..X..", "..X..", "..X..", "..X..", "..X.."],
    "P": ["XXXX.", "X...X", "X...X", "XXXX.", "X....", "X....", "X...."],
    "O": [".XXX.", "X...X", "X...X", "X...X", "X...X", "X...X", ".XXX."],
    "R": ["XXXX.", "X...X", "X...X", "XXXX.", "X.X..", "X..X.", "X...X"],
    "K": ["X...X", "X..X.", "X.X..", "XX...", "X.X..", "X..X.", "X...X"],
    "0": [".XXX.", "X...X", "X..XX", "X.X.X", "XX..X", "X...X", ".XXX."],
    "1": ["..X..", ".XX..", "..X..", "..X..", "..X..", "..X..", ".XXX."],
    "2": [".XXX.", "X...X", "....X", "...X.", "..X..", ".X...", "XXXXX"],
    "3": [".XXX.", "X...X", "....X", "..XX.", "....X", "X...X", ".XXX."],
    "4": ["...X.", "..XX.", ".X.X.", "X..X.", "XXXXX", "...X.", "...X."],
    "5": ["XXXXX", "X....", "XXXX.", "....X", "....X", "X...X", ".XXX."],
    "6": [".XXX.", "X....", "X....", "XXXX.", "X...X", "X...X", ".XXX."],
    "7": ["XXXXX", "....X", "...X.", "..X..", ".X...", ".X...", ".X..."],
    "8": [".XXX.", "X...X", "X...X", ".XXX.", "X...X", "X...X", ".XXX."],
    "9": [".XXX.", "X...X", "X...X", ".XXXX", "....X", "....X", ".XXX."],
    "-": [".....", ".....", ".....", "XXXXX", ".....", ".....", "....."],
    " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
}

# --- colors -------------------------------------------------------------

BLACK = (0, 0, 0, 255)
ORANGE = (246, 158, 11, 255)           # Iron Lion accent, #F69E0B
ORANGE_DIM = (120, 76, 8, 255)          # softer stroke for tagline

# --- PNG writer (stdlib only) ------------------------------------------

def _chunk(tag: bytes, data: bytes) -> bytes:
    crc = zlib.crc32(tag + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)


def write_png(path: str, width: int, height: int, pixels: bytearray) -> None:
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)  # filter: None
        raw.extend(pixels[y * stride:(y + 1) * stride])
    idat = zlib.compress(bytes(raw), 9)
    with open(path, "wb") as f:
        f.write(sig)
        f.write(_chunk(b"IHDR", ihdr))
        f.write(_chunk(b"IDAT", idat))
        f.write(_chunk(b"IEND", b""))


# --- draw helpers -------------------------------------------------------

def fill(pixels: bytearray, width: int, height: int, color: tuple) -> None:
    r, g, b, a = color
    for i in range(width * height):
        pixels[i * 4] = r
        pixels[i * 4 + 1] = g
        pixels[i * 4 + 2] = b
        pixels[i * 4 + 3] = a


def set_px(pixels: bytearray, width: int, height: int, x: int, y: int, color: tuple) -> None:
    if x < 0 or y < 0 or x >= width or y >= height:
        return
    idx = (y * width + x) * 4
    pixels[idx] = color[0]
    pixels[idx + 1] = color[1]
    pixels[idx + 2] = color[2]
    pixels[idx + 3] = color[3]


def fill_rect(pixels: bytearray, width: int, height: int, x: int, y: int, w: int, h: int, color: tuple) -> None:
    for dy in range(h):
        for dx in range(w):
            set_px(pixels, width, height, x + dx, y + dy, color)


def draw_text(pixels: bytearray, width: int, height: int, text: str, x: int, y: int,
              scale: int, color: tuple, spacing: int = 1) -> int:
    """Return the final x position after drawing."""
    cx = x
    for ch in text:
        glyph = FONT.get(ch.upper(), FONT[" "])
        for row, row_str in enumerate(glyph):
            for col, mark in enumerate(row_str):
                if mark == "X":
                    fill_rect(pixels, width, height,
                              cx + col * scale, y + row * scale,
                              scale, scale, color)
        cx += (5 + spacing) * scale
    return cx


def text_width(text: str, scale: int, spacing: int = 1) -> int:
    return (5 * scale + spacing * scale) * len(text) - spacing * scale


# --- compositions -------------------------------------------------------

def make_icon(width: int = 256, height: int = 256) -> bytes:
    pixels = bytearray(width * height * 4)
    fill(pixels, width, height, BLACK)
    # "CADES" at scale 7 → 5*7 + 4 inter-letter = 39; ×5 letters = 39*5+28 = ~203 wide.
    scale = 7
    label = "CADES"
    tw = text_width(label, scale)
    tx = (width - tw) // 2
    ty = (height // 2) - (7 * scale) // 2 - 6
    draw_text(pixels, width, height, label, tx, ty, scale, ORANGE)
    # Thin accent underline (1px at scale ≥ 1, 3px at scale 7).
    underline_y = ty + 7 * scale + scale
    fill_rect(pixels, width, height, tx, underline_y, tw, max(2, scale // 3), ORANGE_DIM)
    # "UNIT" tagline beneath, smaller.
    tag_scale = 3
    tag = "UNIT"
    ttw = text_width(tag, tag_scale)
    ttx = (width - ttw) // 2
    tty = underline_y + tag_scale * 4
    draw_text(pixels, width, height, tag, ttx, tty, tag_scale, ORANGE_DIM)
    return bytes(pixels)


def make_splash(width: int = 2560, height: int = 1440) -> bytes:
    pixels = bytearray(width * height * 4)
    fill(pixels, width, height, BLACK)
    # "CADES" scaled big for the hero lockup.
    scale = 40
    label = "CADES"
    tw = text_width(label, scale)
    tx = (width - tw) // 2
    ty = (height // 2) - (7 * scale) // 2 - 80
    draw_text(pixels, width, height, label, tx, ty, scale, ORANGE)
    # Accent underline.
    underline_y = ty + 7 * scale + scale
    fill_rect(pixels, width, height, tx, underline_y, tw, max(4, scale // 6), ORANGE_DIM)
    # Tagline: "INCEPTION ARK - 1047".
    tag_scale = 8
    tag = "INCEPTION ARK - 1047"
    ttw = text_width(tag, tag_scale)
    ttx = (width - ttw) // 2
    tty = underline_y + tag_scale * 6
    draw_text(pixels, width, height, tag, ttx, tty, tag_scale, ORANGE_DIM)
    return bytes(pixels)


# --- entrypoint ---------------------------------------------------------

def main() -> None:
    here = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(here, ".."))

    icon_bytes = make_icon()
    write_png(os.path.join(project_root, "icon.png"), 256, 256, bytearray(icon_bytes))
    print("wrote icon.png (256x256)")

    splash_bytes = make_splash()
    write_png(os.path.join(project_root, "splash-screen.png"), 2560, 1440, bytearray(splash_bytes))
    print("wrote splash-screen.png (2560x1440)")


if __name__ == "__main__":
    main()
