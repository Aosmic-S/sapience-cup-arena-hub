import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowUpRight, 
  Trophy, 
  Medal, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Users, 
  Flame, 
  Sparkles, 
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

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
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-black">
      <AnnouncementBanner />

      {/* Hero Section - Krafton Esports Style Spotlight */}
      <section className="relative border-b border-border overflow-hidden bg-gradient-to-b from-card/40 via-background to-background">
        {/* Subtle Esports Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

        <div className="container relative mx-auto px-4 py-16 md:py-28">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/50 bg-warning/10 px-3.5 py-1 mb-6 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            <span className="font-mono-tag text-[11px] md:text-xs uppercase tracking-widest text-warning font-semibold">
              Tournament Under School Approval • Open to Class 9+
            </span>
          </div>

          {/* Main Title & Organization Header */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-2 font-mono-tag text-xs md:text-sm text-primary uppercase tracking-widest font-bold">
              <Flame className="w-4 h-4 text-primary animate-bounce" />
              Sapience eSports Championship Series
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold uppercase leading-[0.92] tracking-tight">
              Sapience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary">
                Cup 2026
              </span>
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground font-mono-tag">
              <span className="text-foreground font-bold">THE SAPIENCE SCHOOL, VIKASNAGAR</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-primary font-semibold">2-GAME MOBILE EDITION</span>
              <span className="hidden sm:inline">•</span>
              <span>PURE MOBILE ONLY</span>
            </div>

            <p className="mt-6 max-w-2xl text-muted-foreground text-sm md:text-base leading-relaxed">
              The premier open mobile gaming championship organized by <strong className="text-foreground">Sapience eSports</strong> in collaboration with STEM Club faculty. Featuring Battlegrounds Mobile India and EA SPORTS FC™ Mobile. Open to all enrolled students in Class 9 and above.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register">
                <Button size="lg" className="font-display uppercase tracking-wider text-xs md:text-sm h-11 px-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  Register Squad / Solo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/brackets">
                <Button size="lg" variant="outline" className="font-display uppercase tracking-wider text-xs md:text-sm h-11 px-5 border-border hover:border-primary/50">
                  Live Brackets <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/rules">
                <Button size="lg" variant="ghost" className="font-display uppercase tracking-wider text-xs md:text-sm h-11 px-4 text-muted-foreground hover:text-foreground">
                  Official Rulebook
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Live Metrics Strip */}
      <section className="border-b border-border bg-card/20">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { label: 'Registered Teams', value: registrationCount, note: 'Slots filling' },
            { label: 'Featured Titles', value: '2 Games', note: 'BGMI & FC Mobile' },
            { label: 'Platform Policy', value: 'Mobile Only', note: 'Emulators Banned' },
            { label: 'Eligibility', value: 'Class 9+', note: 'Open Tournament' },
          ].map((stat, i) => (
            <div key={i} className="py-6 px-4 md:px-6">
              <div className="font-mono-tag text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-1 font-display text-xl md:text-3xl font-extrabold text-foreground">
                {stat.value}
              </div>
              <div className="mt-0.5 font-mono-tag text-[10px] text-primary">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tournaments Section (Krafton Style Tournament Cards) */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="font-mono-tag text-xs uppercase tracking-widest text-primary font-bold">
              OFFICIAL CHAMPIONSHIPS
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase mt-1">
              Active Tournament Titles
            </h2>
          </div>
          <span className="font-mono-tag text-xs text-muted-foreground">
            Strict Mobile Tournament Standards Enforced
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: BGMI */}
          <div className="group relative rounded-lg border border-border bg-card p-6 md:p-8 hover:border-primary/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono-tag text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                TITLE 01 • SQUAD BATTLE
              </span>
              <span className="font-mono-tag text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" /> 32 Teams Cap (4+1 Roster)
              </span>
            </div>

            <h3 className="mt-6 text-2xl md:text-3xl font-display font-black uppercase text-foreground group-hover:text-primary transition-colors">
              Battlegrounds Mobile India (BGMI)
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Custom Room lobbies hosted under official student and faculty referees. Smartphone and tablet gyroscope allowed; triggers and emulators strictly prohibited.
            </p>

            <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-3 gap-2 font-mono-tag text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">FORMAT</span>
                <span className="font-bold text-foreground">Custom Rooms</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">ROSTER</span>
                <span className="font-bold text-foreground">4 Starters + 1 Sub</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">ROOM DETAILS</span>
                <span className="font-bold text-primary">10m Prior via Dash</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Link to="/register" className="flex-1">
                <Button className="w-full font-display uppercase tracking-wider text-xs">
                  Register BGMI Squad
                </Button>
              </Link>
              <Link to="/rules">
                <Button variant="outline" className="font-display uppercase tracking-wider text-xs">
                  BGMI Rules
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: FC Mobile */}
          <div className="group relative rounded-lg border border-border bg-card p-6 md:p-8 hover:border-primary/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono-tag text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                TITLE 02 • 1v1 KNOCKOUT
              </span>
              <span className="font-mono-tag text-xs text-muted-foreground flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-primary" /> 32-Player Knockout Bracket
              </span>
            </div>

            <h3 className="mt-6 text-2xl md:text-3xl font-display font-black uppercase text-foreground group-hover:text-primary transition-colors">
              EA SPORTS FC™ Mobile
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Head-to-head 1v1 knockout elimination matches. Bring your registered in-game squad and UID. Single elimination tournament bracket with digital match passes.
            </p>

            <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-3 gap-2 font-mono-tag text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">FORMAT</span>
                <span className="font-bold text-foreground">1v1 Knockout</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">MATCH MODE</span>
                <span className="font-bold text-foreground">Head-to-Head (H2H)</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">PAIRINGS</span>
                <span className="font-bold text-primary">Auto Bracket Seeding</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Link to="/register" className="flex-1">
                <Button className="w-full font-display uppercase tracking-wider text-xs">
                  Register 1v1 Pass
                </Button>
              </Link>
              <Link to="/rules">
                <Button variant="outline" className="font-display uppercase tracking-wider text-xs">
                  FC Rules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Official Prize Distribution */}
      <section className="border-y border-border bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-8">
            <div className="font-mono-tag text-xs uppercase tracking-widest text-primary font-bold">
              AWARDS & RECOGNITION
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold uppercase mt-1">
              Prizes Per Title
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Awarded exclusively to first and second place finishers in both BGMI and EA SPORTS FC™ Mobile.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-primary/50 bg-background/80 p-6 md:p-8 flex items-start gap-4">
              <div className="p-3 rounded bg-primary/10 border border-primary/30 text-primary shrink-0">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="font-mono-tag text-xs uppercase tracking-wider text-primary font-bold">
                  CHAMPIONS • 1ST PLACE
                </div>
                <div className="mt-1 text-2xl font-display font-extrabold">
                  Official Trophy + Cash Prize + Certificate
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Presented at the official school assembly ceremony by faculty patrons.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/80 p-6 md:p-8 flex items-start gap-4">
              <div className="p-3 rounded bg-card border border-border text-muted-foreground shrink-0">
                <Medal className="w-8 h-8" />
              </div>
              <div>
                <div className="font-mono-tag text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  RUNNERS-UP • 2ND PLACE
                </div>
                <div className="mt-1 text-2xl font-display font-extrabold">
                  Cash Prize + Official Certificate
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Recognized for tournament podium excellence across all tournament stages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fair Play & Tournament Standards (Krafton India Esports Pillar Model) */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="font-mono-tag text-xs uppercase tracking-widest text-primary font-bold">
          COMPETITIVE INTEGRITY
        </div>
        <h2 className="text-2xl md:text-4xl font-display font-extrabold uppercase mt-1 mb-8">
          Tournament Regulations
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Smartphone className="w-5 h-5 text-primary" />,
              title: 'Mobile Only',
              desc: 'PC emulators (Bluestacks, LDPlayer), triggers, and mouse keyboards strictly banned with instant disqualification.',
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-primary" />,
              title: 'Academic Eligibility',
              desc: 'Open to enrolled students Class 9 and above with satisfactory attendance and zero disciplinary holds.',
            },
            {
              icon: <Clock className="w-5 h-5 text-primary" />,
              title: '15m Check-in',
              desc: 'Teams and solo players must check in 15 minutes prior. 10-minute maximum grace period before forfeit.',
            },
            {
              icon: <Lock className="w-5 h-5 text-primary" />,
              title: 'Referee Discretion',
              desc: 'Official faculty and STEM Club student referees oversee custom rooms. All referee decisions are final.',
            },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded border border-border bg-card/40">
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-display font-bold uppercase text-sm">{item.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Official Footer with Aosmic Studio Credit */}
      <footer className="border-t border-border mt-auto bg-card/40">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-foreground">The Sapience School, Vikasnagar</span>
            <span className="hidden sm:inline">•</span>
            <span>thesapienceschool@gmail.com</span>
          </div>
          <div>
            © 2026{' '}
            <a
              href="https://aosmicstudio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground hover:text-primary transition-colors font-medium"
            >
              Aosmic Studio
            </a>
            . All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
