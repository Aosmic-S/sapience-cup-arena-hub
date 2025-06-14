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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Trash2, Download, Edit, Users, Settings, Megaphone, 
  Calendar as CalendarIcon, Mail, BarChart3, Shield, 
  Database, Bell, Trophy, Clock, MessageSquare, FileText 
} from 'lucide-react';

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
  
  // New state for additional features
  const [matchDays, setMatchDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [matchDetails, setMatchDetails] = useState({ game: '', time: '', description: '' });
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
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal' });
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupInterval: 'daily',
    lastBackup: new Date().toISOString()
  });

  const adminPassword = "SHELBY1701";

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [registrations, filters]);

  const loadAllData = () => {
    loadRegistrations();
    loadBannerSettings();
    loadMatchDays();
    loadSystemSettings();
    loadAnnouncements();
    loadBackupSettings();
  };

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
    const headers = ['Name', 'Class', 'Game', 'Type', 'Team Name', 'Phone', 'In-Game ID', 'UID', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.fullName,
        reg.classSection,
        reg.game,
        reg.entryType,
        reg.teamName || 'N/A',
        reg.phoneNumber,
        reg.inGameId || 'N/A',
        reg.uid || 'N/A',
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

  const addMatchDay = () => {
    if (selectedDate && matchDetails.game && matchDetails.time) {
      const newMatch = {
        id: Date.now(),
        date: selectedDate,
        ...matchDetails,
        timestamp: new Date().toISOString()
      };
      const updated = [...matchDays, newMatch];
      setMatchDays(updated);
      localStorage.setItem('matchDays', JSON.stringify(updated));
      setSelectedDate(null);
      setMatchDetails({ game: '', time: '', description: '' });
      toast({
        title: "Match Scheduled",
        description: "Match day has been added successfully",
      });
    }
  };

  const deleteMatchDay = (id) => {
    const updated = matchDays.filter(match => match.id !== id);
    setMatchDays(updated);
    localStorage.setItem('matchDays', JSON.stringify(updated));
    toast({
      title: "Match Deleted",
      description: "Match day has been removed",
    });
  };

  const sendBulkEmail = () => {
    // Simulate sending emails
    toast({
      title: "Emails Sent",
      description: `Bulk email sent to ${registrations.length} participants`,
    });
  };

  const updateSystemSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    toast({
      title: "Settings Updated",
      description: "System settings have been saved",
    });
  };

  const addAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement = {
        id: Date.now(),
        ...newAnnouncement,
        timestamp: new Date().toISOString()
      };
      const updated = [...announcements, announcement];
      setAnnouncements(updated);
      localStorage.setItem('announcements', JSON.stringify(updated));
      setNewAnnouncement({ title: '', content: '', priority: 'normal' });
      toast({
        title: "Announcement Added",
        description: "New announcement has been created",
      });
    }
  };

  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(ann => ann.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
    toast({
      title: "Announcement Deleted",
      description: "Announcement has been removed",
    });
  };

  const createBackup = () => {
    const backupData = {
      registrations,
      bannerSettings,
      matchDays,
      systemSettings,
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
    
    setBackupSettings({...backupSettings, lastBackup: new Date().toISOString()});
    localStorage.setItem('backupSettings', JSON.stringify({...backupSettings, lastBackup: new Date().toISOString()}));
    
    toast({
      title: "Backup Created",
      description: "System backup has been downloaded",
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
                                  {registration.inGameId && <p><strong>In-Game ID:</strong> {registration.inGameId}</p>}
                                  {registration.uid && <p><strong>UID:</strong> {registration.uid}</p>}
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

              <TabsContent value="calendar" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Schedule Match Days</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Select Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-slate-600 border-slate-500 text-white",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="text-gray-300">Game</Label>
                        <Select value={matchDetails.game} onValueChange={(value) => setMatchDetails({...matchDetails, game: value})}>
                          <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Select Game" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="free-fire">Free Fire</SelectItem>
                            <SelectItem value="codm">CODM</SelectItem>
                            <SelectItem value="fc-mobile">FC Mobile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300">Time</Label>
                        <Input
                          type="time"
                          value={matchDetails.time}
                          onChange={(e) => setMatchDetails({...matchDetails, time: e.target.value})}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300">Description</Label>
                        <Input
                          value={matchDetails.description}
                          onChange={(e) => setMatchDetails({...matchDetails, description: e.target.value})}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder="Match description (optional)"
                        />
                      </div>

                      <Button onClick={addMatchDay} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule Match
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Scheduled Matches</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {matchDays.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No matches scheduled</p>
                        ) : (
                          matchDays.map((match) => (
                            <div key={match.id} className="bg-slate-600/50 p-3 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">{match.game.replace('-', ' ').toUpperCase()}</p>
                                <p className="text-gray-300 text-sm">{format(new Date(match.date), "PPP")} at {match.time}</p>
                                {match.description && <p className="text-gray-400 text-sm">{match.description}</p>}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMatchDay(match.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
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

              <TabsContent value="communications" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Bulk Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Subject</Label>
                        <Input
                          value={emailTemplate.subject}
                          onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Message</Label>
                        <textarea
                          value={emailTemplate.message}
                          onChange={(e) => setEmailTemplate({...emailTemplate, message: e.target.value})}
                          className="w-full h-32 bg-slate-600 border-slate-500 text-white rounded-md p-3"
                        />
                      </div>
                      <Button onClick={sendBulkEmail} className="w-full bg-green-600 hover:bg-green-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Send to All Participants ({registrations.length})
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Announcements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Title</Label>
                        <Input
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Content</Label>
                        <textarea
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                          className="w-full h-24 bg-slate-600 border-slate-500 text-white rounded-md p-3"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Priority</Label>
                        <Select 
                          value={newAnnouncement.priority} 
                          onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}
                        >
                          <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addAnnouncement} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Bell className="w-4 h-4 mr-2" />
                        Add Announcement
                      </Button>
                      
                      <div className="mt-4 space-y-2">
                        {announcements.slice(0, 3).map((announcement) => (
                          <div key={announcement.id} className="bg-slate-600/50 p-2 rounded flex justify-between items-center">
                            <div>
                              <p className="text-white text-sm font-medium">{announcement.title}</p>
                              <Badge variant={announcement.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                                {announcement.priority}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAnnouncement(announcement.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="system" className="mt-6">
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
                          checked={systemSettings.registrationOpen}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, registrationOpen: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Auto Approval</Label>
                        <Switch
                          checked={systemSettings.autoApproval}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoApproval: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Email Notifications</Label>
                        <Switch
                          checked={systemSettings.emailNotifications}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-gray-300">Max Participants</Label>
                        <Input
                          type="number"
                          value={systemSettings.maxParticipants}
                          onChange={(e) => setSystemSettings({...systemSettings, maxParticipants: parseInt(e.target.value)})}
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
                            onCheckedChange={(checked) => setBackupSettings({...backupSettings, autoBackup: checked})}
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
                            <div className="text-white font-bold">{registrations.length}</div>
                          </div>
                          <div className="bg-slate-600/50 p-2 rounded">
                            <div className="text-gray-400">Scheduled Matches</div>
                            <div className="text-white font-bold">{matchDays.length}</div>
                          </div>
                          <div className="bg-slate-600/50 p-2 rounded">
                            <div className="text-gray-400">Solo Entries</div>
                            <div className="text-white font-bold">{registrations.filter(r => r.entryType === 'solo').length}</div>
                          </div>
                          <div className="bg-slate-600/50 p-2 rounded">
                            <div className="text-gray-400">Team Entries</div>
                            <div className="text-white font-bold">{registrations.filter(r => r.entryType === 'team').length}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
