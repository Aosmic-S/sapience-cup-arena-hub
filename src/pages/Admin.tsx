import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, Settings, Megaphone, 
  Calendar as CalendarIcon, Mail, Database, Gamepad2, FileText, Trophy, LogOut
} from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import RegistrationsTab from '@/components/admin/RegistrationsTab';
import CalendarTab from '@/components/admin/CalendarTab';
import BannerTab from '@/components/admin/BannerTab';
import CommunicationsTab from '@/components/admin/CommunicationsTab';
import SystemTab from '@/components/admin/SystemTab';
import GamesTab from '@/components/admin/GamesTab';
import RulesTab from '@/components/admin/RulesTab';
import LeaderboardTab from '@/components/admin/LeaderboardTab';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if admin is already logged in from localStorage
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel",
    });
  };

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
      if (error && error.code !== 'PGRST116') throw error;
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

  const { data: games = [], isLoading: isLoadingGames } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: true });
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

  const refreshBannerSettings = () => {
    queryClient.invalidateQueries({ queryKey: ['bannerSettings'] });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const isLoading = isLoadingRegistrations || isLoadingBanner || isLoadingMatchDays || isLoadingSystem || isLoadingAnnouncements || isLoadingGames;
  
  const allData = { registrations, bannerSettings, matchDays, systemSettings, announcements, games };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center">
                <Settings className="w-8 h-8 mr-3" />
                Admin Panel
              </CardTitle>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 p-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <Tabs defaultValue="registrations" className="w-full">
                <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-slate-700 gap-1">
                  <TabsTrigger value="registrations" className="flex items-center text-xs px-1 md:px-2">
                    <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Registrations</span>
                    <span className="sm:hidden">Reg</span>
                    <span className="ml-1">({registrations.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex items-center text-xs px-1 md:px-2">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Leaderboard</span>
                    <span className="sm:hidden">Board</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center text-xs px-1 md:px-2">
                    <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Calendar</span>
                    <span className="sm:hidden">Cal</span>
                  </TabsTrigger>
                  <TabsTrigger value="games" className="flex items-center text-xs px-1 md:px-2">
                    <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Games</span>
                    <span className="sm:hidden">Games</span>
                  </TabsTrigger>
                  <TabsTrigger value="rules" className="flex items-center text-xs px-1 md:px-2">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Rules</span>
                    <span className="sm:hidden">Rules</span>
                  </TabsTrigger>
                  <TabsTrigger value="banner" className="flex items-center text-xs px-1 md:px-2">
                    <Megaphone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Banner</span>
                    <span className="sm:hidden">Banner</span>
                  </TabsTrigger>
                  <TabsTrigger value="communications" className="flex items-center text-xs px-1 md:px-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Comms</span>
                    <span className="sm:hidden">Comms</span>
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center text-xs px-1 md:px-2">
                    <Database className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">System</span>
                    <span className="sm:hidden">Sys</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="registrations" className="mt-6">
                  <RegistrationsTab 
                    registrations={registrations} 
                    onRegistrationsChange={() => queryClient.invalidateQueries({ queryKey: ['registrations'] })} 
                  />
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-6">
                  <LeaderboardTab />
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                  <CalendarTab 
                    matchDays={matchDays || []} 
                    onMatchDaysChange={() => queryClient.invalidateQueries({ queryKey: ['matchDays'] })}
                  />
                </TabsContent>

                <TabsContent value="games" className="mt-6">
                  <GamesTab 
                    games={games || []} 
                    onGamesChange={() => queryClient.invalidateQueries({ queryKey: ['games'] })}
                  />
                </TabsContent>

                <TabsContent value="rules" className="mt-6">
                  <RulesTab />
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
