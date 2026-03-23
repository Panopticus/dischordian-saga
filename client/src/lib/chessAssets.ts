/* ═══════════════════════════════════════════════════════
   CHESS ASSETS — Custom Pieces & Arena Themes
   Architect/Archons (White) vs Dreamer/Neyons (Black)
   ═══════════════════════════════════════════════════════ */

// ─── Custom Piece Images ───
export const PIECE_IMAGES: Record<string, string> = {
  wK: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/w_king_39464539.png",
  wQ: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/w_queen_88b2ab3c.png",
  wB: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/w_bishop_bc3e0527.png",
  wN: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/w_knight_c5046f32.png",
  wR: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/w_rook_bcad7106.png",
  wP: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/w_pawn_c03d0c0d.png",
  bK: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/b_king_908af3a7.png",
  bQ: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/b_queen_d70bfd22.png",
  bB: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/b_bishop_26124170.png",
  bN: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/b_knight_5cdb11ad.png",
  bR: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/b_rook_c93c503b.png",
  bP: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/b_pawn_0cb6735f.png",
};

// ─── Arena Themes ───
// Each opponent has a unique arena with background image, board colors, and accent
export interface ArenaTheme {
  name: string;
  subtitle: string;
  background: string;
  darkSquare: string;
  lightSquare: string;
  dropHighlight: string;
  accentColor: string;
  boardGlow: string;
  textGlow: string;
}

export const ARENA_THEMES: Record<string, ArenaTheme> = {
  the_human: {
    name: "THE TRAINING GROUNDS",
    subtitle: "Where warriors are forged",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_human-2u4VD3AZ5zGvdMRUoxXCsu.webp",
    darkSquare: "#3d2b1f",
    lightSquare: "#8b7355",
    dropHighlight: "rgba(255,165,0,0.4)",
    accentColor: "#d4a574",
    boardGlow: "0 0 30px rgba(212,165,116,0.3)",
    textGlow: "0 0 10px rgba(212,165,116,0.5)",
  },
  the_collector: {
    name: "THE COLLECTOR'S VAULT",
    subtitle: "Every piece has a price",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_collector-UnhG3LS8tXbdApgKiwt4Y2.webp",
    darkSquare: "#2a1540",
    lightSquare: "#5c3d7a",
    dropHighlight: "rgba(180,100,255,0.4)",
    accentColor: "#b478ff",
    boardGlow: "0 0 30px rgba(180,120,255,0.3)",
    textGlow: "0 0 10px rgba(180,120,255,0.5)",
  },
  iron_lion: {
    name: "THE IRON CITADEL",
    subtitle: "Steel and fire forge destiny",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_iron_lion-JGGYp9Q59x4RDKxZ4mftND.webp",
    darkSquare: "#2d1a0a",
    lightSquare: "#6b4423",
    dropHighlight: "rgba(255,120,0,0.4)",
    accentColor: "#ff8c42",
    boardGlow: "0 0 30px rgba(255,140,66,0.3)",
    textGlow: "0 0 10px rgba(255,140,66,0.5)",
  },
  the_enigma: {
    name: "THE MIRROR MAZE",
    subtitle: "Nothing is as it seems",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_enigma-4p7ThcZswCnvRadh4GxKSm.webp",
    darkSquare: "#0a2a2a",
    lightSquare: "#1a5c5c",
    dropHighlight: "rgba(0,255,200,0.4)",
    accentColor: "#00e5cc",
    boardGlow: "0 0 30px rgba(0,229,204,0.3)",
    textGlow: "0 0 10px rgba(0,229,204,0.5)",
  },
  the_warlord: {
    name: "THE BLOOD ARENA",
    subtitle: "Victory or death",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_warlord-G9RfqTCYjW9rATdEc2coiH.webp",
    darkSquare: "#3a0a0a",
    lightSquare: "#7a2020",
    dropHighlight: "rgba(255,50,50,0.4)",
    accentColor: "#ff4444",
    boardGlow: "0 0 30px rgba(255,68,68,0.3)",
    textGlow: "0 0 10px rgba(255,68,68,0.5)",
  },
  the_oracle: {
    name: "THE ORACLE'S SANCTUM",
    subtitle: "The future is already written",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_oracle-HEv2JKMMjfAzEPC85KZUnX.webp",
    darkSquare: "#1a0a3a",
    lightSquare: "#3d2070",
    dropHighlight: "rgba(140,80,255,0.4)",
    accentColor: "#9966ff",
    boardGlow: "0 0 30px rgba(153,102,255,0.3)",
    textGlow: "0 0 10px rgba(153,102,255,0.5)",
  },
  the_necromancer: {
    name: "THE NECROPOLIS",
    subtitle: "The dead do not rest here",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_necromancer-JUDe5qcbQeatnwnHT3mad7.webp",
    darkSquare: "#0a1a0a",
    lightSquare: "#1a3a1a",
    dropHighlight: "rgba(0,255,80,0.4)",
    accentColor: "#44ff66",
    boardGlow: "0 0 30px rgba(68,255,102,0.25)",
    textGlow: "0 0 10px rgba(68,255,102,0.5)",
  },
  the_programmer: {
    name: "THE DIGITAL GRID",
    subtitle: "All reality is code",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_programmer-ZDSNuNFUtmc4nNm5irreS2.webp",
    darkSquare: "#001a33",
    lightSquare: "#003366",
    dropHighlight: "rgba(0,200,255,0.4)",
    accentColor: "#00ccff",
    boardGlow: "0 0 30px rgba(0,204,255,0.3)",
    textGlow: "0 0 10px rgba(0,204,255,0.5)",
  },
  agent_zero: {
    name: "THE SHADOW NETWORK",
    subtitle: "Every move is watched",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_agent_zero-6QwQ7VohHdMtQNrL9cypNh.webp",
    darkSquare: "#0d0d0d",
    lightSquare: "#2a2a2a",
    dropHighlight: "rgba(200,200,200,0.3)",
    accentColor: "#aaaaaa",
    boardGlow: "0 0 30px rgba(170,170,170,0.15)",
    textGlow: "0 0 10px rgba(170,170,170,0.4)",
  },
  the_source: {
    name: "THE VOID BETWEEN",
    subtitle: "Where all things begin and end",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_source-AAffTmd2CU4WHLtW94wGEv.webp",
    darkSquare: "#1a1000",
    lightSquare: "#3d2a00",
    dropHighlight: "rgba(255,200,0,0.4)",
    accentColor: "#ffc800",
    boardGlow: "0 0 40px rgba(255,200,0,0.35)",
    textGlow: "0 0 12px rgba(255,200,0,0.6)",
  },
  game_master: {
    name: "THE ARCHITECT'S THRONE",
    subtitle: "The final game begins",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_game_master-aby6bkZe5m32eCLycCjA7G.webp",
    darkSquare: "#1a1200",
    lightSquare: "#4d3a10",
    dropHighlight: "rgba(255,180,0,0.5)",
    accentColor: "#ffb400",
    boardGlow: "0 0 40px rgba(255,180,0,0.4)",
    textGlow: "0 0 15px rgba(255,180,0,0.7)",
  },
  the_architect: {
    name: "THE PANOPTICON CORE",
    subtitle: "All-seeing. All-knowing.",
    background: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_the_architect-8Z7oGygDUV7KCV5CaMbBzC.webp",
    darkSquare: "#001520",
    lightSquare: "#003040",
    dropHighlight: "rgba(0,255,255,0.4)",
    accentColor: "#00ffff",
    boardGlow: "0 0 40px rgba(0,255,255,0.35)",
    textGlow: "0 0 15px rgba(0,255,255,0.7)",
  },
};

// Default arena for unknown opponents
export const DEFAULT_ARENA: ArenaTheme = ARENA_THEMES.the_human;

// Map opponent character IDs to arena themes
export function getArenaForOpponent(opponentId?: string | null): ArenaTheme {
  if (!opponentId) return DEFAULT_ARENA;
  return ARENA_THEMES[opponentId] || DEFAULT_ARENA;
}
