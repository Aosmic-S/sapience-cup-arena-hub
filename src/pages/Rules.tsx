
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

  const defaultRules = {
    general: 'General tournament rules will be displayed here.',
    freefire: 'Free Fire specific rules will be displayed here.',
    codm: 'Call of Duty Mobile specific rules will be displayed here.',
    fcmobile: 'FC Mobile specific rules will be displayed here.',
    conduct: 'Code of conduct and disqualification policies will be displayed here.',
    tournament: 'Tournament format and prize structure will be displayed here.'
  };

  const currentRules = rulesContent || defaultRules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center">
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
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-slate-700 gap-1">
                  <TabsTrigger value="general" className="text-xs px-1 md:px-2">General</TabsTrigger>
                  <TabsTrigger value="freefire" className="text-xs px-1 md:px-2">Fire</TabsTrigger>
                  <TabsTrigger value="codm" className="text-xs px-1 md:px-2">CODM</TabsTrigger>
                  <TabsTrigger value="fcmobile" className="text-xs px-1 md:px-2">FC</TabsTrigger>
                  <TabsTrigger value="conduct" className="text-xs px-1 md:px-2">Conduct</TabsTrigger>
                  <TabsTrigger value="tournament" className="text-xs px-1 md:px-2">Format</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4">
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {currentRules.general}
                  </div>
                </TabsContent>

                <TabsContent value="freefire" className="mt-4">
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {currentRules.freefire}
                  </div>
                </TabsContent>

                <TabsContent value="codm" className="mt-4">
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {currentRules.codm}
                  </div>
                </TabsContent>

                <TabsContent value="fcmobile" className="mt-4">
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {currentRules.fcmobile}
                  </div>
                </TabsContent>

                <TabsContent value="conduct" className="mt-4">
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {currentRules.conduct}
                  </div>
                </TabsContent>

                <TabsContent value="tournament" className="mt-4">
                  <div className="text-gray-300 whitespace-pre-wrap">
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
