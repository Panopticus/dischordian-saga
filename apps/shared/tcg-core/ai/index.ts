export { chooseCampaignAction } from "./campaignAI";
// 1-ply lookahead — plan §C2. Engine wiring is opt-in; consumers
// generate candidate plays + project per-candidate post-state, then
// hand the list to pickBestPlay or pickEpsilonGreedy for selection.
export {
  evaluateState,
  pickBestPlay,
  pickEpsilonGreedy,
  scoreCandidates,
  EVAL_WEIGHTS,
  type AIEvalState,
  type CandidatePlay,
} from "./lookahead";
