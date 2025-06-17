
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Trophy, Plus, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const LeaderboardTab = () => {
  const [matchData, setMatchData] = useState({
    teamNumber: '',
    game: '',
    matchDate: '',
    pointsEarned: '',
    result: 'win' as 'win' | 'loss' | 'draw',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: teams = [] } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('team_number, team_name, full_name, game')
        .order('team_number');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          registrations!inner(team_name, full_name)
        `)
        .order('game')
        .order('rank_position');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: matchResults = [] } = useQuery({
    queryKey: ['matchResults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmitMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('match_results')
        .insert({
          team_number: matchData.teamNumber,
          game: matchData.game,
          match_date: matchData.matchDate,
          points_earned: parseInt(matchData.pointsEarned),
          result: matchData.result,
          notes: matchData.notes || null
        });

      if (error) {
        toast({
          title: "Error Recording Match",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Match Recorded",
          description: "Match result has been added and leaderboard updated.",
        });
        setMatchData({
          teamNumber: '',
          game: '',
          matchDate: '',
          pointsEarned: '',
          result: 'win',
          notes: ''
        });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['matchResults'] });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record match result.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRankings = async () => {
    try {
      const { error } = await supabase.rpc('update_leaderboard_rankings');
      
      if (error) {
        toast({
          title: "Error Updating Rankings",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Rankings Updated",
          description: "All leaderboard rankings have been recalculated.",
        });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rankings.",
        variant: "destructive",
      });
    }
  };

  const deleteMatchResult = async (id: string) => {
    const { error } = await supabase
      .from('match_results')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error Deleting Match",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Match Deleted",
        description: "Match result has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['matchResults'] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Match Result */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Record Match Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Team</Label>
              <Select value={matchData.teamNumber} onValueChange={(value) => setMatchData({...matchData, teamNumber: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {teams.map((team) => (
                    <SelectItem key={team.team_number} value={team.team_number || ''}>
                      {team.team_number} - {team.team_name || team.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Game</Label>
              <Select value={matchData.game} onValueChange={(value) => setMatchData({...matchData, game: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select Game" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="free-fire">Free Fire</SelectItem>
                  <SelectItem value="codm">CODM</SelectItem>
                  <SelectItem value="fc-mobile">FC Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Match Date</Label>
              <Input
                type="date"
                value={matchData.matchDate}
                onChange={(e) => setMatchData({...matchData, matchDate: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Points Earned</Label>
              <Input
                type="number"
                value={matchData.pointsEarned}
                onChange={(e) => setMatchData({...matchData, pointsEarned: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="e.g., 10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Result</Label>
              <Select value={matchData.result} onValueChange={(value: 'win' | 'loss' | 'draw') => setMatchData({...matchData, result: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Notes (Optional)</Label>
              <Input
                value={matchData.notes}
                onChange={(e) => setMatchData({...matchData, notes: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="Match notes..."
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Recording...' : 'Record Match'}
              </Button>
              
              <Button type="button" onClick={handleUpdateRankings} variant="outline" className="border-purple-500 text-purple-400">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Rankings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Leaderboard */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Current Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    #{team.rank_position}
                  </Badge>
                  <div>
                    <p className="text-white font-medium">
                      {team.registrations?.team_name || team.registrations?.full_name}
                    </p>
                    <p className="text-gray-400 text-sm">{team.team_number} • {team.game.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{team.points} pts</p>
                  <p className="text-gray-400 text-sm">{team.wins}W-{team.losses}L</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Match Results */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Match Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {matchResults.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{match.team_number}</p>
                  <p className="text-gray-400 text-sm">{match.game.toUpperCase()} • {new Date(match.match_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={match.result === 'win' ? 'default' : match.result === 'loss' ? 'destructive' : 'secondary'}
                    className={
                      match.result === 'win' ? 'bg-green-600' : 
                      match.result === 'loss' ? 'bg-red-600' : 'bg-yellow-600'
                    }
                  >
                    {match.result?.toUpperCase()}
                  </Badge>
                  <span className="text-white">+{match.points_earned} pts</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMatchResult(match.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardTab;
