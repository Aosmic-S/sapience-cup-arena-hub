
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{teamSession.teamName}</h1>
            <p className="text-muted-foreground">Team {teamSession.teamNumber} • {teamSession.game.toUpperCase()}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-border text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Team Stats */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Team Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Rank:</span>
                <Badge variant="secondary" className="bg-primary">
                  #{leaderboardData?.rank_position || 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points:</span>
                <span className="text-foreground font-semibold">{leaderboardData?.points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Matches:</span>
                <span className="text-foreground">{leaderboardData?.matches_played || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wins:</span>
                <span className="text-success">{leaderboardData?.wins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Losses:</span>
                <span className="text-destructive">{leaderboardData?.losses || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Type:</span>
                <Badge variant="outline" className="border-primary text-primary">
                  {teamSession.entryType}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Game:</span>
                <span className="text-foreground">{teamSession.game.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-muted-foreground text-sm">
                  {leaderboardData?.last_updated 
                    ? new Date(leaderboardData.last_updated).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="text-foreground">
                  {leaderboardData?.matches_played 
                    ? Math.round((leaderboardData.wins / leaderboardData.matches_played) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Points/Match:</span>
                <span className="text-foreground">
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Match History</CardTitle>
          </CardHeader>
          <CardContent>
            {matchHistory && matchHistory.length > 0 ? (
              <div className="space-y-3">
                {matchHistory.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">{match.game.toUpperCase()}</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(match.match_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={match.result === 'win' ? 'default' : match.result === 'loss' ? 'destructive' : 'secondary'}
                        className={
                          match.result === 'win' ? 'bg-success' : 
                          match.result === 'loss' ? 'bg-destructive' : 'bg-warning'
                        }
                      >
                        {match.result?.toUpperCase()}
                      </Badge>
                      <p className="text-foreground text-sm mt-1">+{match.points_earned} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No match history available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDashboard;
