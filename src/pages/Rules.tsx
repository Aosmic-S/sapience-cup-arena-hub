
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Rules = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const { data: rulesContent, isLoading } = useQuery({
    queryKey: ['rulesContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rules_content')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading rules:', error);
        return null;
      }
      return data;
    }
  });

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

  const defaultRules = {
    general: 'General tournament rules will be displayed here.',
    freefire: 'Free Fire specific rules will be displayed here.',
    codm: 'Call of Duty Mobile specific rules will be displayed here.',
    fcmobile: 'FC Mobile specific rules will be displayed here.',
    conduct: 'Code of conduct and disqualification policies will be displayed here.',
    tournament: 'Tournament format and prize structure will be displayed here.'
  };

  const currentRules = rulesContent || defaultRules;

  const gameTabMapping: { [key: string]: string } = {
    'free-fire': 'freefire',
    'codm': 'codm',
    'fc-mobile': 'fcmobile'
  };

  const getGameRules = (gameName: string) => {
    const ruleKey = gameTabMapping[gameName] || gameName;
    return currentRules[ruleKey as keyof typeof currentRules] || `${gameName} specific rules will be displayed here.`;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground text-center flex items-center justify-center">
              <FileText className="w-8 h-8 mr-3" />
              Tournament Rules & Regulations
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-secondary gap-1">
                  <TabsTrigger value="general" className="text-xs px-1 md:px-2">General</TabsTrigger>
                  {games.map((game) => (
                    <TabsTrigger key={game.name} value={game.name} className="text-xs px-1 md:px-2">
                      {game.display_name}
                    </TabsTrigger>
                  ))}
                  <TabsTrigger value="conduct" className="text-xs px-1 md:px-2">Conduct</TabsTrigger>
                  <TabsTrigger value="tournament" className="text-xs px-1 md:px-2">Format</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4">
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {currentRules.general}
                  </div>
                </TabsContent>

                {games.map((game) => (
                  <TabsContent key={game.name} value={game.name} className="mt-4">
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {getGameRules(game.name)}
                    </div>
                  </TabsContent>
                ))}

                <TabsContent value="conduct" className="mt-4">
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {currentRules.conduct}
                  </div>
                </TabsContent>

                <TabsContent value="tournament" className="mt-4">
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {currentRules.tournament}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rules;
