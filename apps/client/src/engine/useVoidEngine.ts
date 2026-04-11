/* ═══════════════════════════════════════════════════════
   USE VOID ENGINE — React hook binding VoidEngine to game state

   Automatically syncs:
   - Morality score → Atmosphere
   - Current room → Temporary atmosphere push
   - NPC dialog open → Physics shift
   - Alignment → Mode preference
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  getAtmosphereForMorality,
  getAtmosphereForRoom,
  getPhysicsForNPC,
  setBaseTheme,
  pushTemporaryTheme,
  popTemporaryTheme,
  clearTemporaryThemes,
  applyThemeToDOM,
} from "./voidEngine";

/**
 * Bind the VoidEngine to the game state.
 * Call this once in App or AppShell.
 */
export function useVoidEngine() {
  const { state } = useGame();
  const prevRoomRef = useRef<string | null>(null);
  const roomThemeHandle = useRef<boolean>(false);

  // Sync morality score → base atmosphere
  useEffect(() => {
    const moralityScore = state.moralityScore || 0;
    const atmosphere = getAtmosphereForMorality(moralityScore);
    setBaseTheme(atmosphere);
  }, [state.moralityScore]);

  // Sync current room → temporary atmosphere
  useEffect(() => {
    const currentRoom = state.currentRoomId;

    // If we left a room, pop the temporary theme
    if (prevRoomRef.current && prevRoomRef.current !== currentRoom && roomThemeHandle.current) {
      popTemporaryTheme();
      roomThemeHandle.current = false;
    }

    // If we entered a new room, push its atmosphere
    if (currentRoom) {
      const roomAtmosphere = getAtmosphereForRoom(currentRoom.replace(/-/g, "_"));
      if (roomAtmosphere) {
        pushTemporaryTheme(roomAtmosphere, `Room: ${currentRoom}`);
        roomThemeHandle.current = true;
      }
    }

    prevRoomRef.current = currentRoom;
  }, [state.currentRoomId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTemporaryThemes();
    };
  }, []);
}

/**
 * Push an NPC's physics type as a temporary theme override.
 * Call when opening NPC dialog, pop when closing.
 */
export function useNPCPhysics(manifestation: string | null, isOpen: boolean) {
  const handleRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && manifestation && !handleRef.current) {
      // For NPC dialogs, we don't change the full theme,
      // just inject the physics type as a data attribute
      const physics = getPhysicsForNPC(manifestation);
      document.documentElement.setAttribute("data-npc-physics", physics);
      handleRef.current = true;
    } else if (!isOpen && handleRef.current) {
      document.documentElement.removeAttribute("data-npc-physics");
      handleRef.current = false;
    }

    return () => {
      if (handleRef.current) {
        document.documentElement.removeAttribute("data-npc-physics");
        handleRef.current = false;
      }
    };
  }, [isOpen, manifestation]);
}
