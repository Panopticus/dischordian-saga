/**
 * Transactional email — Resend-backed.
 *
 * Provider-agnostic interface: callers ask for `sendEmail(opts)`,
 * the service picks Resend (via fetch — no SDK dep) when
 * `RESEND_API_KEY` is set, otherwise falls back to a no-op that
 * logs the intended payload. This lets the rest of the codebase
 * write email-aware features without forcing every dev to set up
 * a key locally.
 *
 * Why Resend: simplest indie-friendly DX, same DPA shape as
 * SendGrid/Postmark. To swap providers later, replace the
 * `sendViaResend` implementation; the public interface stays.
 */
import { logger } from "../logger";

export interface SendEmailInput {
  /** Recipient email — already validated upstream. */
  to: string;
  /** Subject line. */
  subject: string;
  /** HTML body. Plain text auto-derived if `text` not provided. */
  html: string;
  /** Plain-text body. Best practice to provide both. */
  text?: string;
  /** Optional from override; defaults to EMAIL_FROM env. */
  from?: string;
  /** Reply-To (e.g. support@) when From is a no-reply alias. */
  replyTo?: string;
  /** Idempotency key — Resend honours it to dedup retries. */
  idempotencyKey?: string;
  /** Tag this message for analytics / Resend dashboard. */
  category?: string;
}

export interface SendEmailResult {
  /** True iff the message was accepted by the provider. */
  ok: boolean;
  /** Provider message id (Resend). */
  id?: string;
  /** Reason on failure. */
  error?: string;
  /** True iff we're running in no-op mode (no API key configured). */
  noop?: boolean;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function resolveFrom(): string {
  return process.env.EMAIL_FROM || "Loredex OS <noreply@dischordian.example>";
}

function htmlToText(html: string): string {
  // Cheap fallback: strip tags, collapse whitespace. For richer
  // formatting, callers should provide `text` explicitly.
  return html
    .replace(/<\/(p|div|li|h[1-6]|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function sendViaResend(input: SendEmailInput, apiKey: string): Promise<SendEmailResult> {
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: input.from ?? resolveFrom(),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text ?? htmlToText(input.html),
        reply_to: input.replyTo,
        tags: input.category ? [{ name: "category", value: input.category }] : undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error("email_send_failed", "emailService", {
        status: res.status,
        body: body.slice(0, 256),
        category: input.category,
      });
      return { ok: false, error: `Resend ${res.status}` };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id };
  } catch (err) {
    logger.error("email_send_threw", "emailService", {
      error: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, error: err instanceof Error ? err.message : "send threw" };
  }
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No-op mode. Log so devs notice but don't error — many flows
    // (account confirmation, password reset, etc.) want to say
    // "best-effort sent" even when email is misconfigured.
    logger.warn("email_noop_no_api_key", "emailService", {
      to: input.to,
      subject: input.subject,
      category: input.category ?? null,
    });
    return { ok: true, noop: true };
  }
  return sendViaResend(input, apiKey);
}

/* ─── Templates ─── */

/**
 * Account-deletion confirmation. Sent by `account.deleteMyAccount`.
 */
export function renderAccountDeletedEmail(opts: {
  graceWindowDays: number;
  recoverUrl: string | null;
}): { subject: string; html: string; text: string } {
  const subject = "Your Loredex OS account has been deleted";
  const recoverLine = opts.recoverUrl
    ? `<p>If this was a mistake, you can recover your account within ${opts.graceWindowDays} days at <a href="${opts.recoverUrl}">${opts.recoverUrl}</a>.</p>`
    : `<p>If this was a mistake, contact support within ${opts.graceWindowDays} days.</p>`;
  const html = `<p>Your Loredex OS account has been queued for deletion.</p>
<p>Identifying fields (name, email) have already been removed. The remaining data will be permanently erased after ${opts.graceWindowDays} days.</p>
${recoverLine}
<p>— The Architect</p>`;
  return { subject, html, text: htmlToText(html) };
}

/**
 * Data-export ready notification.
 */
export function renderDataExportEmail(opts: { downloadUrl: string; expiresAt: Date }): {
  subject: string; html: string; text: string;
} {
  const subject = "Your Loredex OS data export is ready";
  const html = `<p>Your data export is available for download:</p>
<p><a href="${opts.downloadUrl}">${opts.downloadUrl}</a></p>
<p>The link expires on ${opts.expiresAt.toUTCString()}.</p>`;
  return { subject, html, text: htmlToText(html) };
}
