/* ═══════════════════════════════════════════════════════
   SecondChairAside

   Renders Vex's "second chair" — an Engineer-flavoured
   whisper of counsel beside a Vex commission. The text is
   pulled from the deterministic shared selector
   (apps/shared/codaSecondChair); no LLM call. The aside is
   gated to engineer_zero_hint+ so it does not surface for
   players who haven't met the reveal trigger yet, and
   suppresses entirely at vex_public.

   Visual idiom: faint indented italic on a left-rule, with
   a small "Second Chair" label. Hauntedness is rendered by
   the corruption applied at selector time — this component
   does not modify the text.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import {
  getSecondChairAdvice,
  type SecondChairAdviceContext,
  type SecondChairRevealStage,
} from "@shared/codaSecondChair";

export interface SecondChairAsideProps {
  ctx: SecondChairAdviceContext;
}

export function SecondChairAside({ ctx }: SecondChairAsideProps) {
  if (!isEligible(ctx.revealStage)) return null;
  const advice = React.useMemo(() => getSecondChairAdvice(ctx), [ctx]);
  if (!advice.rendered) return null;

  return (
    <div
      data-haunted={advice.hauntedness > 0.6 ? "true" : "false"}
      data-vex-aware={advice.isVexAware ? "true" : "false"}
      className="border-l-2 border-primary/20 pl-3 mt-3"
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="font-mono text-[10px] tracking-[0.2em] opacity-60">
          THE SECOND CHAIR
        </span>
      </div>
      <p className="text-xs italic opacity-75 leading-relaxed">
        {advice.rendered}
      </p>
    </div>
  );
}

function isEligible(stage: SecondChairRevealStage): boolean {
  return stage === "engineer_zero_hint" || stage === "engineer_zero_confirmed";
}
