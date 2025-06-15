
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface BannerSettings {
  text: string;
  isBlinking: boolean;
  color: string;
  isActive: boolean;
}

interface BannerTabProps {
  bannerSettings: BannerSettings;
  onBannerSettingsChange: (settings: BannerSettings) => void;
}

const BannerTab = ({ bannerSettings, onBannerSettingsChange }: BannerTabProps) => {
  const updateBannerSettings = () => {
    localStorage.setItem('bannerSettings', JSON.stringify(bannerSettings));
    
    // Dispatch custom event to notify other components of banner update
    window.dispatchEvent(new CustomEvent('bannerUpdated'));
    
    toast({
      title: "Banner Updated",
      description: "Banner settings have been saved successfully",
    });
  };

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
              value={bannerSettings.text}
              onChange={(e) => onBannerSettingsChange({...bannerSettings, text: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bannerActive"
              checked={bannerSettings.isActive}
              onCheckedChange={(checked) => onBannerSettingsChange({...bannerSettings, isActive: checked})}
            />
            <Label htmlFor="bannerActive" className="text-gray-300">Show Banner</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bannerBlink"
              checked={bannerSettings.isBlinking}
              onCheckedChange={(checked) => onBannerSettingsChange({...bannerSettings, isBlinking: checked})}
            />
            <Label htmlFor="bannerBlink" className="text-gray-300">Enable Blinking</Label>
          </div>

          <div>
            <Label className="text-gray-300">Banner Color</Label>
            <Select 
              value={bannerSettings.color} 
              onValueChange={(value) => onBannerSettingsChange({...bannerSettings, color: value})}
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

      {bannerSettings.isActive && (
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-xl text-white">Banner Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${bannerSettings.color} text-white py-3 px-4 rounded-lg`}>
              <p className={`font-bold text-lg text-center ${bannerSettings.isBlinking ? 'animate-pulse' : ''}`}>
                {bannerSettings.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BannerTab;
