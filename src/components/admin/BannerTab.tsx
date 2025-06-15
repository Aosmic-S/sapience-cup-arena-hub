
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
  id: number;
  text: string | null;
  is_blinking: boolean | null;
  color: string | null;
  is_active: boolean | null;
  updated_at: string | null;
}

interface BannerTabProps {
  bannerSettings: BannerSettings | null;
  onBannerSettingsChange: () => void;
}

const BannerTab = ({ bannerSettings, onBannerSettingsChange }: BannerTabProps) => {
  const [formData, setFormData] = useState({
    text: '',
    is_blinking: false,
    color: 'bg-gradient-to-r from-red-600 to-orange-600',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bannerSettings) {
      setFormData({
        text: bannerSettings.text || '',
        is_blinking: bannerSettings.is_blinking || false,
        color: bannerSettings.color || 'bg-gradient-to-r from-red-600 to-orange-600',
        is_active: bannerSettings.is_active || false
      });
    }
  }, [bannerSettings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateBannerSettings = async () => {
    setIsLoading(true);
    console.log('Updating banner with data:', formData);
    
    try {
      const { data, error } = await supabase
        .from('banner_settings')
        .upsert({
          id: 1,
          text: formData.text,
          is_blinking: formData.is_blinking,
          color: formData.color,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Banner update error:', error);
        toast({ title: "Error Updating Banner", description: error.message, variant: "destructive" });
      } else {
        console.log('Banner updated successfully:', data);
        toast({ title: "Banner Updated", description: "Banner settings have been saved successfully" });
        onBannerSettingsChange();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white">Banner Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bannerText" className="text-gray-300">Banner Text</Label>
            <Input
              id="bannerText"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Enter banner text..."
              className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="bannerActive"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="bannerActive" className="text-gray-300">Show Banner</Label>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="bannerBlink"
              checked={formData.is_blinking}
              onCheckedChange={(checked) => handleInputChange('is_blinking', checked)}
            />
            <Label htmlFor="bannerBlink" className="text-gray-300">Enable Blinking Animation</Label>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Banner Color Theme</Label>
            <Select 
              value={formData.color} 
              onValueChange={(value) => handleInputChange('color', value)}
            >
              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="bg-gradient-to-r from-red-600 to-orange-600">🔥 Red to Orange</SelectItem>
                <SelectItem value="bg-gradient-to-r from-blue-600 to-purple-600">🌊 Blue to Purple</SelectItem>
                <SelectItem value="bg-gradient-to-r from-green-600 to-teal-600">🌿 Green to Teal</SelectItem>
                <SelectItem value="bg-gradient-to-r from-yellow-600 to-red-600">⚡ Yellow to Red</SelectItem>
                <SelectItem value="bg-gradient-to-r from-pink-600 to-purple-600">💜 Pink to Purple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={updateBannerSettings} 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Banner Settings'}
          </Button>
        </CardContent>
      </Card>

      {formData.is_active && (
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-xl text-white">Live Banner Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${formData.color} text-white py-4 px-6 rounded-lg`}>
              <p className={`font-bold text-lg text-center ${formData.is_blinking ? 'animate-pulse' : ''}`}>
                {formData.text || 'Your banner text will appear here...'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BannerTab;
