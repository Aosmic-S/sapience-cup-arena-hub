
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { FileText, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading rules content...</div>
      </div>
    );
  }

  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Tournament Rules Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-slate-600 gap-1">
            <TabsTrigger value="general" className="text-xs px-2">General</TabsTrigger>
            <TabsTrigger value="freefire" className="text-xs px-2">Fire</TabsTrigger>
            <TabsTrigger value="codm" className="text-xs px-2">CODM</TabsTrigger>
            <TabsTrigger value="fcmobile" className="text-xs px-2">FC</TabsTrigger>
            <TabsTrigger value="conduct" className="text-xs px-2">Conduct</TabsTrigger>
            <TabsTrigger value="tournament" className="text-xs px-2">Format</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <div className="space-y-4">
              <Label className="text-gray-300">General Rules</Label>
              <Textarea
                value={rulesContent.general}
                onChange={(e) => handleContentChange('general', e.target.value)}
                placeholder="Enter general tournament rules..."
                className="bg-slate-600 border-slate-500 text-white min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="freefire" className="mt-4">
            <div className="space-y-4">
              <Label className="text-gray-300">Free Fire Rules</Label>
              <Textarea
                value={rulesContent.freefire}
                onChange={(e) => handleContentChange('freefire', e.target.value)}
                placeholder="Enter Free Fire specific rules..."
                className="bg-slate-600 border-slate-500 text-white min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="codm" className="mt-4">
            <div className="space-y-4">
              <Label className="text-gray-300">Call of Duty Mobile Rules</Label>
              <Textarea
                value={rulesContent.codm}
                onChange={(e) => handleContentChange('codm', e.target.value)}
                placeholder="Enter CODM specific rules..."
                className="bg-slate-600 border-slate-500 text-white min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="fcmobile" className="mt-4">
            <div className="space-y-4">
              <Label className="text-gray-300">FC Mobile Rules</Label>
              <Textarea
                value={rulesContent.fcmobile}
                onChange={(e) => handleContentChange('fcmobile', e.target.value)}
                placeholder="Enter FC Mobile specific rules..."
                className="bg-slate-600 border-slate-500 text-white min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="conduct" className="mt-4">
            <div className="space-y-4">
              <Label className="text-gray-300">Code of Conduct & Disqualification</Label>
              <Textarea
                value={rulesContent.conduct}
                onChange={(e) => handleContentChange('conduct', e.target.value)}
                placeholder="Enter conduct rules and disqualification policies..."
                className="bg-slate-600 border-slate-500 text-white min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="tournament" className="mt-4">
            <div className="space-y-4">
              <Label className="text-gray-300">Tournament Format & Prize Structure</Label>
              <Textarea
                value={rulesContent.tournament}
                onChange={(e) => handleContentChange('tournament', e.target.value)}
                placeholder="Enter tournament format and prize information..."
                className="bg-slate-600 border-slate-500 text-white min-h-[300px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={saveRulesContent} className="w-full bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save All Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulesTab;
