/**
 * AtmosphereScope — Scoped atmosphere override for a sub-tree.
 *
 * Pushes a temporary atmosphere on mount, pops on unmount.
 * Cleaner than manual useEffect push/pop in every page.
 *
 * Usage:
 *   <AtmosphereScope roomKey="arena_blood_weave">
 *     <FightArena />
 *   </AtmosphereScope>
 *
 * The atmosphere is scoped — when this component unmounts,
 * the previous atmosphere is automatically restored.
 */
import { useEffect, type ReactNode } from "react";
import { getAtmosphereForRoom, applyThemeToDOM } from "@/engine/voidEngine";

interface AtmosphereScopeProps {
  /** Room key for atmosphere lookup (see ROOM_ATMOSPHERES in voidEngine) */
  roomKey?: string;
  /** Or directly specify a theme ID */
  themeId?: string;
  children: ReactNode;
}

export default function AtmosphereScope({ roomKey, themeId, children }: AtmosphereScopeProps) {
  useEffect(() => {
    const targetTheme = themeId || (roomKey ? getAtmosphereForRoom(roomKey) : null);
    if (!targetTheme) return;

    const prevAtmosphere = document.documentElement.dataset.atmosphere;
    applyThemeToDOM(targetTheme);

    return () => {
      if (prevAtmosphere) {
        applyThemeToDOM(prevAtmosphere);
      }
    };
  }, [roomKey, themeId]);

  return <>{children}</>;
}
