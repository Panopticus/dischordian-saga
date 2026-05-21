import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_EYRA_SHEEL: HeroTarget = {
  id: "listener_eyra_sheel",
  name: "Listener Eyra Sheel",
  classKey: "spy",
  corruptorLord: "ith_rael",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "whisper_inheritance", category: "spy", severity: 3 },
    { id: "thaloria_dialect", category: "spy", severity: 3 },
    { id: "patient_subversion", category: "spy", severity: 2 },
    { id: "shadow_tongue_handle", category: "spy", severity: 2 },
  ],
  tells: [
    "Repeats the last sentence the Wolf spoke before he committed to it.",
    "Never raises her voice — every word costs her less than the Wolf's hearing.",
    "Smells faintly of Rylloh's slow-burning resins.",
  ],
  lairLocation: "rylloh_galleries",
  briefingHints: [
    "Was the League's most decorated counter-intelligence officer.",
    "Ith'Rael turned her over thirty-two years — she does not yet know the turning is complete.",
    "Speaks the Shadow Tongue fluently enough to handle uncorrupted listeners.",
  ],
};
