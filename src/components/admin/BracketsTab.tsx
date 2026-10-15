import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import BracketView, { BracketMatch } from '@/components/BracketView';

interface Props {
  games: { name: string; display_name: string; bracket_size?: number }[];
  registrations: { game: string | null; team_name: string | null; full_name: string; team_number: string }[];
}

const BracketsTab = ({ games, registrations }: Props) => {
  const qc = useQueryClient();
  const [game, setGame] = useState('');
  const [size, setSize] = useState('32');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const { data: brackets = [] } = useQuery({
    queryKey: ['adminBrackets'],
    queryFn: async () => (await supabase.from('brackets').select('*').order('created_at')).data || [],
  });
  const { data: matches = [] } = useQuery({
    queryKey: ['adminBracketMatches', selected],
    enabled: !!selected,
    queryFn: async () => {
      if (!selected) return [];
      return (await supabase.from('bracket_matches').select('*').eq('bracket_id', selected)).data || [];
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ['adminBracketMatches'] });

  const create = async () => {
    if (!game) return toast({ title: 'Pick a game', variant: 'destructive' });
    const n = Number(size);
    const { data, error } = await supabase.from('brackets')
      .insert({ game, size: n, name: name || `${game} ${n}` }).select().single();
    if (error || !data) return toast({ title: 'Could not create', description: error?.message, variant: 'destructive' });
    const P = n === 48 ? 64 : 32;
    const byes = P - n;
    const rows = [];
    for (let r = 1, c = P / 2; c >= 1; r++, c /= 2)
      for (let p = 0; p < c; p++) rows.push({ bracket_id: data.id, round: r, position: p, team_b: r === 1 && p < byes ? 'BYE' : null });
    await supabase.from('bracket_matches').insert(rows);
    qc.invalidateQueries({ queryKey: ['adminBrackets'] });
    setSelected(data.id); setName('');
    toast({ title: 'Bracket created' });
  };

  const seed = async () => {
    const b = brackets.find((x) => x.id === selected); if (!b) return;
    const teams = registrations.filter((r) => r.game === b.game).map((r) => `#${r.team_number} ${r.team_name || r.full_name}`);
    const r1 = (matches as BracketMatch[]).filter((m) => m.round === 1).sort((a, b) => a.position - b.position);
    let t = 0;
    for (const m of r1) {
      const team_a = teams[t++] ?? null;
      const team_b = m.team_b === 'BYE' ? 'BYE' : teams[t++] ?? null;
      await supabase.from('bracket_matches').update({ team_a, team_b, winner: null }).eq('id', m.id);
      if (team_b === 'BYE' && team_a) await setWinner({ ...m, team_a, team_b }, team_a, false);
    }
    refresh(); toast({ title: `Seeded ${Math.min(t, teams.length)} teams` });
  };

  const setWinner = async (m: BracketMatch, team: string, doRefresh = true) => {
    if (!team || team === 'BYE') return;
    await supabase.from('bracket_matches').update({ winner: team }).eq('id', m.id);
    const nextPos = Math.floor(m.position / 2);
    const payload = m.position % 2 === 0 ? { team_a: team } : { team_b: team };
    await supabase.from('bracket_matches').update(payload).eq('bracket_id', m.bracket_id).eq('round', m.round + 1).eq('position', nextPos);
    if (doRefresh) refresh();
  };

  const remove = async (id: string) => {
    await supabase.from('brackets').delete().eq('id', id);
    if (selected === id) setSelected(null);
    qc.invalidateQueries({ queryKey: ['adminBrackets'] });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-border bg-card p-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] items-end">
        <Select value={game} onValueChange={(v) => { setGame(v); const g = games.find((x) => x.name === v); if (g?.bracket_size) setSize(String(g.bracket_size)); }}>
          <SelectTrigger><SelectValue placeholder="Game" /></SelectTrigger>
          <SelectContent>{games.map((g) => <SelectItem key={g.name} value={g.name}>{g.display_name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="32">32 teams</SelectItem><SelectItem value="48">48 teams</SelectItem></SelectContent>
        </Select>
        <Input placeholder="Bracket name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={create}>Create bracket</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {brackets.map((b) => (
          <div key={b.id} className={`flex items-center gap-2 rounded border px-3 py-1.5 text-sm ${selected === b.id ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
            <button onClick={() => setSelected(b.id)}>{b.name} <span className="font-mono-tag text-xs">· {b.size}</span></button>
            <button onClick={() => remove(b.id)} aria-label="Delete"><Trash2 className="w-3.5 h-3.5 hover:text-destructive" /></button>
          </div>
        ))}
        {brackets.length === 0 && <p className="text-sm text-muted-foreground">No brackets yet.</p>}
      </div>

      {selected && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={seed}>Seed from registrations</Button>
            <p className="text-xs text-muted-foreground self-center">Click a team to mark it as the match winner.</p>
          </div>
          <BracketView matches={matches as BracketMatch[]} onPick={setWinner} />
        </div>
      )}
    </div>
  );
};

export default BracketsTab;
