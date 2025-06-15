
import { useDeviceType } from "@/hooks/useDeviceType";
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Trophy, Users, Calendar } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  display_name: string;
  color: string;
  description: string | null;
  is_active: boolean;
}

const GameCard = ({ game }: { game: Game }) => (
  <div className={`${game.color} rounded-lg p-4 text-white`}>
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 px-2 py-4 relative">
      <AnnouncementBanner />

      <div className="mb-4 flex flex-col items-center">
        <img
          src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
          className="w-20 h-20 rounded-full mb-2"
          alt="Logo"
        />
        <h1 className="text-3xl font-bold text-white mb-1 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Esports Cup
        </h1>
        <p className="text-purple-200 text-[15px] text-center">Sapience School, Vikasnagar</p>
      </div>
      <p className="text-gray-200 text-base mb-6 text-center">
        Inter-class gaming championship! Tap to register & lead your class to glory.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-blue-300 font-semibold text-sm">Registered</div>
            <div className="text-white text-lg font-bold">{registrationCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-yellow-300 font-semibold text-sm">Class 9+</div>
            <div className="text-white text-lg font-bold">Eligible</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3 text-center">Featured Games</h2>
        <div className="space-y-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <Link to="/register">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-2 rounded-full text-lg drop-shadow">
            Register
          </Button>
        </Link>
      </div>

      <div className="mb-10 flex justify-center space-x-3">
        <Link to="/rules">
          <Button variant="outline" className="font-semibold border-blue-400 text-blue-300 px-6 py-2 rounded-full text-sm">
            View Rules
          </Button>
        </Link>
        <Link to="/calendar">
          <Button variant="outline" className="font-semibold border-green-400 text-green-300 px-6 py-2 rounded-full text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </Button>
        </Link>
      </div>

      <footer className="text-center text-gray-400 pt-8 border-t border-slate-700 text-xs">
        <p>Sapience School, Vikasnagar · thesapienceschool@gmail.com</p>
        <p>Organizer: Hynx Studios</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <AnnouncementBanner />
      <div className="container mx-auto py-6">
        <header className="mb-12 flex flex-col items-center">
          <img
            src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
            className="w-24 h-24 rounded-full mb-4"
            alt="Logo"
          />
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Sapience Esports Cup
          </h1>
          <p className="text-lg text-purple-200 mb-2">The Sapience School, Vikasnagar</p>
          <p className="text-md text-gray-300 max-w-2xl text-center">
            Join the ultimate class tournament featuring the best mobile games!
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <div className="text-blue-300 font-semibold text-lg">Participants</div>
              <div className="text-white text-2xl font-bold">{registrationCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <div className="text-yellow-300 font-semibold text-lg">Eligibility</div>
              <div className="text-white text-2xl font-bold">Class 9+</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Featured Games</h2>
          <div className="grid gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <Link to="/register">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-7 py-3 rounded-full">
              Register Now
            </Button>
          </Link>
          <Link to="/rules">
            <Button variant="outline" className="border-blue-400 text-blue-400 font-semibold text-lg px-7 py-3 rounded-full">
              View Rules
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline" className="border-green-400 text-green-400 font-semibold text-lg px-7 py-3 rounded-full">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule
            </Button>
          </Link>
        </div>

        <footer className="text-center text-gray-400 pt-8 border-t border-slate-700 text-sm">
          <div>The Sapience School • thesapienceschool@gmail.com</div>
          <div>Organized by Hynx Studios</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnnouncementBanner />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
              className="w-32 h-32 mb-4 rounded-full"
              alt="Logo"
            />
            <h1 className="text-6xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Sapience Esports Cup 2024
            </h1>
            <p className="text-2xl text-purple-200 mb-2">The Sapience School, Vikasnagar</p>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Welcome to the ULTIMATE gaming championship. Fight for your class and win huge!
            </p>
          </div>
        </header>

        <div className="flex justify-center gap-12 mb-12">
          <Card className="bg-slate-800/40 border-slate-700 w-80">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-2xl text-white font-bold mb-2">Live Participants</h3>
              <p className="text-3xl font-bold text-blue-400">{registrationCount}</p>
              <p className="text-gray-300 mt-2">Students registered</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700 w-80">
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl text-white font-bold mb-2">Inter-Class Battle</h3>
              <p className="text-gray-200">Dominate across all classes to win prizes & fame!</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700 w-80">
            <CardContent className="p-8 text-center">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-2xl text-white font-bold mb-2">Multiple Games</h3>
              <p className="text-gray-200">{games.length} exciting games available</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Featured Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {games.map((game) => (
              <Card key={game.id} className="bg-slate-800/40 border-slate-700">
                <CardContent className="p-6">
                  <GameCard game={game} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-5 mb-12">
          <Link to="/register">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl px-12 py-5 rounded-full hover:scale-110 transition-all duration-300 shadow-lg">
              Register Now
            </Button>
          </Link>
          <Link to="/rules">
            <Button variant="outline" className="border-blue-400 text-blue-600 font-semibold text-xl px-10 py-5 rounded-full">
              View Rules
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline" className="border-green-400 text-green-600 font-semibold text-xl px-10 py-5 rounded-full">
              <Calendar className="w-6 h-6 mr-2" />
              Schedule
            </Button>
          </Link>
        </div>

        <footer className="text-center text-gray-400 pt-8 border-t border-slate-700 text-base">
          <div>The Sapience School, Vikasnagar · thesapienceschool@gmail.com</div>
          <div>Organizer: Hynx Studios</div>
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
