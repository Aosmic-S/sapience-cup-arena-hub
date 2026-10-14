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

// Standard BGMI Krafton placement points
const BGMI_PLACEMENT_POINTS: Record<number, number> = {
  1: 10,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
};

const LeaderboardTab = () => {
  const [matchData, setMatchData] = useState({
    teamNumber: '',
    game: 'bgmi',
    matchDate: new Date().toISOString().split('T')[0],
    pointsEarned: '',
    result: 'win' as 'win' | 'loss' | 'draw',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: teams = [] } = useQuery({
    queryKey: ['registrationTeams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('team_number, team_name, full_name, game')
        .order('team_number');

      if (error) {
        console.error('Error fetching teams:', error);
        return [];
      }
      return data || [];
    },
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

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }
      return data || [];
    },
  });

  const { data: matchResults = [] } = useQuery({
    queryKey: ['matchResults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching match results:', error);
        return [];
      }
      return data || [];
    },
  });

  const handleSubmitMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!matchData.teamNumber || !matchData.game) {
      toast({
        title: 'Missing Fields',
        description: 'Please select both a team and a game.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('match_results').insert({
        team_number: matchData.teamNumber,
        game: matchData.game,
        match_date: matchData.matchDate || new Date().toISOString().split('T')[0],
        points_earned: parseInt(matchData.pointsEarned) || 0,
        result: matchData.result,
        notes: matchData.notes || null,
      });

      if (error) {
        console.error('Error recording match:', error);
        toast({
          title: 'Error Recording Match',
          description: error.message || 'Failed to record match result',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Match Recorded',
          description: 'Match result saved and leaderboard updated.',
        });
        setMatchData({
          teamNumber: '',
          game: 'bgmi',
          matchDate: new Date().toISOString().split('T')[0],
          pointsEarned: '',
          result: 'win',
          notes: '',
        });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['matchResults'] });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Failed to record match result.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRankings = async () => {
    try {
      const { error } = await supabase.rpc('update_leaderboard_rankings');

      if (error) {
        console.error('Error updating rankings:', error);
        toast({
          title: 'Error Updating Rankings',
          description: error.message || 'Failed to update rankings',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Rankings Updated',
          description: 'All leaderboard rankings have been recalculated.',
        });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rankings.',
        variant: 'destructive',
      });
    }
  };

  const deleteMatchResult = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this match result?')) {
      return;
    }

    try {
      const { error } = await supabase.from('match_results').delete().eq('id', id);

      if (error) {
        console.error('Error deleting match:', error);
        toast({
          title: 'Error Deleting Match',
          description: error.message || 'Failed to delete match',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Match Deleted',
          description: 'Match result has been removed.',
        });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['matchResults'] });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete match result.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Match Result */}
      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Record Match Result & Scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Team *</Label>
              <Select
                value={matchData.teamNumber}
                onValueChange={(value) => setMatchData({ ...matchData, teamNumber: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {teams.map((team) => (
                    <SelectItem key={team.team_number} value={team.team_number || ''}>
                      {team.team_number} - {team.team_name || team.full_name} ({team.game})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Game *</Label>
              <Select
                value={matchData.game}
                onValueChange={(value) => setMatchData({ ...matchData, game: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select Game" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="bgmi">BGMI (Battlegrounds Mobile India)</SelectItem>
                  <SelectItem value="fc-mobile">EA SPORTS FC™ Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Match Date *</Label>
              <Input
                type="date"
                value={matchData.matchDate}
                onChange={(e) => setMatchData({ ...matchData, matchDate: e.target.value })}
                className="bg-secondary border-border text-foreground"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Result *</Label>
              <Select
                value={matchData.result}
                onValueChange={(value: 'win' | 'loss' | 'draw') => setMatchData({ ...matchData, result: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  <SelectItem value="win">Win / #1 Place</SelectItem>
                  <SelectItem value="loss">Loss / Eliminated</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Points Earned Input with Quick Presets */}
            <div className="space-y-3 md:col-span-2 rounded border border-border p-3.5 bg-background/50">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-semibold">Total Points Earned *</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setMatchData((prev) => ({ ...prev, pointsEarned: '0', notes: '' }))}
                >
                  Reset Points
                </Button>
              </div>

              <Input
                type="number"
                value={matchData.pointsEarned}
                onChange={(e) => setMatchData({ ...matchData, pointsEarned: e.target.value })}
                className="bg-secondary border-border text-foreground font-mono text-base font-bold"
                placeholder="0"
                required
                min="0"
                disabled={isSubmitting}
              />

              {/* Placement Quick Add */}
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground block mb-1.5">
                  Quick Placement Points (Krafton standard):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(BGMI_PLACEMENT_POINTS).map(([place, pts]) => (
                    <Button
                      key={place}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs font-mono border-border hover:border-primary/50"
                      onClick={() =>
                        setMatchData((prev) => ({
                          ...prev,
                          pointsEarned: String((parseInt(prev.pointsEarned) || 0) + pts),
                          notes: (prev.notes ? prev.notes + ' ' : '') + `#${place}(+${pts}p)`,
                        }))
                      }
                    >
                      #{place} (+{pts}p)
                    </Button>
                  ))}
                </div>
              </div>

              {/* Elimination Kills Quick Add */}
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground block mb-1.5">
                  Quick Kill Points (+1 pt per elimination):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 5, 10].map((k) => (
                    <Button
                      key={k}
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 font-mono text-xs"
                      onClick={() =>
                        setMatchData((prev) => ({
                          ...prev,
                          pointsEarned: String((parseInt(prev.pointsEarned) || 0) + k),
                          notes: (prev.notes ? prev.notes + ' ' : '') + `+${k} kills`,
                        }))
                      }
                    >
                      +{k} Kills
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-muted-foreground">Match Notes / Breakdown (Optional)</Label>
              <Input
                value={matchData.notes}
                onChange={(e) => setMatchData({ ...matchData, notes: e.target.value })}
                className="bg-secondary border-border text-foreground text-sm font-mono"
                placeholder="e.g. #1(+10p) +5 kills"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Recording...' : 'Record Match Result'}
              </Button>

              <Button
                type="button"
                onClick={handleUpdateRankings}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                disabled={isSubmitting}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recalculate Rankings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Leaderboard */}
      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Current Leaderboard ({leaderboard.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leaderboard entries yet. Add match results to populate the leaderboard.
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-primary text-black font-bold">
                      #{team.rank_position}
                    </Badge>
                    <div>
                      <p className="text-foreground font-medium">
                        {team.registrations?.team_name || team.registrations?.full_name || team.team_number}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {team.team_number} • {team.game.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-bold">{team.points} pts</p>
                    <p className="text-muted-foreground text-sm">
                      {team.wins}W - {team.losses}L
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Match Results */}
      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Recent Match Results ({matchResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {matchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No match results recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {matchResults.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-foreground font-medium">{match.team_number}</p>
                    <p className="text-muted-foreground text-sm">
                      {match.game.toUpperCase()} • {new Date(match.match_date).toLocaleDateString()}
                    </p>
                    {match.notes && <p className="text-muted-foreground text-xs mt-1 font-mono">{match.notes}</p>}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={match.result === 'win' ? 'default' : match.result === 'loss' ? 'destructive' : 'secondary'}
                      className={
                        match.result === 'win' ? 'bg-primary text-black' : match.result === 'loss' ? 'bg-destructive' : 'bg-warning'
                      }
                    >
                      {match.result?.toUpperCase()}
                    </Badge>
                    <span className="text-foreground font-mono font-bold">+{match.points_earned} pts</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteMatchResult(match.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardTab;
