// HEAD-check every Trade Empire prompt's expected URL on S3.
// Reports any 404s (= prompt vault → uploaded webp mismatches).
import { TRADE_EMPIRE_ART_PROMPTS } from "/home/user/dischordian-saga/apps/shared/tradeEmpireArtPrompts.ts";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";

const CATEGORY_DIR = {
  wonder: "wonders",
  era_banner: "eras",
  encounter_key_art: "encounters",
  doctrine_banner: "doctrines",
  fleet_silhouette: "fleet",
  pirate_portrait: "fleet",
  civic_icon: "civics",
  sector_painting: "sectors",
};

const client = new S3Client({ region: "us-east-2" });
let ok = 0, miss = 0;
const missed = [];
for (const p of TRADE_EMPIRE_ART_PROMPTS) {
  const key = `cdn/client-public/art/trade-empire/${CATEGORY_DIR[p.category]}/${p.assetId}.webp`;
  try {
    await client.send(new HeadObjectCommand({ Bucket: "dgrsart", Key: key }));
    ok++;
  } catch (e) {
    miss++;
    missed.push({ assetId: p.assetId, key, err: e.name });
  }
}
console.log(`OK: ${ok}/${TRADE_EMPIRE_ART_PROMPTS.length}, MISS: ${miss}`);
if (missed.length) {
  console.log("MISSING:");
  for (const m of missed) console.log(`  ${m.assetId} → ${m.key} (${m.err})`);
}
