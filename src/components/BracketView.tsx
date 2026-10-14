export interface BracketMatch {
  id: string;
  bracket_id: string;
  round: number;
  position: number;
  team_a: string | null;
  team_b: string | null;
  winner: string | null;
}

const BracketView = ({ matches, onPick }: { matches: BracketMatch[]; onPick?: (m: BracketMatch, team: string) => void }) => {
  const rounds = [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b);
  const total = rounds.length;
  const label = (r: number) => (r === total ? 'Final' : r === total - 1 ? 'Semis' : r === total - 2 ? 'Quarters' : `Round ${r}`);

  const Slot = ({ m, team }: { m: BracketMatch; team: string | null }) => {
    const win = !!team && m.winner === team;
    const lose = !!m.winner && !!team && m.winner !== team;
    return (
      <button
        disabled={!onPick || !team || team === 'BYE'}
        onClick={() => team && onPick?.(m, team)}
        className={`w-full text-left px-2 py-1.5 text-xs truncate ${win ? 'text-primary font-semibold' : lose ? 'text-muted-foreground line-through' : 'text-foreground'} ${onPick && team ? 'hover:bg-accent' : ''}`}
      >
        {team || <span className="text-muted-foreground">TBD</span>}
      </button>
    );
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {rounds.map((r) => (
          <div key={r} className="w-48 flex flex-col">
            <div className="font-mono-tag text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{label(r)}</div>
            <div className="flex flex-col justify-around flex-1 gap-2">
              {matches.filter((m) => m.round === r).sort((a, b) => a.position - b.position).map((m) => (
                <div key={m.id} className="rounded border border-border bg-card divide-y divide-border">
                  <Slot m={m} team={m.team_a} />
                  <Slot m={m} team={m.team_b} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketView;
