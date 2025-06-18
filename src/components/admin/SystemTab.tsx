
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
  id?: number;
  registration_open: boolean;
  max_participants: number;
  auto_approval: boolean;
  email_notifications: boolean;
}

interface BackupSettings {
  autoBackup: boolean;
  backupInterval: string;
  lastBackup: string;
}

interface SystemTabProps {
  systemSettings: SystemSettings | null;
  onSystemSettingsChange: () => void;
  backupSettings: BackupSettings;
  onBackupSettingsChange: (settings: BackupSettings) => void;
  registrationCount: number;
  matchDayCount: number;
  allData: any;
}

const SystemTab = ({ 
  systemSettings, 
  onSystemSettingsChange, 
  backupSettings, 
  onBackupSettingsChange,
  registrationCount,
  matchDayCount,
  allData
}: SystemTabProps) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>({
    registration_open: true,
    max_participants: 100,
    auto_approval: true,
    email_notifications: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      setLocalSettings(systemSettings);
    }
  }, [systemSettings]);

  const handleSettingChange = (field: keyof SystemSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const createInitialSettings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .insert([{
          id: 1,
          registration_open: localSettings.registration_open,
          max_participants: localSettings.max_participants,
          auto_approval: localSettings.auto_approval,
          email_notifications: localSettings.email_notifications,
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error creating settings:', error);
        toast({ 
          title: "Error Creating Settings", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        toast({ title: "Settings Created", description: "System settings have been initialized" });
        onSystemSettingsChange();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateSystemSettings = async () => {
    setIsLoading(true);
    
    try {
      if (!systemSettings) {
        await createInitialSettings();
        return;
      }

      const { error } = await supabase
        .from('system_settings')
        .update({
          registration_open: localSettings.registration_open,
          max_participants: localSettings.max_participants,
          auto_approval: localSettings.auto_approval,
          email_notifications: localSettings.email_notifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', systemSettings.id || 1);

      if (error) {
        console.error('Error updating settings:', error);
        toast({ 
          title: "Error Updating Settings", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        toast({ title: "Settings Updated", description: "System settings have been saved" });
        onSystemSettingsChange();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      const backupData = {
        ...allData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sapience-esports-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      const updatedBackupSettings = {...backupSettings, lastBackup: new Date().toISOString()};
      onBackupSettingsChange(updatedBackupSettings);
      
      toast({ title: "Backup Created", description: "System backup has been downloaded successfully" });
    } catch (error) {
      console.error('Backup error:', error);
      toast({ 
        title: "Backup Failed", 
        description: "Failed to create backup", 
        variant: "destructive" 
      });
    }
  };

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
              checked={localSettings.registration_open}
              onCheckedChange={(checked) => handleSettingChange('registration_open', checked)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Auto Approval</Label>
            <Switch
              checked={localSettings.auto_approval}
              onCheckedChange={(checked) => handleSettingChange('auto_approval', checked)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Email Notifications</Label>
            <Switch
              checked={localSettings.email_notifications}
              onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Max Participants</Label>
            <Input
              type="number"
              value={localSettings.max_participants}
              onChange={(e) => handleSettingChange('max_participants', parseInt(e.target.value) || 100)}
              className="bg-slate-600 border-slate-500 text-white mt-1"
              min="1"
              max="1000"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={updateSystemSettings} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (!systemSettings ? 'Create Settings' : 'Update Settings')}
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
            <h4 className="text-white font-medium mb-2">System Statistics</h4>
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
