
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Users, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const TeamLogin = () => {
  const [teamNumber, setTeamNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify team credentials
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('team_number', teamNumber)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Credentials",
          description: "Team number not found.",
          variant: "destructive",
        });
        return;
      }

      // Check password (in production, this should be hashed)
      if (data.password_hash !== password) {
        toast({
          title: "Invalid Credentials",
          description: "Incorrect password.",
          variant: "destructive",
        });
        return;
      }

      // Store team session
      sessionStorage.setItem('teamSession', JSON.stringify({
        teamNumber: data.team_number,
        teamName: data.team_name || data.full_name,
        game: data.game,
        entryType: data.entry_type
      }));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.team_name || data.full_name}!`,
      });

      navigate('/team-dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground text-center flex items-center justify-center">
              <Users className="w-6 h-6 mr-2" />
              Team Login
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamNumber" className="text-muted-foreground">Team Number</Label>
                <Input
                  id="teamNumber"
                  type="text"
                  placeholder="e.g., TEAM1001"
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have a team number? Register first to get your credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamLogin;
