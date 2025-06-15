import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Settings, Megaphone, 
  Calendar as CalendarIcon, Mail, Database
} from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import RegistrationsTab from '@/components/admin/RegistrationsTab';
import CalendarTab from '@/components/admin/CalendarTab';
import BannerTab from '@/components/admin/BannerTab';
import CommunicationsTab from '@/components/admin/CommunicationsTab';
import SystemTab from '@/components/admin/SystemTab';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  const { data: registrations = [], isLoading: isLoadingRegistrations } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
      if (error) {
        toast({ title: "Failed to load registrations", description: "This may be due to missing permissions. An admin account is required.", variant: "destructive" });
        return [];
      }
      return data || [];
    },
    enabled: isAuthenticated
  });

  const { data: bannerSettings, isLoading: isLoadingBanner } = useQuery({
    queryKey: ['bannerSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banner_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116: single row not found
      return data;
    },
    enabled: isAuthenticated
  });

  const { data: matchDays = [], isLoading: isLoadingMatchDays } = useQuery({
    queryKey: ['matchDays'],
    queryFn: async () => {
      const { data, error } = await supabase.from('match_days').select('*').order('date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated
  });

  const { data: systemSettings, isLoading: isLoadingSystem } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('system_settings').select('*').single();
      if (error && error.code !== 'PGRST116') {
         toast({ title: "Failed to load system settings", description: "This may be due to missing permissions. An admin account is required.", variant: "destructive" });
        return null;
      }
      return data;
    },
    enabled: isAuthenticated
  });

  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated
  });
  
  const [backupSettings, setBackupSettings] = useState({ autoBackup: true, backupInterval: 'daily', lastBackup: new Date().toISOString() });
  const [emailTemplate, setEmailTemplate] = useState({ subject: 'Sapience Esports Cup Update', message: 'Dear participant,\n\nWe have an important update regarding the tournament.\n\nBest regards,\nSapience Esports Team' });

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const isLoading = isLoadingRegistrations || isLoadingBanner || isLoadingMatchDays || isLoadingSystem || isLoadingAnnouncements;
  
  const allData = { registrations, bannerSettings, matchDays, systemSettings, announcements };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center">
              <Settings className="w-8 h-8 mr-3" />
              Admin Panel
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 p-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <Tabs defaultValue="registrations" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                  <TabsTrigger value="registrations" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Registrations ({registrations.length})
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="banner" className="flex items-center">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Banner
                  </TabsTrigger>
                  <TabsTrigger value="communications" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Communications
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    System
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="registrations" className="mt-6">
                  <RegistrationsTab 
                    registrations={registrations} 
                    onRegistrationsChange={() => queryClient.invalidateQueries({ queryKey: ['registrations'] })} 
                  />
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                  <CalendarTab 
                    matchDays={matchDays || []} 
                    onMatchDaysChange={() => queryClient.invalidateQueries({ queryKey: ['matchDays'] })}
                  />
                </TabsContent>

                <TabsContent value="banner" className="mt-6">
                  <BannerTab 
                    bannerSettings={bannerSettings || null} 
                    onBannerSettingsChange={() => queryClient.invalidateQueries({ queryKey: ['bannerSettings'] })}
                  />
                </TabsContent>

                <TabsContent value="communications" className="mt-6">
                  <CommunicationsTab 
                    emailTemplate={emailTemplate}
                    onEmailTemplateChange={setEmailTemplate}
                    announcements={announcements || []}
                    onAnnouncementsChange={() => queryClient.invalidateQueries({ queryKey: ['announcements'] })}
                    registrationCount={registrations.length}
                  />
                </TabsContent>

                <TabsContent value="system" className="mt-6">
                  <SystemTab 
                    systemSettings={systemSettings}
                    onSystemSettingsChange={() => queryClient.invalidateQueries({ queryKey: ['systemSettings'] })}
                    backupSettings={backupSettings}
                    onBackupSettingsChange={setBackupSettings}
                    registrationCount={registrations.length}
                    matchDayCount={matchDays.length}
                    allData={allData}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
