
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, TrendingUp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TeamSession {
  teamNumber: string;
  teamName: string;
  game: string;
  entryType: string;
}

const TeamDashboard = () => {
  const [teamSession, setTeamSession] = useState<TeamSession | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('teamSession');
    if (!session) {
      navigate('/team-login');
      return;
    }
    setTeamSession(JSON.parse(session));
  }, [navigate]);

  const { data: leaderboardData } = useQuery({
    queryKey: ['teamLeaderboard', teamSession?.teamNumber, teamSession?.game],
    queryFn: async () => {
      if (!teamSession) return null;
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('team_number', teamSession.teamNumber)
        .eq('game', teamSession.game)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching leaderboard data:', error);
      }
      return data;
    },
    enabled: !!teamSession
  });

  const { data: matchHistory } = useQuery({
    queryKey: ['teamMatchHistory', teamSession?.teamNumber],
    queryFn: async () => {
      if (!teamSession) return [];
      
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .eq('team_number', teamSession.teamNumber)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching match history:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!teamSession
  });

  const handleLogout = () => {
    sessionStorage.removeItem('teamSession');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (!teamSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{teamSession.teamName}</h1>
            <p className="text-gray-400">Team {teamSession.teamNumber} • {teamSession.game.toUpperCase()}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-slate-600 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Team Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Team Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Rank:</span>
                <Badge variant="secondary" className="bg-purple-600">
                  #{leaderboardData?.rank_position || 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Points:</span>
                <span className="text-white font-semibold">{leaderboardData?.points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Matches:</span>
                <span className="text-white">{leaderboardData?.matches_played || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wins:</span>
                <span className="text-green-400">{leaderboardData?.wins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Losses:</span>
                <span className="text-red-400">{leaderboardData?.losses || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Type:</span>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {teamSession.entryType}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Game:</span>
                <span className="text-white">{teamSession.game.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-gray-300 text-sm">
                  {leaderboardData?.last_updated 
                    ? new Date(leaderboardData.last_updated).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate:</span>
                <span className="text-white">
                  {leaderboardData?.matches_played 
                    ? Math.round((leaderboardData.wins / leaderboardData.matches_played) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Points/Match:</span>
                <span className="text-white">
                  {leaderboardData?.matches_played 
                    ? Math.round(leaderboardData.points / leaderboardData.matches_played)
                    : 0
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match History */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Match History</CardTitle>
          </CardHeader>
          <CardContent>
            {matchHistory && matchHistory.length > 0 ? (
              <div className="space-y-3">
                {matchHistory.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{match.game.toUpperCase()}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(match.match_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={match.result === 'win' ? 'default' : match.result === 'loss' ? 'destructive' : 'secondary'}
                        className={
                          match.result === 'win' ? 'bg-green-600' : 
                          match.result === 'loss' ? 'bg-red-600' : 'bg-yellow-600'
                        }
                      >
                        {match.result?.toUpperCase()}
                      </Badge>
                      <p className="text-white text-sm mt-1">+{match.points_earned} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No match history available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDashboard;
