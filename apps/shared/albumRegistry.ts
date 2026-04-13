/* ═══════════════════════════════════════════════════════
   ALBUM REGISTRY — All 5 Albums, Canonical Metadata
   Every song exists in the world. Every song is a transmission.
   ═══════════════════════════════════════════════════════ */

export interface AlbumDef {
  id: string;
  title: string;
  trackCount: number;
  era: string;
  epoch: string;
  visualStyle: string;
  narrativeRole: string;
}

export const ALBUM_REGISTRY: AlbumDef[] = [
  { id: "dischordian-logic", title: "Dischordian Logic", trackCount: 29, era: "Age of Privacy → Rise of Insurgency", epoch: "age_of_privacy", visualStyle: "Underground transmission. Grainy, VHS-quality.", narrativeRole: "Birth of the resistance. Engineer's story ends with execution." },
  { id: "age-of-privacy", title: "The Age of Privacy", trackCount: 20, era: "Early Empire → Insurgency Birth", epoch: "age_of_privacy", visualStyle: "Cold steel blue, surveillance green. Monospace terminal.", narrativeRole: "Surveillance state expansion. Panopticon. Thought Virus deployment." },
  { id: "book-of-daniel", title: "The Book of Daniel 2:47", trackCount: 22, era: "Age of Prophecy", epoch: "age_of_prophecy", visualStyle: "Amber gold, desert ochre. Ancient manuscript serif.", narrativeRole: "Oracle's visions. Iron Lion's sacrifice. Prophecy circulates." },
  { id: "west-by-god", title: "West By God", trackCount: 10, era: "Age of Insurgency", epoch: "age_of_insurgency", visualStyle: "2D anime cel-shaded. Cowboy Bebop × Cyberpunk Edgerunners × Afro Samurai. 8K.", narrativeRole: "The Two Witnesses rising. Programmer + Enigma hack the broadcast system." },
  { id: "silence-in-heaven", title: "Silence in Heaven", trackCount: 37, era: "Age of Revelation → Fall of Reality", epoch: "age_of_revelation", visualStyle: "Pure black → gold → white. Full theatrical production.", narrativeRole: "18 songs + 19 dialog scenes. The complete Fall of Reality musical." },
];

export const EPOCH_VISUAL_CONFIG: Record<string, { background: string; overlay: string; ambient: string; font: string }> = {
  age_of_privacy: { background: "linear-gradient(135deg, #1a2332, #0d1117)", overlay: "scanlines", ambient: "Security system hum", font: "monospace" },
  age_of_prophecy: { background: "linear-gradient(135deg, #2d1b00, #1a1000)", overlay: "grain", ambient: "Wind across stone", font: "serif" },
  age_of_insurgency: { background: "linear-gradient(135deg, #1a0a00, #000000)", overlay: "glitch", ambient: "City + broadcast static", font: "bold graffiti" },
  age_of_revelation: { background: "#000000", overlay: "clean", ambient: "Silence then orchestra", font: "italic scripture" },
};

/** The in-world broadcast premise text shown on first music player open. */
export const BROADCAST_PREMISE = `[TRANSMISSION INTERCEPTED — SOURCE: UNKNOWN]
[ARCHIVE DATE: Age of Insurgency, Year 17,022 A.A.]

The Programmer found a way to transmit music across dimensional barriers.
He hacked the broadcast systems before the Empire could silence him.
What you are hearing is not a playlist.
It is evidence. It is a record.
It is the reason they wanted him dead.
— E.`;
