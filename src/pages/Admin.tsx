
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Download, Edit, Users, Settings, Megaphone } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [filters, setFilters] = useState({ game: 'all', class: 'all', type: 'all' });
  const [bannerSettings, setBannerSettings] = useState({
    text: "🔥 Registration Open - Sapience Esports Cup 2024! 🔥",
    isBlinking: true,
    color: "bg-gradient-to-r from-red-600 to-orange-600",
    isActive: true
  });

  const adminPassword = "admin123"; // In real app, this would be more secure

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations();
      loadBannerSettings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [registrations, filters]);

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid password",
        variant: "destructive"
      });
    }
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

  const applyFilters = () => {
    let filtered = [...registrations];
    
    if (filters.game !== 'all') {
      filtered = filtered.filter(reg => reg.game === filters.game);
    }
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(reg => reg.entryType === filters.type);
    }
    
    setFilteredRegistrations(filtered);
  };

  const deleteRegistration = (id) => {
    const updated = registrations.filter(reg => reg.id !== id);
    setRegistrations(updated);
    localStorage.setItem('registrations', JSON.stringify(updated));
    toast({
      title: "Registration Deleted",
      description: "Registration has been removed successfully",
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Class', 'Game', 'Type', 'Team Name', 'Phone', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.fullName,
        reg.classSection,
        reg.game,
        reg.entryType,
        reg.teamName || 'N/A',
        reg.phoneNumber,
        new Date(reg.timestamp).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updateBannerSettings = () => {
    localStorage.setItem('bannerSettings', JSON.stringify(bannerSettings));
    toast({
      title: "Banner Updated",
      description: "Banner settings have been saved successfully",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="registrations" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Registrations ({registrations.length})
                </TabsTrigger>
                <TabsTrigger value="banner" className="flex items-center">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Banner Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registrations" className="mt-6">
                <div className="space-y-6">
                  {/* Filters and Export */}
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                      <Select value={filters.game} onValueChange={(value) => setFilters({...filters, game: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-40">
                          <SelectValue placeholder="Filter by Game" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="all">All Games</SelectItem>
                          <SelectItem value="free-fire">Free Fire</SelectItem>
                          <SelectItem value="codm">CODM</SelectItem>
                          <SelectItem value="fc-mobile">FC Mobile</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-40">
                          <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>

                  {/* Registrations List */}
                  <div className="grid gap-4">
                    {filteredRegistrations.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        No registrations found
                      </div>
                    ) : (
                      filteredRegistrations.map((registration) => (
                        <Card key={registration.id} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-semibold text-white">{registration.fullName}</h3>
                                  <Badge variant="secondary" className="bg-blue-600 text-white">
                                    {registration.classSection}
                                  </Badge>
                                  <Badge variant="outline" className="border-purple-400 text-purple-400">
                                    {registration.game.replace('-', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                                <div className="text-gray-300 space-y-1">
                                  <p><strong>Type:</strong> {registration.entryType}</p>
                                  {registration.teamName && <p><strong>Team:</strong> {registration.teamName}</p>}
                                  <p><strong>Phone:</strong> {registration.phoneNumber}</p>
                                  <p><strong>Registered:</strong> {new Date(registration.timestamp).toLocaleString()}</p>
                                  {registration.entryType === 'team' && (
                                    <div>
                                      <strong>Members:</strong>
                                      <ul className="ml-4 mt-1">
                                        <li>1. {registration.fullName} (Captain)</li>
                                        {registration.members.filter(m => m.trim()).map((member, idx) => (
                                          <li key={idx}>{idx + 2}. {member}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteRegistration(registration.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="banner" className="mt-6">
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
                          onChange={(e) => setBannerSettings({...bannerSettings, text: e.target.value})}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bannerActive"
                          checked={bannerSettings.isActive}
                          onCheckedChange={(checked) => setBannerSettings({...bannerSettings, isActive: checked})}
                        />
                        <Label htmlFor="bannerActive" className="text-gray-300">Show Banner</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bannerBlink"
                          checked={bannerSettings.isBlinking}
                          onCheckedChange={(checked) => setBannerSettings({...bannerSettings, isBlinking: checked})}
                        />
                        <Label htmlFor="bannerBlink" className="text-gray-300">Enable Blinking</Label>
                      </div>

                      <div>
                        <Label className="text-gray-300">Banner Color</Label>
                        <Select 
                          value={bannerSettings.color} 
                          onValueChange={(value) => setBannerSettings({...bannerSettings, color: value})}
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

                  {/* Banner Preview */}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
