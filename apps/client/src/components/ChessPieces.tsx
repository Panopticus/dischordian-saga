/* ═══════════════════════════════════════════════════════
   CUSTOM CHESS PIECES — Lore-Themed Artwork
   Architect/Archons (White) vs Dreamer/Neyons (Black)
   ═══════════════════════════════════════════════════════ */
import React from "react";
import { PIECE_IMAGES } from "@/lib/chessAssets";

// react-chessboard v5 pieces format: Record<string, (props) => JSX.Element>
// Each piece component receives { fill, svgStyle } but we use <img> instead of SVG

function makePiece(code: string) {
  const url = PIECE_IMAGES[code];
  // Return a component that renders the custom piece image
  return () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img
        src={url}
        alt={code}
        style={{
          width: "90%",
          height: "90%",
          objectFit: "contain",
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
        }}
        draggable={false}
      />
    </div>
  );
}

export const customPieces: Record<string, () => React.ReactElement> = {
  wK: makePiece("wK"),
  wQ: makePiece("wQ"),
  wB: makePiece("wB"),
  wN: makePiece("wN"),
  wR: makePiece("wR"),
  wP: makePiece("wP"),
  bK: makePiece("bK"),
  bQ: makePiece("bQ"),
  bB: makePiece("bB"),
  bN: makePiece("bN"),
  bR: makePiece("bR"),
  bP: makePiece("bP"),
};
