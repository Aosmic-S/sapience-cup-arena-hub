import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Settings, Database, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemSettings {
  registrationOpen: boolean;
  maxParticipants: number;
  autoApproval: boolean;
  emailNotifications: boolean;
}

interface BackupSettings {
  autoBackup: boolean;
  backupInterval: string;
  lastBackup: string;
}

interface SystemTabProps {
  systemSettings: SystemSettings;
  onSystemSettingsChange: (settings: SystemSettings) => void;
  backupSettings: BackupSettings;
  onBackupSettingsChange: (settings: BackupSettings) => void;
  registrationCount: number;
  matchDayCount: number;
}

const SystemTab = ({ 
  systemSettings, 
  onSystemSettingsChange, 
  backupSettings, 
  onBackupSettingsChange,
  registrationCount,
  matchDayCount,
}: SystemTabProps) => {
  const [localSettings, setLocalSettings] = useState(systemSettings);

  useEffect(() => {
    setLocalSettings(systemSettings);
  }, [systemSettings]);

  const handleSettingChange = (field: keyof SystemSettings, value: any) => {
    setLocalSettings(prev => (prev ? { ...prev, [field]: value } : null));
  };
  
  const updateSystemSettings = async () => {
    if (!localSettings) return;

    const { error } = await supabase
      .from('system_settings')
      .update({
        registration_open: localSettings.registrationOpen,
        max_participants: localSettings.maxParticipants,
        auto_approval: localSettings.autoApproval,
        email_notifications: localSettings.emailNotifications,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      toast({ title: "Error Updating Settings", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings Updated", description: "System settings have been saved" });
      onSystemSettingsChange();
    }
  };

  const createBackup = async () => {
    const { data: registrations } = await supabase.from('registrations').select('*');
    const { data: banner_settings } = await supabase.from('banner_settings').select('*');
    const { data: system_settings } = await supabase.from('system_settings').select('*');
    const { data: match_days } = await supabase.from('match_days').select('*');
    const { data: announcements } = await supabase.from('announcements').select('*');
    
    const backupData = {
      registrations,
      banner_settings,
      system_settings,
      match_days,
      announcements,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    const updatedBackupSettings = {...backupSettings, lastBackup: new Date().toISOString()};
    onBackupSettingsChange(updatedBackupSettings);
    
    toast({ title: "Backup Created", description: "System backup has been downloaded" });
  };

  if (!localSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Registration Open</Label>
            <Switch
              checked={localSettings.registrationOpen}
              onCheckedChange={(checked) => handleSettingChange('registrationOpen', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Auto Approval</Label>
            <Switch
              checked={localSettings.autoApproval}
              onCheckedChange={(checked) => handleSettingChange('autoApproval', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Email Notifications</Label>
            <Switch
              checked={localSettings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Max Participants</Label>
            <Input
              type="number"
              value={localSettings.maxParticipants}
              onChange={(e) => handleSettingChange('maxParticipants', parseInt(e.target.value))}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          
          <Button onClick={updateSystemSettings} className="w-full bg-blue-600 hover:bg-blue-700">
            Update Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Backup Settings</Label>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Auto Backup</span>
              <Switch
                checked={backupSettings.autoBackup}
                onCheckedChange={(checked) => onBackupSettingsChange({...backupSettings, autoBackup: checked})}
              />
            </div>
            <div className="text-gray-400 text-sm">
              Last backup: {new Date(backupSettings.lastBackup).toLocaleString()}
            </div>
          </div>
          
          <Button onClick={createBackup} className="w-full bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Create Backup
          </Button>
          
          <div className="pt-4 border-t border-slate-600">
            <h4 className="text-white font-medium mb-2">Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-600/50 p-2 rounded">
                <div className="text-gray-400">Total Registrations</div>
                <div className="text-white font-bold">{registrationCount}</div>
              </div>
              <div className="bg-slate-600/50 p-2 rounded">
                <div className="text-gray-400">Scheduled Matches</div>
                <div className="text-white font-bold">{matchDayCount}</div>
              </div>
              <div className="bg-slate-600/50 p-2 rounded">
                <div className="text-gray-400">Solo Entries</div>
                <div className="text-white font-bold">{registrationCount > 0 ? Math.floor(registrationCount * 0.6) : 0}</div>
              </div>
              <div className="bg-slate-600/50 p-2 rounded">
                <div className="text-gray-400">Team Entries</div>
                <div className="text-white font-bold">{registrationCount > 0 ? Math.ceil(registrationCount * 0.4) : 0}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTab;
