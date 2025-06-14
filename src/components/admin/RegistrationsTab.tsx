
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Trash2, Download } from 'lucide-react';

interface Registration {
  id: string;
  fullName: string;
  classSection: string;
  game: string;
  entryType: string;
  teamName?: string;
  phoneNumber: string;
  inGameId?: string;
  uid?: string;
  timestamp: string;
  members?: string[];
}

interface RegistrationsTabProps {
  registrations: Registration[];
  onRegistrationsChange: (registrations: Registration[]) => void;
}

const RegistrationsTab = ({ registrations, onRegistrationsChange }: RegistrationsTabProps) => {
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [filters, setFilters] = useState({ game: 'all', class: 'all', type: 'all' });

  useEffect(() => {
    applyFilters();
  }, [registrations, filters]);

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

  const deleteRegistration = (id: string) => {
    const updated = registrations.filter(reg => reg.id !== id);
    onRegistrationsChange(updated);
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

  return (
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
                      {registration.entryType === 'team' && registration.members && (
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
  );
};

export default RegistrationsTab;
