/**
 * Governance Hub router-presence parity check.
 *
 * `apps/client/src/pages/GovernanceHubPage.tsx` consumes
 * `trpc.architectConsole.getActiveVotes` and `submitVote`. The earlier
 * audit caught it on `MOCK_ACTIVE_VOTE`; that has since been replaced
 * with real procedure calls. This check freezes the closure: if either
 * the page falls back to a mock literal, OR the matching server router
 * procedures are removed, the gate fires.
 *
 * Hard parity. The page-side and the server-side must move together.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

const PAGE_PATH = path.join(
  REPO_ROOT,
  "apps/client/src/pages/GovernanceHubPage.tsx",
);
const SERVER_DIR = path.join(REPO_ROOT, "apps/server");

interface GovernanceArtifact {
  id: string;
  description: string;
  present: () => boolean;
}

function pageSrc(): string {
  return fs.existsSync(PAGE_PATH) ? fs.readFileSync(PAGE_PATH, "utf-8") : "";
}

function anyServerMatch(re: RegExp): boolean {
  return walkSourceFiles(SERVER_DIR).some((f) =>
    re.test(fs.readFileSync(f, "utf-8")),
  );
}

const ARTIFACTS: ReadonlyArray<GovernanceArtifact> = [
  {
    id: "page:no_mock_literal",
    description:
      "GovernanceHubPage.tsx must not reintroduce a MOCK_ literal — every render path goes through tRPC",
    present: () => !/\bMOCK_[A-Z_]+\b/.test(pageSrc()),
  },
  {
    id: "page:reads_active_votes",
    description:
      "GovernanceHubPage.tsx calls trpc.architectConsole.getActiveVotes — page-side wiring of the read path",
    present: () =>
      /trpc\.architectConsole\.getActiveVotes\.useQuery/.test(pageSrc()),
  },
  {
    id: "page:submits_vote",
    description:
      "GovernanceHubPage.tsx calls trpc.architectConsole.submitVote — page-side wiring of the write path",
    present: () =>
      /trpc\.architectConsole\.submitVote\.useMutation/.test(pageSrc()),
  },
  {
    id: "server:get_active_votes_procedure",
    description:
      "server defines a getActiveVotes procedure on architectConsole router",
    present: () =>
      anyServerMatch(
        /getActiveVotes\s*:\s*(?:public|protected|admin|moderator)?Procedure/,
      ),
  },
  {
    id: "server:submit_vote_procedure",
    description:
      "server defines a submitVote procedure on architectConsole router",
    present: () =>
      anyServerMatch(
        /submitVote\s*:\s*(?:public|protected|admin|moderator)?Procedure/,
      ),
  },
];

export function checkGovernanceRouterPresence(): RawParityCount {
  const missing: string[] = [];
  for (const a of ARTIFACTS) {
    if (!a.present()) {
      missing.push(`${a.id}: ${a.description}`);
    }
  }
  return {
    declared: ARTIFACTS.length,
    implemented: ARTIFACTS.length - missing.length,
    missing,
  };
}
