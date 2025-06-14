
import { useState, useEffect } from 'react';
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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    text: "🔥 Registration Open - Sapience Esports Cup 2024! 🔥",
    isBlinking: true,
    color: "bg-gradient-to-r from-red-600 to-orange-600",
    isActive: true
  });
  const [matchDays, setMatchDays] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Sapience Esports Cup Update',
    message: 'Dear participant,\n\nWe have an important update regarding the tournament.\n\nBest regards,\nSapience Esports Team'
  });
  const [systemSettings, setSystemSettings] = useState({
    registrationOpen: true,
    maxParticipants: 100,
    autoApproval: false,
    emailNotifications: true
  });
  const [announcements, setAnnouncements] = useState([]);
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupInterval: 'daily',
    lastBackup: new Date().toISOString()
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    loadRegistrations();
    loadBannerSettings();
    loadMatchDays();
    loadSystemSettings();
    loadAnnouncements();
    loadBackupSettings();
  };

  const loadRegistrations = () => {
    const saved = localStorage.getItem('registrations');
    if (saved) {
      const data = JSON.parse(saved);
      setRegistrations(data);
    }
  };

  const loadBannerSettings = () => {
    const saved = localStorage.getItem('bannerSettings');
    if (saved) {
      setBannerSettings(JSON.parse(saved));
    }
  };

  const loadMatchDays = () => {
    const saved = localStorage.getItem('matchDays');
    if (saved) {
      setMatchDays(JSON.parse(saved));
    }
  };

  const loadSystemSettings = () => {
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      setSystemSettings(JSON.parse(saved));
    }
  };

  const loadAnnouncements = () => {
    const saved = localStorage.getItem('announcements');
    if (saved) {
      setAnnouncements(JSON.parse(saved));
    }
  };

  const loadBackupSettings = () => {
    const saved = localStorage.getItem('backupSettings');
    if (saved) {
      setBackupSettings(JSON.parse(saved));
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const allData = {
    registrations,
    bannerSettings,
    matchDays,
    systemSettings,
    announcements
  };

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
                  onRegistrationsChange={setRegistrations} 
                />
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <CalendarTab 
                  matchDays={matchDays} 
                  onMatchDaysChange={setMatchDays} 
                />
              </TabsContent>

              <TabsContent value="banner" className="mt-6">
                <BannerTab 
                  bannerSettings={bannerSettings} 
                  onBannerSettingsChange={setBannerSettings} 
                />
              </TabsContent>

              <TabsContent value="communications" className="mt-6">
                <CommunicationsTab 
                  emailTemplate={emailTemplate}
                  onEmailTemplateChange={setEmailTemplate}
                  announcements={announcements}
                  onAnnouncementsChange={setAnnouncements}
                  registrationCount={registrations.length}
                />
              </TabsContent>

              <TabsContent value="system" className="mt-6">
                <SystemTab 
                  systemSettings={systemSettings}
                  onSystemSettingsChange={setSystemSettings}
                  backupSettings={backupSettings}
                  onBackupSettingsChange={setBackupSettings}
                  registrationCount={registrations.length}
                  matchDayCount={matchDays.length}
                  allData={allData}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
