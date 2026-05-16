/**
 * Prophecy · Seal · Seer · Oracle-Tarot unification parity
 * check — PR-19.
 *
 * HARD parity. Each of the 7 per-Act bindings in
 * apps/shared/prophecyTarotCanon.ts must fully resolve against
 * the four registries it cross-binds:
 *
 *   - the Seal: a SEVEN_SEALS entry with num === sealNum AND
 *     act === act (the Revelation frame is 1:1 with the acts);
 *   - the prophecy bookend: both opening + closing ids resolve
 *     via getProphecyById (DANIEL_CROSS_PROPHECIES);
 *   - the Oracle-Tarot: at least one card slug falls under the
 *     act in the validated PROPHECY_VISIONS registry (the
 *     23-card deck is the Dischordian Tarot — no new cards);
 *   - the prophet: the antiquarian_manifold resolves in
 *     identityCollisionCanon (Daniel Cross = Programmer =
 *     Antiquarian);
 *   - the Seer register matches the canonical warming band
 *     (cold 1-2 / warm 3-5 / confidant 6-7).
 *
 * Acts must be exactly {1..7}, once each. No ratchet — a
 * prophetic spine that does not resolve is a bug.
 */
import {
  PROPHECY_TAROT_ACTS,
  oracleCardSlugsForAct,
  getProphecyTarotCoverage,
} from "../../prophecyTarotCanon";
import { SEVEN_SEALS } from "../../sevenSeals";
import { getProphecyById } from "../../danielCrossProphecies";
import { IDENTITY_MANIFOLDS } from "../../identityCollisionCanon";
import type { RawParityCount } from "../types";

function expectedRegister(act: number): "cold" | "warm" | "confidant" {
  if (act <= 2) return "cold";
  if (act <= 5) return "warm";
  return "confidant";
}

export function checkProphecyTarotCoverage(): RawParityCount {
  const { declared } = getProphecyTarotCoverage();
  const missing: string[] = [];

  const manifoldOk = IDENTITY_MANIFOLDS.some(
    (m) => m.manifoldId === "antiquarian_manifold",
  );
  if (!manifoldOk) {
    missing.push(
      "antiquarian_manifold does not resolve in identityCollisionCanon — the prophet binding is broken",
    );
  }

  const seenActs = new Set<number>();
  for (const b of PROPHECY_TAROT_ACTS) {
    const tag = `act ${b.act}`;
    seenActs.add(b.act);

    const seal = SEVEN_SEALS.find(
      (s) => s.num === b.sealNum && s.act === b.act,
    );
    if (!seal) {
      missing.push(`${tag}: no SEVEN_SEALS entry with num=${b.sealNum} act=${b.act}`);
    }

    if (!getProphecyById(b.prophecyBookend.openingId)) {
      missing.push(`${tag}: opening prophecy '${b.prophecyBookend.openingId}' does not resolve`);
    }
    if (!getProphecyById(b.prophecyBookend.closingId)) {
      missing.push(`${tag}: closing prophecy '${b.prophecyBookend.closingId}' does not resolve`);
    }

    if (oracleCardSlugsForAct(b.act).length === 0) {
      missing.push(`${tag}: no Oracle-Tarot card slug falls under this act in PROPHECY_VISIONS`);
    }

    if (b.danielCrossManifold !== "antiquarian_manifold") {
      missing.push(`${tag}: danielCrossManifold must be antiquarian_manifold`);
    }

    if (b.seerRegister !== expectedRegister(b.act)) {
      missing.push(
        `${tag}: seerRegister '${b.seerRegister}' breaks the warming band (expected '${expectedRegister(b.act)}')`,
      );
    }
  }

  for (let a = 1; a <= 7; a++) {
    if (!seenActs.has(a)) missing.push(`act ${a} has no prophecy-tarot binding`);
  }

  return {
    declared,
    implemented: Math.max(0, declared - missing.length),
    missing,
  };
}
