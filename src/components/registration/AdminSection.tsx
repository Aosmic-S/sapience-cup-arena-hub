
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Check, X } from 'lucide-react';

interface AdminSectionProps {
  customTeamId: string;
  isAdminMode: boolean;
  onCustomTeamIdChange: (value: string) => void;
  onAdminModeChange: (isAdmin: boolean) => void;
}

const AdminSection = ({ customTeamId, isAdminMode, onCustomTeamIdChange, onAdminModeChange }: AdminSectionProps) => {
  const [adminCode, setAdminCode] = useState('');
  const [showAdminSection, setShowAdminSection] = useState(false);

  const validAdminCodes = ['ADMIN2024', 'TOURNAMENT_ADMIN', 'ESPORTS_ADMIN'];

  const handleAdminCodeSubmit = () => {
    if (validAdminCodes.includes(adminCode.toUpperCase())) {
      onAdminModeChange(true);
      setShowAdminSection(true);
    } else {
      onAdminModeChange(false);
      alert('Invalid admin code!');
    }
  };

  return (
    <Card className="bg-slate-700/30 border-slate-600">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Admin Section (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAdminMode ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-gray-300">Enter Admin Code</Label>
              <div className="flex gap-2">
                <Input
                  id="adminCode"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Admin access code"
                />
                <Button 
                  type="button"
                  onClick={handleAdminCodeSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-green-400 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Admin Access Granted
              </span>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onAdminModeChange(false);
                  setAdminCode('');
                  onCustomTeamIdChange('');
                }}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                <X className="w-4 h-4 mr-1" />
                Exit Admin
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customTeamId" className="text-gray-300">Custom Team ID (Optional)</Label>
              <Input
                id="customTeamId"
                value={customTeamId}
                onChange={(e) => onCustomTeamIdChange(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., TEAM_SPECIAL_001"
              />
              <p className="text-xs text-gray-400">
                Leave empty to auto-generate team ID
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSection;
