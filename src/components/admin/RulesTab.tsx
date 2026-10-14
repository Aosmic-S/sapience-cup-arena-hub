
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { FileText, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface RulesContent {
  general: string;
  freefire: string;
  codm: string;
  fcmobile: string;
  conduct: string;
  tournament: string;
}

const RulesTab = () => {
  const [rulesContent, setRulesContent] = useState<RulesContent>({
    general: '',
    freefire: '',
    codm: '',
    fcmobile: '',
    conduct: '',
    tournament: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error loading games:', error);
        return [];
      }
      return data || [];
    }
  });

  useEffect(() => {
    loadRulesContent();
  }, []);

  const loadRulesContent = async () => {
    try {
      const { data, error } = await supabase
        .from('rules_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading rules:', error);
        toast({ 
          title: "Error Loading Rules", 
          description: "Could not load rules content.", 
          variant: "destructive" 
        });
      } else if (data) {
        setRulesContent({
          general: data.general || '',
          freefire: data.freefire || '',
          codm: data.codm || '',
          fcmobile: data.fcmobile || '',
          conduct: data.conduct || '',
          tournament: data.tournament || ''
        });
      }
    } catch (error) {
      console.error('Error loading rules:', error);
      toast({ 
        title: "Error Loading Rules", 
        description: "Could not load rules content.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRulesContent = async () => {
    try {
      const { error } = await supabase
        .from('rules_content')
        .upsert({
          id: 1,
          ...rulesContent,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({ title: "Error Saving Rules", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rules Updated", description: "Tournament rules have been saved successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save rules.", variant: "destructive" });
    }
  };

  const handleContentChange = (section: keyof RulesContent, value: string) => {
    setRulesContent(prev => ({ ...prev, [section]: value }));
  };

  const gameTabMapping: { [key: string]: keyof RulesContent } = {
    'free-fire': 'freefire',
    'codm': 'codm',
    'fc-mobile': 'fcmobile'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading rules content...</div>
      </div>
    );
  }

  return (
    <Card className="bg-secondary border-border">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Tournament Rules Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-secondary gap-1">
            <TabsTrigger value="general" className="text-xs px-2">General</TabsTrigger>
            {games.map((game) => (
              <TabsTrigger key={game.name} value={game.name} className="text-xs px-2">
                {game.display_name}
              </TabsTrigger>
            ))}
            <TabsTrigger value="conduct" className="text-xs px-2">Conduct</TabsTrigger>
            <TabsTrigger value="tournament" className="text-xs px-2">Format</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <div className="space-y-4">
              <Label className="text-muted-foreground">General Rules</Label>
              <Textarea
                value={rulesContent.general}
                onChange={(e) => handleContentChange('general', e.target.value)}
                placeholder="Enter general tournament rules..."
                className="bg-secondary border-border text-foreground min-h-[300px]"
              />
            </div>
          </TabsContent>

          {games.map((game) => {
            const ruleKey = gameTabMapping[game.name] || 'general';
            return (
              <TabsContent key={game.name} value={game.name} className="mt-4">
                <div className="space-y-4">
                  <Label className="text-muted-foreground">{game.display_name} Rules</Label>
                  <Textarea
                    value={rulesContent[ruleKey] || ''}
                    onChange={(e) => handleContentChange(ruleKey, e.target.value)}
                    placeholder={`Enter ${game.display_name} specific rules...`}
                    className="bg-secondary border-border text-foreground min-h-[300px]"
                  />
                </div>
              </TabsContent>
            );
          })}

          <TabsContent value="conduct" className="mt-4">
            <div className="space-y-4">
              <Label className="text-muted-foreground">Code of Conduct & Disqualification</Label>
              <Textarea
                value={rulesContent.conduct}
                onChange={(e) => handleContentChange('conduct', e.target.value)}
                placeholder="Enter conduct rules and disqualification policies..."
                className="bg-secondary border-border text-foreground min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="tournament" className="mt-4">
            <div className="space-y-4">
              <Label className="text-muted-foreground">Tournament Format & Prize Structure</Label>
              <Textarea
                value={rulesContent.tournament}
                onChange={(e) => handleContentChange('tournament', e.target.value)}
                placeholder="Enter tournament format and prize information..."
                className="bg-secondary border-border text-foreground min-h-[300px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={saveRulesContent} className="w-full bg-success hover:bg-success">
            <Save className="w-4 h-4 mr-2" />
            Save All Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulesTab;
