import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Streamdown } from "streamdown";
import cookiesMd from "@/legal/cookies.md?raw";

const VERSION_RE = /<!--\s*version:\s*([\d-]+)\s*-->/;

function parseDocument(raw: string): { version: string; body: string } {
  const m = raw.match(VERSION_RE);
  const version = m?.[1] ?? "unknown";
  const body = raw.replace(VERSION_RE, "").replace(/^\s+/, "");
  return { version, body };
}

export default function CookiePage() {
  const { version, body } = parseDocument(cookiesMd);
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ChevronLeft size={16} /> Back
        </Link>
        <p className="font-mono text-xs text-muted-foreground mb-2" data-testid="legal-version">
          Version {version}
        </p>
        <article className="prose prose-invert prose-sm max-w-none font-mono text-sm text-foreground/85 leading-relaxed">
          <Streamdown>{body}</Streamdown>
        </article>
      </div>
    </div>
  );
}
