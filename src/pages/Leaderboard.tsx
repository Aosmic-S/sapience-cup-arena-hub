
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('all');

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedGame],
    queryFn: async () => {
      let query = supabase
        .from('leaderboard')
        .select(`
          *,
          registrations!inner(full_name, team_name, entry_type)
        `)
        .order('rank_position', { ascending: true });

      if (selectedGame !== 'all') {
        query = query.eq('game', selectedGame);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }
      return data || [];
    }
  });

  const { data: games } = useQuery({
    queryKey: ['leaderboardGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('name, display_name')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-warning" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-warning" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground text-sm font-bold">#{position}</span>;
    }
  };

  const getGameWiseData = () => {
    if (!leaderboardData) return {};
    
    return leaderboardData.reduce((acc, team) => {
      if (!acc[team.game]) {
        acc[team.game] = [];
      }
      acc[team.game].push(team);
      return acc;
    }, {} as Record<string, typeof leaderboardData>);
  };

  const renderLeaderboardTable = (data: typeof leaderboardData) => (
    <div className="space-y-3">
      {data?.map((team, index) => (
        <Card key={team.id} className="bg-secondary border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(team.rank_position)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {team.registrations?.team_name || team.registrations?.full_name || team.team_number}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-primary text-primary text-xs">
                      {team.team_number}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                      {team.registrations?.entry_type}
                    </Badge>
                    <span className="text-muted-foreground text-sm">{team.game.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{team.points}</div>
                <div className="text-muted-foreground text-sm">points</div>
                <div className="flex items-center justify-end space-x-4 mt-2 text-sm">
                  <span className="text-success">{team.wins}W</span>
                  <span className="text-destructive">{team.losses}L</span>
                  <span className="text-muted-foreground">{team.matches_played}M</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {(!data || data.length === 0) && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No teams in leaderboard yet</p>
          <p className="text-muted-foreground text-sm">Rankings will appear after matches are recorded</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground text-center flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-3" />
              Tournament Leaderboard
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="overall" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <TabsList className="grid w-full md:w-auto grid-cols-2 bg-secondary gap-1">
                  <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
                  <TabsTrigger value="games">Game-wise Rankings</TabsTrigger>
                </TabsList>

                <Select value={selectedGame} onValueChange={setSelectedGame}>
                  <SelectTrigger className="w-full md:w-48 bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Filter by Game" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="all">All Games</SelectItem>
                    {games?.map((game) => (
                      <SelectItem key={game.name} value={game.name}>
                        {game.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="overall" className="mt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  renderLeaderboardTable(leaderboardData)
                )}
              </TabsContent>

              <TabsContent value="games" className="mt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(getGameWiseData()).map(([game, teams]) => (
                      <div key={game}>
                        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                          <span className="bg-primary px-3 py-1 rounded-lg mr-3">
                            {game.toUpperCase()}
                          </span>
                          Leaderboard
                        </h3>
                        {renderLeaderboardTable(teams)}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
