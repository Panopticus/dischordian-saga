// React binding for companionScheduler. Subscribes to the bus and returns
// the currently-active line so components re-render when it changes.

import { useEffect, useState, useCallback } from "react";
import { CompanionLine } from "@shared/companion";
import {
  subscribe,
  getActive,
  dismiss,
  enqueue,
  setContext,
  getContext,
  SchedulerContext,
} from "./companionScheduler";

export function useCompanionScheduler() {
  const [active, setActive] = useState<CompanionLine | null>(getActive());
  const [context, setCtx] = useState<SchedulerContext>(getContext());

  useEffect(() => {
    const unsub = subscribe(() => {
      setActive(getActive());
      setCtx(getContext());
    });
    return unsub;
  }, []);

  const onDismiss = useCallback(() => dismiss(), []);
  const onEnqueue = useCallback((lineId: string) => enqueue(lineId), []);
  const onSetContext = useCallback((next: Partial<SchedulerContext>) => {
    setContext(next);
  }, []);

  return { active, context, dismiss: onDismiss, enqueue: onEnqueue, setContext: onSetContext };
}
