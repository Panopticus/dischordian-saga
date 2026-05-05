import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  renderAccountDeletedEmail,
  renderDataExportEmail,
  sendEmail,
} from "./emailService";

describe("renderAccountDeletedEmail", () => {
  it("renders subject + html + text", () => {
    const r = renderAccountDeletedEmail({ graceWindowDays: 30, recoverUrl: null });
    expect(r.subject).toMatch(/deleted/i);
    expect(r.html).toContain("30 days");
    expect(r.text).toContain("30 days");
  });

  it("includes recover link when supplied", () => {
    const r = renderAccountDeletedEmail({
      graceWindowDays: 30,
      recoverUrl: "https://x.example/recover",
    });
    expect(r.html).toContain("https://x.example/recover");
  });
});

describe("renderDataExportEmail", () => {
  it("includes download URL + expiry", () => {
    const r = renderDataExportEmail({
      downloadUrl: "https://x.example/dl",
      expiresAt: new Date("2026-06-01T00:00:00Z"),
    });
    expect(r.html).toContain("https://x.example/dl");
    expect(r.html).toContain("2026");
  });
});

describe("sendEmail", () => {
  const originalKey = process.env.RESEND_API_KEY;
  afterEach(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
  });

  it("no-ops cleanly when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const r = await sendEmail({
      to: "test@example.com",
      subject: "hi",
      html: "<p>hi</p>",
    });
    expect(r.ok).toBe(true);
    expect(r.noop).toBe(true);
  });

  it("calls Resend when API key is present", async () => {
    process.env.RESEND_API_KEY = "re_fake_key";
    const fetchSpy = vi.spyOn(globalThis, "fetch" as never).mockResolvedValue(
      new Response(JSON.stringify({ id: "msg_123" }), { status: 200 }) as never,
    );
    const r = await sendEmail({
      to: "test@example.com",
      subject: "hi",
      html: "<p>hi</p>",
      category: "test",
    });
    expect(r.ok).toBe(true);
    expect(r.id).toBe("msg_123");
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_fake_key",
        }),
      }),
    );
    fetchSpy.mockRestore();
  });

  it("returns ok=false on non-2xx", async () => {
    process.env.RESEND_API_KEY = "re_fake_key";
    const fetchSpy = vi.spyOn(globalThis, "fetch" as never).mockResolvedValue(
      new Response("error", { status: 400 }) as never,
    );
    const r = await sendEmail({
      to: "test@example.com",
      subject: "hi",
      html: "<p>hi</p>",
    });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("400");
    fetchSpy.mockRestore();
  });
});
