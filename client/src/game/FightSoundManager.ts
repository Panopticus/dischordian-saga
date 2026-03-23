/* ═══════════════════════════════════════════════════════
   FIGHT SOUND MANAGER — Web Audio API Sound System
   Synthesized hit SFX, announcer voice, and arena music
   using the YouTube IFrame API for saga tracks.
   ═══════════════════════════════════════════════════════ */

type SoundType = "punch_light" | "punch_heavy" | "kick_light" | "kick_heavy" |
  "block" | "special" | "ko" | "whoosh" | "impact_ground" | "combo_hit" |
  "grunt_hit" | "grunt_attack" | "blood_splat" | "round_bell" | "finish_him" |
  "parry_flash" | "dash_whoosh" | "toasty" | "body_thud" | "bone_crack" |
  "crowd_gasp" | "dramatic_boom";

// Arena-to-YouTube track mapping for fight music
const ARENA_MUSIC: Record<string, { youtubeId: string; title: string }> = {
  "new-babylon": { youtubeId: "cEoS4cNSd14", title: "The Politician's Reign" },
  "panopticon": { youtubeId: "Cujw3s-D6yU", title: "The Prisoner" },
  "thaloria": { youtubeId: "Q6y2hrJumpQ", title: "Planet of the Wolf" },
  "terminus": { youtubeId: "Z6S-fGbZJJs", title: "Theft of All Time" },
  "mechronis": { youtubeId: "orDK07SbFFw", title: "Building the Architect" },
  "crucible": { youtubeId: "NamG72iwV3Y", title: "I Love War" },
  "blood-weave": { youtubeId: "DsxATNW2GVM", title: "Welcome to Celebration" },
  "shadow-sanctum": { youtubeId: "VtYDgt4CG3k", title: "Ocularum" },
};

export class FightSoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private initialized = false;
  private muted = false;
  private ytPlayer: any = null;
  private arenaId: string;

  constructor(arenaId: string) {
    this.arenaId = arenaId;
  }

  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch {
      console.warn("[FightSound] Web Audio API not available");
    }
  }

  /* ─── SYNTHESIZED SFX ─── */
  play(type: SoundType) {
    if (!this.initialized || !this.ctx || !this.sfxGain || this.muted) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dest = this.sfxGain;

    switch (type) {
      case "punch_light": {
        // Quick snap — short noise burst
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.1);
        // Add noise burst
        this.playNoiseBurst(0.15, 0.06, dest);
        break;
      }

      case "punch_heavy": {
        // Deep thud with distortion
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.2);
        this.playNoiseBurst(0.3, 0.1, dest);
        // Sub bass impact
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = "sine";
        sub.frequency.setValueAtTime(60, now);
        sub.frequency.exponentialRampToValueAtTime(20, now + 0.2);
        subGain.gain.setValueAtTime(0.5, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        sub.connect(subGain).connect(dest);
        sub.start(now);
        sub.stop(now + 0.25);
        break;
      }

      case "kick_light": {
        // Mid-range snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.1);
        this.playNoiseBurst(0.2, 0.05, dest);
        break;
      }

      case "kick_heavy": {
        // Massive boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.3);
        this.playNoiseBurst(0.4, 0.12, dest);
        break;
      }

      case "block": {
        // Metallic clang
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "square";
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1200, now);
        osc2.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(dest);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
        break;
      }

      case "special": {
        // Dramatic power-up sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.6);
        // Shimmer
        const shimmer = ctx.createOscillator();
        const shimGain = ctx.createGain();
        shimmer.type = "sine";
        shimmer.frequency.setValueAtTime(2000, now);
        shimmer.frequency.exponentialRampToValueAtTime(4000, now + 0.4);
        shimGain.gain.setValueAtTime(0.1, now);
        shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        shimmer.connect(shimGain).connect(dest);
        shimmer.start(now);
        shimmer.stop(now + 0.5);
        break;
      }

      case "ko": {
        // Dramatic KO — deep boom + high ring
        const boom = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boom.type = "sawtooth";
        boom.frequency.setValueAtTime(80, now);
        boom.frequency.exponentialRampToValueAtTime(15, now + 0.5);
        boomGain.gain.setValueAtTime(0.8, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        boom.connect(boomGain).connect(dest);
        boom.start(now);
        boom.stop(now + 0.6);
        // High ring
        const ring = ctx.createOscillator();
        const ringGain = ctx.createGain();
        ring.type = "sine";
        ring.frequency.setValueAtTime(1500, now);
        ring.frequency.exponentialRampToValueAtTime(800, now + 0.8);
        ringGain.gain.setValueAtTime(0.2, now);
        ringGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        ring.connect(ringGain).connect(dest);
        ring.start(now);
        ring.stop(now + 1.0);
        this.playNoiseBurst(0.5, 0.3, dest);
        break;
      }

      case "whoosh": {
        // Fast movement sound
        this.playNoiseBurst(0.15, 0.08, dest);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case "impact_ground": {
        // Body hitting the floor
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.2);
        this.playNoiseBurst(0.25, 0.08, dest);
        break;
      }

      case "combo_hit": {
        // Quick staccato hit for combo chains
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain).connect(dest);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case "grunt_hit": {
        // MK-style vocal grunt on taking damage — filtered noise + formant
        this.playNoiseBurst(0.35, 0.12, dest);
        const formant = ctx.createOscillator();
        const fGain = ctx.createGain();
        const fFilter = ctx.createBiquadFilter();
        formant.type = "sawtooth";
        formant.frequency.setValueAtTime(180 + Math.random() * 60, now);
        formant.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        fFilter.type = "bandpass";
        fFilter.frequency.value = 800 + Math.random() * 400;
        fFilter.Q.value = 3;
        fGain.gain.setValueAtTime(0.25, now);
        fGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        formant.connect(fFilter).connect(fGain).connect(dest);
        formant.start(now);
        formant.stop(now + 0.18);
        break;
      }

      case "grunt_attack": {
        // Short attack exertion sound — rising pitch burst
        const atk = ctx.createOscillator();
        const atkGain = ctx.createGain();
        const atkFilter = ctx.createBiquadFilter();
        atk.type = "sawtooth";
        atk.frequency.setValueAtTime(150, now);
        atk.frequency.exponentialRampToValueAtTime(300, now + 0.06);
        atk.frequency.exponentialRampToValueAtTime(120, now + 0.12);
        atkFilter.type = "bandpass";
        atkFilter.frequency.value = 1000;
        atkFilter.Q.value = 2;
        atkGain.gain.setValueAtTime(0.2, now);
        atkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        atk.connect(atkFilter).connect(atkGain).connect(dest);
        atk.start(now);
        atk.stop(now + 0.14);
        break;
      }

      case "blood_splat": {
        // Wet splatter sound — filtered noise with low resonance
        const bufSize = Math.floor(ctx.sampleRate * 0.15);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 0.5);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const splatFilter = ctx.createBiquadFilter();
        splatFilter.type = "lowpass";
        splatFilter.frequency.value = 1200;
        splatFilter.Q.value = 4;
        const splatGain = ctx.createGain();
        splatGain.gain.setValueAtTime(0.3, now);
        splatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        src.connect(splatFilter).connect(splatGain).connect(dest);
        src.start(now);
        src.stop(now + 0.15);
        break;
      }

      case "round_bell": {
        // Classic boxing/MK round bell — metallic ring
        [800, 1200, 1600].forEach((freq, idx) => {
          const bell = ctx.createOscillator();
          const bellGain = ctx.createGain();
          bell.type = "sine";
          bell.frequency.setValueAtTime(freq, now);
          bellGain.gain.setValueAtTime(idx === 0 ? 0.3 : 0.15, now);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          bell.connect(bellGain).connect(dest);
          bell.start(now);
          bell.stop(now + 0.8);
        });
        // Metallic attack transient
        this.playNoiseBurst(0.2, 0.02, dest);
        break;
      }

      case "finish_him": {
        // Dramatic MK "FINISH HIM" stinger — deep brass + reverb tail
        const brass1 = ctx.createOscillator();
        const brass2 = ctx.createOscillator();
        const brassGain = ctx.createGain();
        brass1.type = "sawtooth";
        brass1.frequency.setValueAtTime(110, now);
        brass2.type = "sawtooth";
        brass2.frequency.setValueAtTime(165, now);
        brassGain.gain.setValueAtTime(0.4, now);
        brassGain.gain.linearRampToValueAtTime(0.6, now + 0.2);
        brassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        brass1.connect(brassGain);
        brass2.connect(brassGain);
        brassGain.connect(dest);
        brass1.start(now);
        brass2.start(now);
        brass1.stop(now + 1.5);
        brass2.stop(now + 1.5);
        // Sub rumble
        const rumble = ctx.createOscillator();
        const rumbleGain = ctx.createGain();
        rumble.type = "sine";
        rumble.frequency.setValueAtTime(40, now);
        rumbleGain.gain.setValueAtTime(0.5, now);
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        rumble.connect(rumbleGain).connect(dest);
        rumble.start(now);
        rumble.stop(now + 2.0);
        this.playNoiseBurst(0.3, 0.15, dest);
        break;
      }

      case "parry_flash": {
        // Bright metallic parry — high frequency ring
        const parry = ctx.createOscillator();
        const parryGain = ctx.createGain();
        parry.type = "sine";
        parry.frequency.setValueAtTime(2400, now);
        parry.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        parryGain.gain.setValueAtTime(0.3, now);
        parryGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        parry.connect(parryGain).connect(dest);
        parry.start(now);
        parry.stop(now + 0.2);
        // Shimmer overtone
        const shimmer2 = ctx.createOscillator();
        const shimGain2 = ctx.createGain();
        shimmer2.type = "sine";
        shimmer2.frequency.setValueAtTime(4800, now);
        shimGain2.gain.setValueAtTime(0.1, now);
        shimGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        shimmer2.connect(shimGain2).connect(dest);
        shimmer2.start(now);
        shimmer2.stop(now + 0.12);
        break;
      }

      case "dash_whoosh": {
        // Fast movement — sweeping filtered noise
        const dashBuf = Math.floor(ctx.sampleRate * 0.12);
        const dashBuffer = ctx.createBuffer(1, dashBuf, ctx.sampleRate);
        const dashData = dashBuffer.getChannelData(0);
        for (let i = 0; i < dashBuf; i++) {
          dashData[i] = (Math.random() * 2 - 1) * (i < dashBuf * 0.3 ? i / (dashBuf * 0.3) : 1 - (i - dashBuf * 0.3) / (dashBuf * 0.7));
        }
        const dashSrc = ctx.createBufferSource();
        dashSrc.buffer = dashBuffer;
        const dashFilter = ctx.createBiquadFilter();
        dashFilter.type = "bandpass";
        dashFilter.frequency.setValueAtTime(3000, now);
        dashFilter.frequency.exponentialRampToValueAtTime(500, now + 0.12);
        dashFilter.Q.value = 2;
        const dashGain = ctx.createGain();
        dashGain.gain.setValueAtTime(0.2, now);
        dashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        dashSrc.connect(dashFilter).connect(dashGain).connect(dest);
        dashSrc.start(now);
        dashSrc.stop(now + 0.12);
        break;
      }

      case "toasty": {
        // MK "Toasty!" — playful ascending arpeggio
        [523, 659, 784, 1047].forEach((freq, idx) => {
          const t = ctx.createOscillator();
          const tg = ctx.createGain();
          t.type = "triangle";
          t.frequency.setValueAtTime(freq, now + idx * 0.06);
          tg.gain.setValueAtTime(0, now);
          tg.gain.linearRampToValueAtTime(0.2, now + idx * 0.06);
          tg.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.06);
          t.connect(tg).connect(dest);
          t.start(now + idx * 0.06);
          t.stop(now + 0.4 + idx * 0.06);
        });
        break;
      }

      case "body_thud": {
        // Heavy body hitting ground — deep thump
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(80, now);
        thud.frequency.exponentialRampToValueAtTime(25, now + 0.2);
        thudGain.gain.setValueAtTime(0.6, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        thud.connect(thudGain).connect(dest);
        thud.start(now);
        thud.stop(now + 0.25);
        this.playNoiseBurst(0.2, 0.1, dest);
        break;
      }

      case "bone_crack": {
        // Crunchy bone break — short noise + click
        this.playNoiseBurst(0.4, 0.03, dest);
        const crack = ctx.createOscillator();
        const crackGain = ctx.createGain();
        crack.type = "square";
        crack.frequency.setValueAtTime(1500, now);
        crack.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        crackGain.gain.setValueAtTime(0.35, now);
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        crack.connect(crackGain).connect(dest);
        crack.start(now);
        crack.stop(now + 0.06);
        break;
      }

      case "crowd_gasp": {
        // Crowd reaction — layered filtered noise
        for (let layer = 0; layer < 3; layer++) {
          const gaspBuf = Math.floor(ctx.sampleRate * 0.4);
          const gaspBuffer = ctx.createBuffer(1, gaspBuf, ctx.sampleRate);
          const gaspData = gaspBuffer.getChannelData(0);
          for (let i = 0; i < gaspBuf; i++) {
            const env = Math.sin((i / gaspBuf) * Math.PI);
            gaspData[i] = (Math.random() * 2 - 1) * env;
          }
          const gaspSrc = ctx.createBufferSource();
          gaspSrc.buffer = gaspBuffer;
          const gaspFilter = ctx.createBiquadFilter();
          gaspFilter.type = "bandpass";
          gaspFilter.frequency.value = 600 + layer * 400;
          gaspFilter.Q.value = 1.5;
          const gaspGain = ctx.createGain();
          gaspGain.gain.setValueAtTime(0.08, now + layer * 0.05);
          gaspGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          gaspSrc.connect(gaspFilter).connect(gaspGain).connect(dest);
          gaspSrc.start(now + layer * 0.05);
          gaspSrc.stop(now + 0.5);
        }
        break;
      }

      case "dramatic_boom": {
        // Cinematic impact boom for special moments
        const boom2 = ctx.createOscillator();
        const boomGain2 = ctx.createGain();
        boom2.type = "sawtooth";
        boom2.frequency.setValueAtTime(60, now);
        boom2.frequency.exponentialRampToValueAtTime(10, now + 0.8);
        boomGain2.gain.setValueAtTime(0.7, now);
        boomGain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        boom2.connect(boomGain2).connect(dest);
        boom2.start(now);
        boom2.stop(now + 1.0);
        this.playNoiseBurst(0.5, 0.2, dest);
        // Reverb tail simulation
        const tail = ctx.createOscillator();
        const tailGain = ctx.createGain();
        tail.type = "sine";
        tail.frequency.setValueAtTime(40, now + 0.1);
        tailGain.gain.setValueAtTime(0.3, now + 0.1);
        tailGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        tail.connect(tailGain).connect(dest);
        tail.start(now + 0.1);
        tail.stop(now + 1.5);
        break;
      }
    }
  }

  /* ─── ANNOUNCER (Speech Synthesis) ─── */
  announce(text: string) {
    if (this.muted || typeof speechSynthesis === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 0.6; // Deep announcer voice
    utterance.volume = 0.9;
    // Try to find a deep male voice
    const voices = speechSynthesis.getVoices();
    const deepVoice = voices.find(v =>
      v.name.toLowerCase().includes("male") ||
      v.name.toLowerCase().includes("daniel") ||
      v.name.toLowerCase().includes("james")
    );
    if (deepVoice) utterance.voice = deepVoice;
    speechSynthesis.speak(utterance);
  }

  /* ─── ARENA MUSIC (YouTube IFrame API) ─── */
  startArenaMusic() {
    const track = ARENA_MUSIC[this.arenaId];
    if (!track) return;

    // Check if YouTube IFrame API is loaded
    if (typeof (window as any).YT === "undefined") {
      // Load the API
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => this.createYTPlayer(track.youtubeId);
    } else {
      this.createYTPlayer(track.youtubeId);
    }
  }

  private createYTPlayer(videoId: string) {
    // Create a hidden container for the YouTube player
    let container = document.getElementById("fight-yt-player");
    if (!container) {
      container = document.createElement("div");
      container.id = "fight-yt-player";
      container.style.position = "fixed";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      document.body.appendChild(container);
    }

    try {
      this.ytPlayer = new (window as any).YT.Player("fight-yt-player", {
        height: "1",
        width: "1",
        videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(25); // Low volume for background music
            event.target.playVideo();
          },
        },
      });
    } catch {
      console.warn("[FightSound] YouTube player failed to initialize");
    }
  }

  stopArenaMusic() {
    try {
      if (this.ytPlayer?.stopVideo) {
        this.ytPlayer.stopVideo();
        this.ytPlayer.destroy();
      }
    } catch {
      // Ignore cleanup errors
    }
    this.ytPlayer = null;
    const container = document.getElementById("fight-yt-player");
    if (container) container.remove();
  }

  /* ─── NOISE BURST HELPER ─── */
  private playNoiseBurst(volume: number, duration: number, dest: AudioNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // Decaying noise
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    // Bandpass filter for more natural sound
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 1;
    source.connect(filter).connect(gain).connect(dest);
    source.start(now);
    source.stop(now + duration);
  }

  /* ─── ROUND ANNOUNCE FANFARE ─── */
  playRoundFanfare() {
    if (!this.initialized || !this.ctx || !this.sfxGain || this.muted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dest = this.sfxGain;

    // Ascending chord
    const notes = [220, 330, 440, 550];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.08);
      osc.connect(gain).connect(dest);
      osc.start(now + i * 0.08);
      osc.stop(now + 0.6 + i * 0.08);
    });
  }

  /* ─── VICTORY FANFARE ─── */
  playVictoryFanfare() {
    if (!this.initialized || !this.ctx || !this.sfxGain || this.muted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dest = this.sfxGain;

    // Triumphant ascending notes
    const notes = [262, 330, 392, 523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + i * 0.12);
      osc.connect(gain).connect(dest);
      osc.start(now + i * 0.12);
      osc.stop(now + 1.0 + i * 0.12);
    });
  }

  /* ─── CONTROLS ─── */
  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.6;
    }
    if (this.ytPlayer?.setVolume) {
      this.ytPlayer.setVolume(this.muted ? 0 : 25);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  getArenaTrack() {
    return ARENA_MUSIC[this.arenaId] || null;
  }

  dispose() {
    this.stopArenaMusic();
    if (this.ctx?.state !== "closed") {
      this.ctx?.close().catch(() => {});
    }
    this.initialized = false;
  }
}
