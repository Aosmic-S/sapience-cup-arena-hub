import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, Settings, Megaphone, 
  Calendar as CalendarIcon, Mail, Database, Gamepad2, FileText, Trophy, LogOut, GitBranch
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
import BracketsTab from '@/components/admin/BracketsTab';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [active, setActive] = useState('registrations');
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

  const sections = [
    { id: 'registrations', label: 'Registrations', icon: Users, count: registrations.length },
    { id: 'brackets', label: 'Brackets', icon: GitBranch },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'games', label: 'Games', icon: Gamepad2, count: games.length },
    { id: 'calendar', label: 'Schedule', icon: CalendarIcon },
    { id: 'rules', label: 'Rules', icon: FileText },
    { id: 'banner', label: 'Banner', icon: Megaphone },
    { id: 'communications', label: 'Comms', icon: Mail },
    { id: 'system', label: 'System', icon: Database },
  ];
  const current = sections.find((s) => s.id === active) ?? sections[0];

  const renderSection = () => {
    switch (active) {
      case 'brackets': return <BracketsTab games={games} registrations={registrations} />;
      case 'registrations': return (<RegistrationsTab 
                    registrations={registrations} 
                    onRegistrationsChange={() => queryClient.invalidateQueries({ queryKey: ['registrations'] })} 
                  />);
      case 'leaderboard': return (<LeaderboardTab />);
      case 'calendar': return (<CalendarTab 
                    matchDays={matchDays || []} 
                    onMatchDaysChange={() => queryClient.invalidateQueries({ queryKey: ['matchDays'] })}
                  />);
      case 'games': return (<GamesTab 
                    games={games || []} 
                    onGamesChange={() => queryClient.invalidateQueries({ queryKey: ['games'] })}
                  />);
      case 'rules': return (<RulesTab />);
      case 'banner': return (<BannerTab 
                    bannerSettings={bannerSettings || null} 
                    onBannerSettingsChange={() => queryClient.invalidateQueries({ queryKey: ['bannerSettings'] })}
                  />);
      case 'communications': return (<CommunicationsTab 
                    emailTemplate={emailTemplate}
                    onEmailTemplateChange={setEmailTemplate}
                    announcements={announcements || []}
                    onAnnouncementsChange={() => queryClient.invalidateQueries({ queryKey: ['announcements'] })}
                    registrationCount={registrations.length}
                  />);
      case 'system': return (<SystemTab 
                    systemSettings={systemSettings}
                    onSystemSettingsChange={() => queryClient.invalidateQueries({ queryKey: ['systemSettings'] })}
                    backupSettings={backupSettings}
                    onBackupSettingsChange={setBackupSettings}
                    registrationCount={registrations.length}
                    matchDayCount={matchDays.length}
                    allData={allData}
                  />);
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-border bg-card/40 md:sticky md:top-0 md:h-screen flex flex-col">
        <div className="px-5 h-14 flex items-center gap-2 border-b border-border">
          <span className="h-2.5 w-2.5 bg-primary rotate-45" />
          <span className="font-display font-bold uppercase tracking-wider text-sm">Sapience<span className="text-primary">/</span>Console</span>
        </div>
        <nav className="flex md:flex-col gap-1 p-2 overflow-x-auto md:overflow-visible flex-1">
          {sections.map((s) => {
            const Icon = s.icon;
            const on = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`shrink-0 flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${on ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{s.label}</span>
                {s.count !== undefined && <span className="ml-auto font-mono-tag text-[11px] opacity-70">{s.count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="hidden md:flex flex-col gap-1 p-2 border-t border-border">
          <Link to="/" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">← View site</Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="h-14 border-b border-border px-6 flex items-center justify-between">
          <h1 className="font-display uppercase tracking-wider font-bold">{current.label}</h1>
          <button onClick={handleLogout} className="md:hidden text-destructive" aria-label="Log out"><LogOut className="w-4 h-4" /></button>
        </header>
        <div className="p-4 md:p-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
