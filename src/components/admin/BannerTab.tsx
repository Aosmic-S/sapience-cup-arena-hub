
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BannerSettings {
  text: string;
  is_blinking: boolean;
  color: string;
  is_active: boolean;
}

interface BannerTabProps {
  bannerSettings: BannerSettings | null;
  onBannerSettingsChange: () => void;
}

const BannerTab = ({ bannerSettings, onBannerSettingsChange }: BannerTabProps) => {
  const [localSettings, setLocalSettings] = useState(bannerSettings);

  useEffect(() => {
    setLocalSettings(bannerSettings);
  }, [bannerSettings]);

  const handleSettingChange = (field: keyof BannerSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const updateBannerSettings = async () => {
    if (!localSettings) return;
    
    const { error } = await supabase
      .from('banner_settings')
      .update({
        text: localSettings.text,
        is_blinking: localSettings.is_blinking,
        color: localSettings.color,
        is_active: localSettings.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      toast({ title: "Error Updating Banner", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Banner Updated", description: "Banner settings have been saved successfully" });
      onBannerSettingsChange();
    }
  };

  if (!localSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white">Banner Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bannerText" className="text-gray-300">Banner Text</Label>
            <Input
              id="bannerText"
              value={localSettings.text}
              onChange={(e) => handleSettingChange('text', e.target.value)}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bannerActive"
              checked={localSettings.is_active}
              onCheckedChange={(checked) => handleSettingChange('is_active', checked)}
            />
            <Label htmlFor="bannerActive" className="text-gray-300">Show Banner</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bannerBlink"
              checked={localSettings.is_blinking}
              onCheckedChange={(checked) => handleSettingChange('is_blinking', checked)}
            />
            <Label htmlFor="bannerBlink" className="text-gray-300">Enable Blinking</Label>
          </div>

          <div>
            <Label className="text-gray-300">Banner Color</Label>
            <Select 
              value={localSettings.color} 
              onValueChange={(value) => handleSettingChange('color', value)}
            >
              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="bg-gradient-to-r from-red-600 to-orange-600">Red to Orange</SelectItem>
                <SelectItem value="bg-gradient-to-r from-blue-600 to-purple-600">Blue to Purple</SelectItem>
                <SelectItem value="bg-gradient-to-r from-green-600 to-teal-600">Green to Teal</SelectItem>
                <SelectItem value="bg-gradient-to-r from-yellow-600 to-red-600">Yellow to Red</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={updateBannerSettings} className="w-full bg-blue-600 hover:bg-blue-700">
            Update Banner Settings
          </Button>
        </CardContent>
      </Card>

      {localSettings.is_active && (
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-xl text-white">Banner Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${localSettings.color} text-white py-3 px-4 rounded-lg`}>
              <p className={`font-bold text-lg text-center ${localSettings.is_blinking ? 'animate-pulse' : ''}`}>
                {localSettings.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BannerTab;
