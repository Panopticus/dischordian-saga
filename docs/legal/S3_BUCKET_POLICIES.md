# S3 bucket policies — Infrastructure-as-Code

Audit/15.R5 — `apps/scripts/upload-public-to-s3.ts` ships assets to
the **dgrsart** bucket under `cdn/client-public/` and refers to "the
existing `PublicReadCDN` bucket policy." That policy has not been
checked into git, so a future drop of a non-public file (PII export,
debug build, internal asset) into the bucket would silently be
world-readable.

This document is the IaC source of truth. Any change to bucket
posture (bucket policy, CORS, BPA settings, lifecycle rule) must
land here AND be applied to AWS via the deploy pipeline; the policy
in AWS must equal the JSON below by hash.

## Buckets

The repo writes to two buckets:

- **dgrsart** (us-east-2) — image, audio, video, music, sample
  CDN. Mirror of `apps/client/public/{art,audio,videos,music,games}`.
- **dgrsvoices** (us-east-2) — voice-over deliverables from the
  ElevenLabs pipeline. Public-read for the published acts; private
  for the staging prefix.

## Path-scoped public-read

Both buckets have **Block Public Access enabled at the account
level** for ACL-based grants; the public-read posture is granted
**only via bucket policy**, scoped to specific path prefixes.

### dgrsart bucket policy (canonical)

```json
{
  "Version": "2012-10-17",
  "Id": "PublicReadCDN-dgrsart",
  "Statement": [
    {
      "Sid": "AllowPublicReadOfClientPublicPrefix",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dgrsart/cdn/client-public/*"
    },
    {
      "Sid": "DenyPublicListing",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::dgrsart"
    }
  ]
}
```

The `Deny ListBucket` clause prevents directory-style enumeration of
the bucket contents — a client that knows the asset URL gets the
asset, but cannot browse for siblings.

### dgrsvoices bucket policy (canonical)

```json
{
  "Version": "2012-10-17",
  "Id": "PublicReadCDN-dgrsvoices",
  "Statement": [
    {
      "Sid": "AllowPublicReadOfPublishedActs",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::dgrsvoices/published/*",
        "arn:aws:s3:::dgrsvoices/cdn/*"
      ]
    },
    {
      "Sid": "DenyPublicReadOfStaging",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dgrsvoices/staging/*"
    }
  ]
}
```

## Block Public Access settings (account-level)

Account-level BPA on both buckets:

| Setting | Value |
|---|---|
| BlockPublicAcls | `true` |
| IgnorePublicAcls | `true` |
| BlockPublicPolicy | `false` (we use a public read policy) |
| RestrictPublicBuckets | `false` |

Per-bucket BPA mirrors the account level except `BlockPublicPolicy`,
which is `false` so the policy above is effective.

## CORS

Both buckets allow `GET` from the production origin and Capacitor
custom-scheme origins (`capacitor://localhost`,
`http://localhost`). No `*` origin.

```json
[
  {
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://dischordian-saga.com",
      "https://www.dischordian-saga.com",
      "capacitor://localhost",
      "http://localhost",
      "ionic://localhost"
    ],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

## Upload pipeline guards

`apps/scripts/upload-public-to-s3.ts` guards uploads with:

1. **Path prefix allowlist** — uploads only land under
   `cdn/client-public/<dir>/...` for an explicit `dir` in
   `art|audio|videos|music|games|...`.
2. **MIME allowlist** — image/audio/video/font types only. Refuses
   `application/json`, `text/plain`, etc.
3. **ETag idempotency** — `HeadObject` first; skip if ETag matches.
   Re-uploads only when content changes.

Adding a new top-level prefix (e.g. `cdn/client-public/replays/`)
requires:
- A new entry in the upload script's allowlist.
- A new `Sid: AllowPublicReadOf<Prefix>` statement here, OR
- An explicit decision NOT to make the prefix public — in which case
  the prefix is omitted from the `AllowPublicRead*` Resource arrays.

## Drift verification

A weekly cron (`scripts/verify-s3-policies.ts`, planned) fetches the
live bucket policies via STS AssumeRole into a read-only audit role
and diffs against this file. Any drift triggers an alert; the next
deploy reapplies the canonical JSON.

Until that lands, manual verification:

```bash
aws s3api get-bucket-policy --bucket dgrsart \
  | jq -r '.Policy' | jq . > /tmp/dgrsart.live.json
diff /tmp/dgrsart.live.json docs/legal/S3_BUCKET_POLICIES.md  # extract JSON manually
```
