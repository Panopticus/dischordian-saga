import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DIALECTS, PHONEMES, TONGUE_TWISTERS, type Dialect, type Phoneme } from "@/data/dialectData";
import { Mic, MicOff, Volume2, Play, Pause, RotateCcw, Search, Award, Flame, Target, Waves, Book } from "lucide-react";

type Section = "dialects" | "phonemes" | "mouth" | "twisters" | "progress";

interface PracticeStats {
  phonemesExplored: Set<string>;
  dialectsStudied: Set<string>;
  twistersCompleted: number;
  streakDays: number;
  totalMinutes: number;
  lastPractice: string | null;
}

const DEFAULT_STATS: PracticeStats = {
  phonemesExplored: new Set(),
  dialectsStudied: new Set(),
  twistersCompleted: 0,
  streakDays: 0,
  totalMinutes: 0,
  lastPractice: null,
};

const STORAGE_KEY = "dialect-studio-stats-v1";

function loadStats(): PracticeStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      phonemesExplored: new Set(parsed.phonemesExplored || []),
      dialectsStudied: new Set(parsed.dialectsStudied || []),
    };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(stats: PracticeStats) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...stats,
        phonemesExplored: Array.from(stats.phonemesExplored),
        dialectsStudied: Array.from(stats.dialectsStudied),
      })
    );
  } catch {
    /* ignore */
  }
}

export default function DialectStudioPage() {
  const [section, setSection] = useState<Section>("dialects");
  const [stats, setStats] = useState<PracticeStats>(loadStats);
  const [selectedDialect, setSelectedDialect] = useState<Dialect>(DIALECTS[0]);
  const [selectedPhoneme, setSelectedPhoneme] = useState<Phoneme>(PHONEMES[0]);
  const [search, setSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentTwister, setCurrentTwister] = useState(0);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Update streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    setStats((prev) => {
      if (prev.lastPractice === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = prev.lastPractice === yesterday ? prev.streakDays + 1 : 1;
      return { ...prev, lastPractice: today, streakDays: newStreak };
    });
  }, []);

  const markPhoneme = useCallback((ipa: string) => {
    setStats((prev) => {
      const next = new Set(prev.phonemesExplored);
      next.add(ipa);
      return { ...prev, phonemesExplored: next };
    });
  }, []);

  const markDialect = useCallback((id: string) => {
    setStats((prev) => {
      const next = new Set(prev.dialectsStudied);
      next.add(id);
      return { ...prev, dialectsStudied: next };
    });
  }, []);

  // Text-to-speech playback
  const speak = useCallback((text: string, lang = "en-US", rate = 0.9) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.onstart = () => setSpeaking(text);
    u.onend = () => setSpeaking(null);
    u.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(null);
  }, []);

  // Mic-based audio level meter (no transcription — just visualization)
  useEffect(() => {
    if (!isRecording) {
      setAudioLevel(0);
      return;
    }
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let stream: MediaStream | null = null;
    let rafId: number;
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        const AC: typeof AudioContext =
          (window.AudioContext as typeof AudioContext) ||
          ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
        audioCtx = new AC();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const src = audioCtx.createMediaStreamSource(s);
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setAudioLevel(Math.min(100, (avg / 128) * 100));
          rafId = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        setIsRecording(false);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
      audioCtx?.close();
    };
  }, [isRecording]);

  const filteredPhonemes = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return PHONEMES;
    return PHONEMES.filter(
      (p) =>
        p.ipa.includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.example.toLowerCase().includes(q)
    );
  }, [search]);

  const completionPct = useMemo(() => {
    const total = PHONEMES.length + DIALECTS.length + TONGUE_TWISTERS.length;
    const done =
      stats.phonemesExplored.size + stats.dialectsStudied.size + stats.twistersCompleted;
    return Math.min(100, Math.round((done / total) * 100));
  }, [stats]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <Header stats={stats} completion={completionPct} />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Tabs value={section} onValueChange={(v) => setSection(v as Section)}>
          <TabsList className="w-full grid grid-cols-5 mb-6 h-auto">
            <TabsTrigger value="dialects" className="flex-col py-2 gap-1">
              <Waves className="size-4" />
              <span className="text-xs">Dialects</span>
            </TabsTrigger>
            <TabsTrigger value="phonemes" className="flex-col py-2 gap-1">
              <Book className="size-4" />
              <span className="text-xs">Phonemes</span>
            </TabsTrigger>
            <TabsTrigger value="mouth" className="flex-col py-2 gap-1">
              <Target className="size-4" />
              <span className="text-xs">Mouth Lab</span>
            </TabsTrigger>
            <TabsTrigger value="twisters" className="flex-col py-2 gap-1">
              <Flame className="size-4" />
              <span className="text-xs">Twisters</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex-col py-2 gap-1">
              <Award className="size-4" />
              <span className="text-xs">Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dialects">
            <DialectsSection
              dialects={DIALECTS}
              selected={selectedDialect}
              onSelect={(d) => {
                setSelectedDialect(d);
                markDialect(d.id);
              }}
              speak={speak}
              stopSpeaking={stopSpeaking}
              speaking={speaking}
              studied={stats.dialectsStudied}
            />
          </TabsContent>

          <TabsContent value="phonemes">
            <PhonemesSection
              phonemes={filteredPhonemes}
              selected={selectedPhoneme}
              onSelect={(p) => {
                setSelectedPhoneme(p);
                markPhoneme(p.ipa);
              }}
              search={search}
              onSearch={setSearch}
              speak={speak}
              speaking={speaking}
              explored={stats.phonemesExplored}
            />
          </TabsContent>

          <TabsContent value="mouth">
            <MouthLabSection
              phoneme={selectedPhoneme}
              isRecording={isRecording}
              onToggleRecording={() => setIsRecording((r) => !r)}
              audioLevel={audioLevel}
              speak={speak}
              speaking={speaking}
            />
          </TabsContent>

          <TabsContent value="twisters">
            <TongueTwistersSection
              current={currentTwister}
              setCurrent={setCurrentTwister}
              speak={speak}
              speaking={speaking}
              isRecording={isRecording}
              onToggleRecording={() => setIsRecording((r) => !r)}
              audioLevel={audioLevel}
              onComplete={() =>
                setStats((prev) => ({ ...prev, twistersCompleted: prev.twistersCompleted + 1 }))
              }
            />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressSection stats={stats} completion={completionPct} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DIALECTS SECTION
// ═══════════════════════════════════════════════════════════════
function DialectsSection({
  dialects,
  selected,
  onSelect,
  speak,
  stopSpeaking,
  speaking,
  studied,
}: {
  dialects: Dialect[];
  selected: Dialect;
  onSelect: (d: Dialect) => void;
  speak: (text: string, lang?: string, rate?: number) => void;
  stopSpeaking: () => void;
  speaking: string | null;
  studied: Set<string>;
}) {
  const langMap: Record<string, string> = {
    "rp-british": "en-GB",
    cockney: "en-GB",
    "southern-us": "en-US",
    "new-york": "en-US",
    irish: "en-IE",
    australian: "en-AU",
    "french-english": "fr-FR",
  };

  const lang = langMap[selected.id] ?? "en-US";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      {/* Dialect list */}
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Accent Library</CardTitle>
          <CardDescription className="text-xs">Select an accent to study</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {dialects.map((d) => {
            const isActive = d.id === selected.id;
            const isStudied = studied.has(d.id);
            return (
              <button
                key={d.id}
                onClick={() => onSelect(d)}
                className={`w-full text-left px-3 py-2.5 rounded-md border transition-all ${
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-border hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg leading-none font-mono">{d.flag}</span>
                    <span className="font-medium text-sm truncate">{d.name}</span>
                  </div>
                  {isStudied && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] py-0 h-4 ${
                      d.difficulty === "beginner"
                        ? "border-green-500/30 text-green-600"
                        : d.difficulty === "intermediate"
                          ? "border-yellow-500/30 text-yellow-600"
                          : "border-red-500/30 text-red-600"
                    }`}
                  >
                    {d.difficulty}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground truncate">{d.region}</span>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Dialect detail */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="font-mono">{selected.flag}</span>
                  {selected.name}
                </CardTitle>
                <CardDescription className="mt-1">{selected.description}</CardDescription>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {selected.signature.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.keyFeatures.map((f) => (
                <div key={f.title} className="border-l-2 border-primary/40 pl-3">
                  <div className="font-semibold text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{f.description}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Phoneme shifts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Phoneme Shifts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selected.phonemeShifts.map((ps, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <code className="font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">
                    {ps.standard}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <code className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                    {ps.dialect}
                  </code>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs">{ps.example}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{ps.note}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Mouth posture & prosody */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Mouth Posture &amp; Prosody
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-md bg-muted/50 border">
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Oral Posture
              </div>
              <p className="text-sm">{selected.mouthPosture}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-md bg-accent/30 border">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold">Rhythm</div>
                <div className="text-xs mt-1">{selected.prosody.rhythm}</div>
              </div>
              <div className="p-2.5 rounded-md bg-accent/30 border">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Intonation
                </div>
                <div className="text-xs mt-1">{selected.prosody.intonation}</div>
              </div>
              <div className="p-2.5 rounded-md bg-accent/30 border">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold">Stress</div>
                <div className="text-xs mt-1">{selected.prosody.stress}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice phrases */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Practice Phrases
            </CardTitle>
            {speaking && (
              <Button size="sm" variant="outline" onClick={stopSpeaking}>
                <Pause className="size-3" />
                Stop
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {selected.practicePhrases.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-md border hover:bg-accent/30 transition-colors"
              >
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="shrink-0 mt-0.5"
                  onClick={() => speak(p.text, lang)}
                  disabled={speaking === p.text}
                >
                  {speaking === p.text ? (
                    <Volume2 className="size-4 text-primary animate-pulse" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.text}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">/{p.phonetic}/</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[9px] py-0 h-4">
                      {p.focus}
                    </Badge>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className={`w-1 h-3 rounded-sm ${
                            n <= p.difficulty ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Common words & Famous examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Signature Words
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {selected.commonWords.map((w) => (
                <div
                  key={w.word}
                  className="flex items-center justify-between text-xs p-2 rounded hover:bg-accent/30 transition-colors"
                >
                  <button
                    onClick={() => speak(w.word, lang)}
                    className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                  >
                    <Play className="size-3" />
                    {w.word}
                  </button>
                  <code className="font-mono text-muted-foreground">{w.pronunciation}</code>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Listen To
              </CardTitle>
              <CardDescription className="text-xs">
                Study these performers for authentic reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {selected.famousExamples.map((name) => (
                  <div key={name} className="text-xs flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {name}
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1.5">
                Common Pitfalls
              </div>
              <ul className="space-y-1">
                {selected.pitfalls.map((p) => (
                  <li key={p} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-destructive shrink-0">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Header({ stats, completion }: { stats: PracticeStats; completion: number }) {
  return (
    <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Waves className="size-7 text-primary" />
              Dialect Studio
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Master accents with phonemes, mouth positioning, and ear training.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20">
              <Flame className="size-4 text-orange-500" />
              <span className="text-sm font-semibold">{stats.streakDays}</span>
              <span className="text-xs text-muted-foreground">streak</span>
            </div>
            <div className="hidden md:flex items-center gap-2 min-w-[180px]">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Library</span>
              <Progress value={completion} className="w-24" />
              <span className="text-xs font-mono">{completion}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PHONEMES SECTION - IPA explorer
// ═══════════════════════════════════════════════════════════════
function PhonemesSection({
  phonemes,
  selected,
  onSelect,
  search,
  onSearch,
  speak,
  speaking,
  explored,
}: {
  phonemes: Phoneme[];
  selected: Phoneme;
  onSelect: (p: Phoneme) => void;
  search: string;
  onSearch: (s: string) => void;
  speak: (text: string) => void;
  speaking: string | null;
  explored: Set<string>;
}) {
  const byType = useMemo(() => {
    const groups = { vowel: [] as Phoneme[], diphthong: [] as Phoneme[], consonant: [] as Phoneme[] };
    phonemes.forEach((p) => groups[p.type].push(p));
    return groups;
  }, [phonemes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Book className="size-4" />
            IPA Phoneme Chart
          </CardTitle>
          <CardDescription className="text-xs">
            International Phonetic Alphabet — the building blocks of every accent
          </CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search phonemes, examples..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[560px] pr-2">
            {(["vowel", "diphthong", "consonant"] as const).map((type) => {
              const items = byType[type];
              if (!items.length) return null;
              return (
                <div key={type} className="mb-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 sticky top-0 bg-card py-1">
                    {type}s ({items.length})
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {items.map((p) => {
                      const isActive = p.ipa === selected.ipa;
                      const isExplored = explored.has(p.ipa);
                      return (
                        <button
                          key={p.ipa}
                          onClick={() => onSelect(p)}
                          className={`relative p-2 rounded-md border font-mono text-lg transition-all ${
                            isActive
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border hover:border-primary/50 hover:bg-accent/50"
                          }`}
                          title={p.name}
                        >
                          {p.ipa}
                          {isExplored && !isActive && (
                            <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-green-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Phoneme detail */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="text-6xl font-mono text-primary leading-none">{selected.ipa}</div>
            <div className="flex-1">
              <CardTitle>{selected.name}</CardTitle>
              <CardDescription className="mt-1">
                {selected.type} · {selected.voicing}
              </CardDescription>
              <div className="text-sm mt-2">
                Example: <span className="font-semibold">{selected.example}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => speak(selected.example.split(",")[0])}
              >
                {speaking === selected.example.split(",")[0] ? (
                  <>
                    <Volume2 className="size-3 animate-pulse" /> Playing
                  </>
                ) : (
                  <>
                    <Play className="size-3" /> Hear example
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ArticulationCell label="Mouth" value={selected.mouthPosition} />
            <ArticulationCell label="Tongue" value={selected.tonguePosition} />
            <ArticulationCell label="Lips" value={selected.lipShape} />
            <ArticulationCell label="Jaw" value={selected.jawPosition} />
          </div>
          <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
            <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
              Coach's Tip
            </div>
            <p className="text-sm">{selected.tip}</p>
          </div>
          <MouthDiagram phoneme={selected} />
        </CardContent>
      </Card>
    </div>
  );
}

function ArticulationCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-md bg-muted/50 border">
      <div className="text-[10px] uppercase text-muted-foreground font-semibold">{label}</div>
      <div className="text-xs mt-0.5">{value}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOUTH DIAGRAM - SVG side-profile
// ═══════════════════════════════════════════════════════════════
function MouthDiagram({ phoneme }: { phoneme: Phoneme }) {
  // Map phoneme features to diagram parameters
  const mouth = phoneme.mouthPosition.toLowerCase();
  const tongue = phoneme.tonguePosition.toLowerCase();
  const lips = phoneme.lipShape.toLowerCase();

  // Jaw opening
  const isOpen = mouth.includes("wide open") || mouth.includes("open") || tongue.includes("low");
  const isNearClosed = mouth.includes("narrow") || mouth.includes("closed");
  const jawY = isOpen ? 175 : isNearClosed ? 135 : 155;

  // Tongue position
  const tongueHigh = tongue.includes("high");
  const tongueBack = tongue.includes("back");
  const tongueFront = tongue.includes("forward") || tongue.includes("front");
  const tongueX = tongueBack ? 130 : tongueFront ? 80 : 105;
  const tongueY = tongueHigh ? 120 : tongue.includes("low") ? 160 : 140;

  // Lip shape
  const rounded = lips.includes("round") || lips.includes("protru") || lips.includes("pucker");
  const spread = lips.includes("spread") || lips.includes("smil");

  return (
    <div className="rounded-md bg-card border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Side-Profile Diagram
      </div>
      <svg viewBox="0 0 220 220" className="w-full max-w-[280px] mx-auto">
        {/* Head outline */}
        <path
          d="M 30 60 Q 30 20 80 20 Q 160 20 190 60 Q 200 90 195 120 Q 200 140 185 150 L 180 170 Q 175 200 140 205 Q 90 210 60 190 Q 40 175 40 150 Q 25 135 30 110 Q 25 85 30 60 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        {/* Nose */}
        <path d="M 195 115 Q 210 120 205 135 L 195 140" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        {/* Upper jaw fixed */}
        <path d="M 60 130 L 190 130 L 190 140 L 60 140 Z" fill="currentColor" opacity="0.1" />
        {/* Teeth markers */}
        <g opacity="0.5" stroke="currentColor" strokeWidth="0.5">
          {[70, 85, 100, 115, 130, 145, 160, 175].map((x) => (
            <line key={`u${x}`} x1={x} y1="130" x2={x} y2="140" />
          ))}
        </g>
        {/* Lower jaw (animated position) */}
        <g style={{ transition: "transform 0.4s" }}>
          <path d={`M 60 ${jawY} L 190 ${jawY} L 190 ${jawY + 10} L 60 ${jawY + 10} Z`} fill="currentColor" opacity="0.1" />
          <g opacity="0.5" stroke="currentColor" strokeWidth="0.5">
            {[70, 85, 100, 115, 130, 145, 160, 175].map((x) => (
              <line key={`l${x}`} x1={x} y1={jawY} x2={x} y2={jawY + 10} />
            ))}
          </g>
        </g>
        {/* Tongue - morphs to phoneme */}
        <ellipse
          cx={tongueX}
          cy={tongueY}
          rx="45"
          ry="22"
          fill="#ef4444"
          opacity="0.7"
          style={{ transition: "all 0.4s ease" }}
        />
        <ellipse
          cx={tongueX - 25}
          cy={tongueY - 3}
          rx="15"
          ry="10"
          fill="#ef4444"
          opacity="0.9"
          style={{ transition: "all 0.4s ease" }}
        />
        {/* Lips */}
        {rounded ? (
          <g>
            <ellipse cx="50" cy={(135 + jawY) / 2} rx="10" ry="12" fill="none" stroke="#ec4899" strokeWidth="2.5" />
          </g>
        ) : spread ? (
          <g>
            <path
              d={`M 35 ${(135 + jawY) / 2 - 3} L 65 ${(135 + jawY) / 2 - 5} M 35 ${(135 + jawY) / 2 + 3} L 65 ${(135 + jawY) / 2 + 5}`}
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g>
            <path
              d={`M 38 ${(135 + jawY) / 2 - 4} Q 50 ${(135 + jawY) / 2 - 6} 62 ${(135 + jawY) / 2 - 4} M 38 ${(135 + jawY) / 2 + 4} Q 50 ${(135 + jawY) / 2 + 6} 62 ${(135 + jawY) / 2 + 4}`}
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}
        {/* Labels */}
        <text x="110" y="15" fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">HARD PALATE</text>
        <text x="15" y={(135 + jawY) / 2 + 3} fontSize="9" fill="#ec4899" textAnchor="middle">LIPS</text>
        <text x={tongueX} y={tongueY + 3} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">TONGUE</text>
      </svg>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 opacity-70" /> Tongue
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-pink-500" /> Lips
        </span>
        <span>Jaw opening: {isOpen ? "wide" : isNearClosed ? "closed" : "mid"}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOUTH LAB - Interactive mic practice
// ═══════════════════════════════════════════════════════════════
function MouthLabSection({
  phoneme,
  isRecording,
  onToggleRecording,
  audioLevel,
  speak,
  speaking,
}: {
  phoneme: Phoneme;
  isRecording: boolean;
  onToggleRecording: () => void;
  audioLevel: number;
  speak: (text: string) => void;
  speaking: string | null;
}) {
  const exampleWord = phoneme.example.split(",")[0].trim();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="size-4" />
            Mouth Lab
          </CardTitle>
          <CardDescription>
            Practice <span className="font-mono text-primary">/{phoneme.ipa}/</span> — watch the
            diagram, then mimic it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MouthDiagram phoneme={phoneme} />
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-md bg-muted/50 border text-xs">
              <div className="text-[10px] uppercase text-muted-foreground font-semibold">Tongue</div>
              <div className="mt-0.5">{phoneme.tonguePosition}</div>
            </div>
            <div className="p-2.5 rounded-md bg-muted/50 border text-xs">
              <div className="text-[10px] uppercase text-muted-foreground font-semibold">Lips</div>
              <div className="mt-0.5">{phoneme.lipShape}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Record &amp; Compare</CardTitle>
          <CardDescription>
            Listen, then record yourself. Compare waveforms by ear.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-md border bg-accent/20">
            <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-2">
              Target
            </div>
            <div className="text-3xl font-semibold mb-1">{exampleWord}</div>
            <div className="text-sm font-mono text-primary">/{phoneme.ipa}/</div>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => speak(exampleWord)}
              disabled={speaking === exampleWord}
            >
              {speaking === exampleWord ? (
                <>
                  <Volume2 className="size-3 animate-pulse" /> Playing
                </>
              ) : (
                <>
                  <Play className="size-3" /> Hear target
                </>
              )}
            </Button>
          </div>

          <div className="p-4 rounded-md border">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                Your voice
              </div>
              <Button
                size="sm"
                variant={isRecording ? "destructive" : "default"}
                onClick={onToggleRecording}
              >
                {isRecording ? (
                  <>
                    <MicOff className="size-3" /> Stop
                  </>
                ) : (
                  <>
                    <Mic className="size-3" /> Record
                  </>
                )}
              </Button>
            </div>
            {/* Audio level meter */}
            <div className="space-y-1.5">
              <div className="flex gap-0.5 items-end h-16">
                {Array.from({ length: 32 }).map((_, i) => {
                  const barHeight = isRecording
                    ? Math.max(4, Math.min(64, audioLevel + Math.random() * 20 - 10 - Math.abs(i - 16) * 2))
                    : 4;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-all ${
                        isRecording ? "bg-gradient-to-t from-primary to-primary/60" : "bg-muted"
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{isRecording ? "Listening..." : "Press record to begin"}</span>
                <span className="font-mono">{Math.round(audioLevel)} dB</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
            <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
              Self-check
            </div>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-primary shrink-0">✓</span>
                Did your tongue reach the position shown?
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary shrink-0">✓</span>
                Are your lips in the right shape?
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary shrink-0">✓</span>
                Is the jaw opening correct?
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary shrink-0">✓</span>
                {phoneme.voicing === "voiced"
                  ? "Can you feel your vocal cords vibrate?"
                  : "Is your voice off (unvoiced)?"}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TONGUE TWISTERS
// ═══════════════════════════════════════════════════════════════
function TongueTwistersSection({
  current,
  setCurrent,
  speak,
  speaking,
  isRecording,
  onToggleRecording,
  audioLevel,
  onComplete,
}: {
  current: number;
  setCurrent: (n: number) => void;
  speak: (text: string, lang?: string, rate?: number) => void;
  speaking: string | null;
  isRecording: boolean;
  onToggleRecording: () => void;
  audioLevel: number;
  onComplete: () => void;
}) {
  const t = TONGUE_TWISTERS[current];
  const [repsCompleted, setRepsCompleted] = useState(0);

  const handleComplete = () => {
    setRepsCompleted((r) => r + 1);
    if (repsCompleted >= 2) {
      onComplete();
      setRepsCompleted(0);
      const next = (current + 1) % TONGUE_TWISTERS.length;
      setCurrent(next);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="size-4 text-orange-500" />
                Tongue Twister Challenge
              </CardTitle>
              <CardDescription>
                Twister {current + 1} of {TONGUE_TWISTERS.length} · {t.focus}
              </CardDescription>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`w-2 h-4 rounded-sm ${n <= t.difficulty ? "bg-orange-500" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 text-center">
            <p className="text-xl md:text-2xl font-medium leading-relaxed">{t.text}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" onClick={() => speak(t.text, "en-US", 0.7)} disabled={!!speaking}>
              <Play className="size-3" /> Slow
            </Button>
            <Button variant="outline" onClick={() => speak(t.text, "en-US", 1.0)} disabled={!!speaking}>
              <Play className="size-3" /> Normal
            </Button>
            <Button variant="outline" onClick={() => speak(t.text, "en-US", 1.3)} disabled={!!speaking}>
              <Play className="size-3" /> Fast
            </Button>
            <Button
              variant={isRecording ? "destructive" : "default"}
              onClick={onToggleRecording}
            >
              {isRecording ? <MicOff className="size-3" /> : <Mic className="size-3" />}
              {isRecording ? "Stop" : "Record Yourself"}
            </Button>
          </div>

          {isRecording && (
            <div className="flex gap-0.5 items-end h-12 px-4">
              {Array.from({ length: 48 }).map((_, i) => {
                const h = Math.max(3, Math.min(48, audioLevel + Math.random() * 15 - 7));
                return (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-orange-500 to-orange-300" style={{ height: `${h}px` }} />
                );
              })}
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Reps this twister</div>
              <div className="flex gap-1.5 mt-1.5">
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                      n < repsCompleted
                        ? "border-green-500 bg-green-500/20 text-green-600"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {n < repsCompleted ? "✓" : n + 1}
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleComplete}>
              {repsCompleted >= 2 ? "Complete & Next" : "Got it!"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {TONGUE_TWISTERS.map((tw, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setRepsCompleted(0);
              }}
              className={`w-full text-left px-3 py-2 rounded-md border text-xs transition-all ${
                i === current
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-border hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate flex-1">{tw.text}</span>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`w-1 h-3 rounded-sm ${
                        n <= tw.difficulty ? "bg-orange-500" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{tw.focus}</div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS SECTION
// ═══════════════════════════════════════════════════════════════
function ProgressSection({ stats, completion }: { stats: PracticeStats; completion: number }) {
  const achievements = [
    {
      id: "first-phoneme",
      name: "First Sound",
      desc: "Explored your first phoneme",
      unlocked: stats.phonemesExplored.size >= 1,
      icon: "🎯",
    },
    {
      id: "phoneme-master",
      name: "Phoneme Master",
      desc: "Explored 10 phonemes",
      unlocked: stats.phonemesExplored.size >= 10,
      icon: "📖",
    },
    {
      id: "polyglot",
      name: "Polyglot",
      desc: "Studied 3 dialects",
      unlocked: stats.dialectsStudied.size >= 3,
      icon: "🌍",
    },
    {
      id: "twister-champ",
      name: "Twister Champion",
      desc: "Completed 5 tongue twisters",
      unlocked: stats.twistersCompleted >= 5,
      icon: "🔥",
    },
    {
      id: "week-streak",
      name: "Dedicated",
      desc: "7-day practice streak",
      unlocked: stats.streakDays >= 7,
      icon: "⚡",
    },
    {
      id: "completionist",
      name: "Completionist",
      desc: "Explored every phoneme",
      unlocked: stats.phonemesExplored.size >= PHONEMES.length,
      icon: "🏆",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="size-4" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Current Streak" value={stats.streakDays} suffix="days" icon="🔥" />
            <StatCard label="Library Explored" value={completion} suffix="%" icon="📚" />
            <StatCard
              label="Phonemes"
              value={stats.phonemesExplored.size}
              suffix={`/ ${PHONEMES.length}`}
              icon="🔤"
            />
            <StatCard
              label="Dialects"
              value={stats.dialectsStudied.size}
              suffix={`/ ${DIALECTS.length}`}
              icon="🌍"
            />
            <StatCard label="Twisters" value={stats.twistersCompleted} suffix="done" icon="⚡" />
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center justify-between">
              <span>Phoneme Coverage</span>
              <span className="text-muted-foreground">
                {stats.phonemesExplored.size} / {PHONEMES.length}
              </span>
            </div>
            <Progress value={(stats.phonemesExplored.size / PHONEMES.length) * 100} />
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center justify-between">
              <span>Dialect Coverage</span>
              <span className="text-muted-foreground">
                {stats.dialectsStudied.size} / {DIALECTS.length}
              </span>
            </div>
            <Progress value={(stats.dialectsStudied.size / DIALECTS.length) * 100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="size-4" />
            Achievements
          </CardTitle>
          <CardDescription>
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
                a.unlocked
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/20 opacity-60"
              }`}
            >
              <div className={`text-2xl ${a.unlocked ? "" : "grayscale"}`}>{a.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </div>
              {a.unlocked && (
                <Badge variant="secondary" className="text-[10px]">
                  ✓ Unlocked
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}) {
  return (
    <div className="p-3 rounded-md border bg-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase text-muted-foreground font-semibold">{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

// Satisfy import — RotateCcw is no longer used in body but keep as available icon
void RotateCcw;
