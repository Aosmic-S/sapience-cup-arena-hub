import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BracketView, { BracketMatch } from '@/components/BracketView';

const Brackets = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: brackets = [] } = useQuery({
    queryKey: ['publicBrackets'],
    queryFn: async () => (await supabase.from('brackets').select('*').order('created_at')).data || [],
  });
  const current = selected ?? brackets[0]?.id ?? null;
  const { data: matches = [] } = useQuery({
    queryKey: ['publicBracketMatches', current],
    enabled: !!current,
    refetchInterval: 60000,
    queryFn: async () => (await supabase.from('bracket_matches').select('*').eq('bracket_id', current!)).data || [],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-14">
        <h1 className="text-4xl md:text-6xl font-bold uppercase">Brackets</h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {brackets.map((b) => (
            <button key={b.id} onClick={() => setSelected(b.id)}
              className={`rounded border px-3 py-1.5 text-sm ${current === b.id ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {b.name}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {brackets.length === 0 ? (
            <p className="text-muted-foreground">Brackets will appear here once the tournament is approved.</p>
          ) : (
            <BracketView matches={matches as BracketMatch[]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Brackets;
