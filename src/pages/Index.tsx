import { useDeviceType } from "@/hooks/useDeviceType";
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Trophy, Users, Calendar, Star, Clock, Target, Award } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  display_name: string;
  color: string;
  description: string | null;
  is_active: boolean;
}

const GameCard = ({ game }: { game: Game }) => (
  <div className={`${game.color} rounded-lg p-4 text-foreground shadow-lg`}>
    <div className="flex items-center mb-2">
      <Gamepad2 className="w-5 h-5 mr-2" />
      <h3 className="font-bold">{game.display_name}</h3>
    </div>
    <p className="text-sm opacity-90">{game.description}</p>
  </div>
);

const MobileHome = () => {
  const { data: games = [] } = useQuery({
    queryKey: ['activeGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: registrationCount = 0 } = useQuery({
    queryKey: ['registrationCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="min-h-screen bg-background px-2 py-4 relative">
      <AnnouncementBanner />

      <div className="mb-4 flex flex-col items-center">
        <img
          src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
          className="w-20 h-20 rounded-full mb-2"
          alt="Logo"
        />
        <h1 className="text-3xl font-bold text-primary-foreground mb-1 text-center bg-primary bg-clip-text text-transparent">
          Sapience eSports Cup 2025
        </h1>
        <p className="text-primary text-[15px] text-center">Sapience School, Vikasnagar</p>
      </div>
      
      <div className="mb-4 text-center">
        <p className="text-foreground text-base mb-2">
          🏆 The Ultimate Inter-Class Gaming Championship! 🏆
        </p>
        <p className="text-muted-foreground text-sm mb-3">
          Battle across multiple games, represent your class, and claim victory in the most exciting esports tournament of the year!
        </p>
        <div className="bg-warning/10 rounded-lg p-3 mb-4">
          <p className="text-warning text-sm font-semibold">
            📋 Tournament Under School Approval - Details Coming Soon! 📋
          </p>
        </div>
      </div>

      <div className="mb-4 text-center">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-primary font-semibold text-sm">Registered</div>
            <div className="text-foreground text-lg font-bold">{registrationCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-warning" />
            <div className="text-warning font-semibold text-sm">Eligible</div>
            <div className="text-foreground text-lg font-bold">Class 9+</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3 text-center">Featured Games</h2>
        <div className="space-y-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      <div className="mb-4 bg-card rounded-lg p-4">
        <h3 className="text-foreground font-semibold mb-2 flex items-center">
          <Star className="w-4 h-4 mr-2 text-warning" />
          Prize Structure
        </h3>
        <ul className="text-muted-foreground text-sm space-y-1">
          <li>• 1st Place: Trophy + Cash Prize + Certificate</li>
          <li>• 2nd Place: Cash Prize + Certificate</li>
          <li>• Professional tournament management</li>
          <li>• Live scoring and leaderboards</li>
        </ul>
      </div>

      <div className="mb-4 flex justify-center">
        <Button disabled className="bg-secondary text-muted-foreground font-bold px-8 py-2 rounded-full text-lg cursor-not-allowed">
          Tournament Under Approval
        </Button>
      </div>

      <div className="mb-10 flex justify-center space-x-3">
        <Link to="/rules">
          <Button variant="outline" className="font-semibold border-primary text-primary px-6 py-2 rounded-full text-sm">
            View Rules
          </Button>
        </Link>
        <Link to="/calendar">
          <Button variant="outline" className="font-semibold border-success text-success px-6 py-2 rounded-full text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </Button>
        </Link>
      </div>

      <footer className="text-center text-muted-foreground pt-8 border-t border-border text-xs">
        <p>Sapience School, Vikasnagar · thesapienceschool@gmail.com</p>
        <p>Organizer: <a href="https://aosmicstudio.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Aosmic Studio</a></p>
      </footer>
    </div>
  );
};

const TabletHome = () => {
  const { data: games = [] } = useQuery({
    queryKey: ['activeGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: registrationCount = 0 } = useQuery({
    queryKey: ['registrationCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <AnnouncementBanner />
      <div className="container mx-auto py-6">
        <header className="mb-12 flex flex-col items-center">
          <img
            src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
            className="w-24 h-24 rounded-full mb-4"
            alt="Logo"
          />
          <h1 className="text-4xl font-bold text-primary-foreground bg-primary bg-clip-text text-transparent mb-3">
            Sapience eSports Cup 2025
          </h1>
          <p className="text-lg text-primary mb-2">The Sapience School, Vikasnagar</p>
          <p className="text-md text-muted-foreground max-w-2xl text-center mb-4">
            Join the ultimate inter-class gaming championship featuring the most popular mobile games!
          </p>
          <div className="bg-warning/10 rounded-lg p-4 max-w-xl">
            <p className="text-warning text-center font-semibold">
              📋 Tournament is under school management approval. Complete details will be announced soon! 📋
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-primary font-semibold text-lg">Participants</div>
              <div className="text-foreground text-2xl font-bold">{registrationCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-3 text-warning" />
              <div className="text-warning font-semibold text-lg">Eligibility</div>
              <div className="text-foreground text-2xl font-bold">Class 9+</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">Featured Games</h2>
          <div className="grid gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <Clock className="w-6 h-6 text-success mb-2" />
              <h3 className="text-foreground font-semibold mb-1">Tournament Duration</h3>
              <p className="text-muted-foreground text-sm">Multi-day championship with scheduled matches and exciting playoffs</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <Target className="w-6 h-6 text-destructive mb-2" />
              <h3 className="text-foreground font-semibold mb-1">Class Competition</h3>
              <p className="text-muted-foreground text-sm">Represent your class and compete for overall class rankings</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <Award className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-foreground font-semibold mb-1">Prize Structure</h3>
              <p className="text-muted-foreground text-sm">Trophy + cash prize for 1st, cash prize + certificate for 2nd</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <Button disabled className="bg-secondary text-muted-foreground font-bold text-lg px-7 py-3 rounded-full cursor-not-allowed">
            Tournament Under Approval
          </Button>
          <Link to="/rules">
            <Button variant="outline" className="border-primary text-primary font-semibold text-lg px-7 py-3 rounded-full">
              View Rules
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline" className="border-success text-success font-semibold text-lg px-7 py-3 rounded-full">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule
            </Button>
          </Link>
        </div>

        <footer className="text-center text-muted-foreground pt-8 border-t border-border text-sm">
          <div>The Sapience School • thesapienceschool@gmail.com</div>
          <div>Organized by <a href="https://aosmicstudio.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Aosmic Studio</a></div>
        </footer>
      </div>
    </div>
  );
};

const DesktopHome = () => {
  const { data: games = [] } = useQuery({
    queryKey: ['activeGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: registrationCount = 0 } = useQuery({
    queryKey: ['registrationCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
              className="w-32 h-32 mb-4 rounded-full"
              alt="Logo"
            />
            <h1 className="text-6xl font-extrabold text-primary-foreground mb-4 bg-primary bg-clip-text text-transparent">
              Sapience eSports Cup 2025
            </h1>
            <p className="text-2xl text-primary mb-2">The Sapience School, Vikasnagar</p>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
              Welcome to the ULTIMATE gaming championship. Fight for your class, dominate the leaderboards, and win incredible prizes!
            </p>
            <div className="bg-warning/10 rounded-lg p-6 max-w-4xl">
              <p className="text-warning text-lg font-semibold text-center">
                📋 Tournament is under school management approval. Complete tournament details and registration will be announced soon! 📋
              </p>
            </div>
          </div>
        </header>

        <div className="flex justify-center gap-12 mb-12">
          <Card className="bg-card border-border w-80">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl text-foreground font-bold mb-2">Live Participants</h3>
              <p className="text-3xl font-bold text-primary">{registrationCount}</p>
              <p className="text-muted-foreground mt-2">Students registered and ready to compete</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border w-80">
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-warning" />
              <h3 className="text-2xl text-foreground font-bold mb-2">Inter-Class Battle</h3>
              <p className="text-foreground">Dominate across all classes to win prizes & eternal fame!</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border w-80">
            <CardContent className="p-8 text-center">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="text-2xl text-foreground font-bold mb-2">Multiple Games</h3>
              <p className="text-foreground">{games.length} exciting games with professional tournaments</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Featured Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {games.map((game) => (
              <Card key={game.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <GameCard game={game} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-success" />
              <h3 className="text-foreground font-bold mb-2">Tournament Duration</h3>
              <p className="text-muted-foreground text-sm">Multi-day championship with scheduled matches and exciting playoffs</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3 text-destructive" />
              <h3 className="text-foreground font-bold mb-2">Class Competition</h3>
              <p className="text-muted-foreground text-sm">Represent your class and compete for overall class rankings and supremacy</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="text-foreground font-bold mb-2">Prize Structure</h3>
              <p className="text-muted-foreground text-sm">1st place: Trophy + cash prize + certificate, 2nd place: Cash prize + certificate</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-3 text-warning" />
              <h3 className="text-foreground font-bold mb-2">Professional Setup</h3>
              <p className="text-muted-foreground text-sm">Live scoring, real-time leaderboards, and professional tournament management</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-5 mb-12">
          <Button disabled className="bg-secondary text-muted-foreground font-bold text-xl px-12 py-5 rounded-full cursor-not-allowed">
            Tournament Under Approval
          </Button>
          <Link to="/rules">
            <Button variant="outline" className="border-primary text-primary font-semibold text-xl px-10 py-5 rounded-full">
              View Rules
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline" className="border-success text-success font-semibold text-xl px-10 py-5 rounded-full">
              <Calendar className="w-6 h-6 mr-2" />
              Schedule
            </Button>
          </Link>
        </div>

        <footer className="text-center text-muted-foreground pt-8 border-t border-border text-base">
          <div>The Sapience School, Vikasnagar · thesapienceschool@gmail.com</div>
          <div>Organizer: <a href="https://aosmicstudio.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Aosmic Studio</a></div>
        </footer>
      </div>
    </div>
  );
};

const Index = () => {
  const deviceType = useDeviceType();
  if (deviceType === "mobile") return <MobileHome />;
  if (deviceType === "tablet") return <TabletHome />;
  return <DesktopHome />;
};

export default Index;
