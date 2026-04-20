/* ═══════════════════════════════════════════════════════
   WEBCRYPTO GLOBAL GUARANTEE
   `jose` and anything else reaching for WebCrypto resolves
   `crypto` off the global scope. Node 22 is supposed to
   populate `globalThis.crypto` by default, but production
   OAuth callbacks have been failing with
   `ReferenceError: crypto is not defined`, so wire the
   builtin webcrypto into `globalThis` defensively.

   This module is imported first in the server entry so the
   assignment runs before any downstream module (jose, sdk)
   initializes. Keep it dependency-free beyond `node:crypto`.
   ═══════════════════════════════════════════════════════ */
import { webcrypto } from "node:crypto";

if (!globalThis.crypto) {
  (globalThis as unknown as { crypto: Crypto }).crypto = webcrypto as unknown as Crypto;
}
