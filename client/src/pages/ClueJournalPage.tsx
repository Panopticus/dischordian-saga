/* ═══════════════════════════════════════════════════════
   CLUE JOURNAL PAGE — Full page wrapper for the Clue Journal
   ═══════════════════════════════════════════════════════ */
import ClueJournal from "@/components/ClueJournal";

export default function ClueJournalPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <ClueJournal />
      </div>
    </div>
  );
}
