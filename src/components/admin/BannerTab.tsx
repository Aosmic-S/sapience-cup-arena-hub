
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
    color: 'bg-warning/10',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bannerSettings) {
      setFormData({
        text: bannerSettings.text || '',
        is_blinking: bannerSettings.is_blinking || false,
        color: bannerSettings.color || 'bg-warning/10',
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
      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Banner Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bannerText" className="text-muted-foreground">Banner Text</Label>
            <Input
              id="bannerText"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Enter banner text..."
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="bannerActive"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="bannerActive" className="text-muted-foreground">Show Banner</Label>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="bannerBlink"
              checked={formData.is_blinking}
              onCheckedChange={(checked) => handleInputChange('is_blinking', checked)}
            />
            <Label htmlFor="bannerBlink" className="text-muted-foreground">Enable Blinking Animation</Label>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Banner Color Theme</Label>
            <Select 
              value={formData.color} 
              onValueChange={(value) => handleInputChange('color', value)}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                <SelectItem value="bg-primary text-primary-foreground">Volt (accent)</SelectItem>
                <SelectItem value="bg-warning text-primary-foreground">Amber (notice)</SelectItem>
                <SelectItem value="bg-destructive text-foreground">Red (urgent)</SelectItem>
                <SelectItem value="bg-card text-foreground border-b border-border">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={updateBannerSettings} 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Banner Settings'}
          </Button>
        </CardContent>
      </Card>

      {formData.is_active && (
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Live Banner Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${formData.color} text-foreground py-4 px-6 rounded-lg`}>
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
