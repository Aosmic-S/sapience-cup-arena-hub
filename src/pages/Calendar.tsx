
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, GamepadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface MatchDay {
  id: string;
  date: Date | string;
  game: string;
  time: string;
  description: string;
  created_at: string;
}

const Calendar = () => {
  const [matchDays, setMatchDays] = useState<MatchDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDays = async () => {
      const { data, error } = await supabase
        .from('match_days')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Error fetching match days:", error);
      } else if (data) {
        setMatchDays(data);
      }
      setLoading(false);
    };

    fetchMatchDays();
    
    const channel = supabase
      .channel('match-days-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'match_days' },
        () => fetchMatchDays()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getGameIcon = (game: string) => {
    return <GamepadIcon className="w-5 h-5" />;
  };

  const getGameColor = (game: string) => {
    switch (game) {
      case 'free-fire':
        return 'bg-gradient-to-r from-red-600 to-orange-600';
      case 'codm':
        return 'bg-gradient-to-r from-blue-600 to-purple-600';
      case 'fc-mobile':
        return 'bg-gradient-to-r from-green-600 to-teal-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-slate-600';
    }
  };

  const formatGameName = (game: string) => {
    switch (game) {
      case 'free-fire':
        return 'Free Fire';
      case 'codm':
        return 'Call of Duty: Mobile';
      case 'fc-mobile':
        return 'FC Mobile';
      default:
        return game.replace('-', ' ').toUpperCase();
    }
  };

  const sortedMatches = matchDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center">
              <CalendarIcon className="w-8 h-8 mr-3" />
              Tournament Schedule
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
              </div>
            ) : sortedMatches.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">No matches scheduled yet</p>
                <p className="text-gray-500 mt-2">Check back later for upcoming tournament dates</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedMatches.map((match) => (
                  <Card key={match.id} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors">
                    <CardContent className="p-6">
                      <div className={`${getGameColor(match.game)} rounded-lg p-4 mb-4`}>
                        <div className="flex items-center justify-between">
                          {getGameIcon(match.game)}
                          <h3 className="text-white font-bold text-lg">
                            {formatGameName(match.game)}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-300">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          <span>{format(new Date(match.date), "EEEE, MMMM d, yyyy")}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{match.time}</span>
                        </div>
                        
                        {match.description && (
                          <div className="mt-3 p-2 bg-slate-600/50 rounded text-gray-300 text-sm">
                            {match.description}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
