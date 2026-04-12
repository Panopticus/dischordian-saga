/* Nilmorg Dialog Portraits — 5 expressions for Dead Man's Circuit */
const S3 = "https://dgrsart.s3.us-east-2.amazonaws.com/nilmorg-portraits";

export const NILMORG_PORTRAITS = {
  neutral: `${S3}/nilmorg_neutral.png`,
  amused: `${S3}/nilmorg_amused.png`,
  pleased: `${S3}/nilmorg_pleased.png`,
  disappointed: `${S3}/nilmorg_disappointed.png`,
  threatening: `${S3}/nilmorg_threatening.png`,
};

export function getNilmorgPortrait(context: string): string {
  switch (context) {
    case "player_wins": case "survived_danger": return NILMORG_PORTRAITS.pleased;
    case "player_losing": case "player_died": return NILMORG_PORTRAITS.disappointed;
    case "clone_died": case "bone_lane_grows": return NILMORG_PORTRAITS.amused;
    case "final_lap": case "circuit_begins": return NILMORG_PORTRAITS.threatening;
    default: return NILMORG_PORTRAITS.neutral;
  }
}
