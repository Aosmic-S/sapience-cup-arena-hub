import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowUpRight, Trophy, Medal, GitBranch } from 'lucide-react';

const Index = () => {
  const { data: games = [] } = useQuery({
    queryKey: ['homeActiveGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('id, display_name, description, bracket_size')
        .eq('is_active', true)
        .order('created_at');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: registrationCount = 0 } = useQuery({
    queryKey: ['homeRegistrationCount'],
    queryFn: async () => {
      const { count, error } = await supabase.from('registrations').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />

      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/40 px-3 py-1 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            <span className="font-mono-tag text-xs uppercase tracking-widest text-warning">Tournament under approval</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold uppercase leading-[0.9] tracking-tight">
            Sapience<br />
            <span className="text-primary">eSports</span> Cup
          </h1>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-mono-tag text-2xl md:text-3xl text-muted-foreground">2025</span>
            <span className="h-px flex-1 max-w-[120px] bg-border" />
            <span className="text-sm text-muted-foreground">The Sapience School, Vikasnagar</span>
          </div>
          <p className="mt-8 max-w-xl text-muted-foreground md:text-lg">
            The inter-class mobile gaming championship. Open to Class 9 and above. Full schedule will be announced once the school approves the tournament.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button disabled size="lg" className="uppercase tracking-wider font-display">Registration soon</Button>
            <Link to="/brackets">
              <Button size="lg" variant="outline" className="uppercase tracking-wider font-display">
                View brackets <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/rules">
              <Button size="lg" variant="ghost" className="uppercase tracking-wider font-display text-muted-foreground">Rules</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 grid grid-cols-3 divide-x divide-border">
          {[
            { k: 'Registered', v: registrationCount },
            { k: 'Games', v: games.length },
            { k: 'Eligibility', v: 'Class 9+' },
          ].map((s) => (
            <div key={s.k} className="py-8 px-4">
              <div className="font-mono-tag text-[11px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
              <div className="mt-2 font-display text-2xl md:text-4xl font-bold">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Games */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold uppercase">Titles</h2>
          <span className="font-mono-tag text-xs text-muted-foreground">/ {String(games.length).padStart(2, '0')}</span>
        </div>
        <div className="grid gap-px bg-border border border-border md:grid-cols-3">
          {games.map((g, i) => (
            <div key={g.id} className="bg-background p-8 group hover:bg-card transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono-tag text-xs text-muted-foreground">0{i + 1}</span>
                <span className="font-mono-tag text-[11px] uppercase text-primary flex items-center gap-1">
                  <GitBranch className="w-3 h-3" /> {g.bracket_size} slots
                </span>
              </div>
              <h3 className="mt-10 text-2xl font-bold uppercase group-hover:text-primary transition-colors">{g.display_name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prizes */}
      <section className="container mx-auto px-4 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-10">Prizes <span className="text-muted-foreground text-lg font-normal normal-case">per game</span></h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-primary/50 bg-card p-8">
            <Trophy className="w-6 h-6 text-primary" />
            <div className="mt-6 font-mono-tag text-xs uppercase text-muted-foreground">1st place</div>
            <div className="mt-1 text-xl font-display font-bold">Trophy + Cash + Certificate</div>
          </div>
          <div className="rounded-md border border-border bg-card p-8">
            <Medal className="w-6 h-6 text-muted-foreground" />
            <div className="mt-6 font-mono-tag text-xs uppercase text-muted-foreground">2nd place</div>
            <div className="mt-1 text-xl font-display font-bold">Cash + Certificate</div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-2 justify-between text-xs text-muted-foreground">
          <span>Sapience School, Vikasnagar · thesapienceschool@gmail.com</span>
          <span>
            © 2025{' '}
            <a href="https://aosmicstudio.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              Aosmic Studio
            </a>
            . All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
