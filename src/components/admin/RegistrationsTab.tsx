
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Trash2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Registration {
  id: string;
  full_name: string;
  class_section: string;
  game: string;
  entry_type: string;
  team_name?: string;
  phone_number: string;
  in_game_id?: string;
  uid?: string;
  created_at: string;
  members?: string[];
}

interface RegistrationsTabProps {
  registrations: Registration[];
  onRegistrationsChange: () => void;
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
      filtered = filtered.filter(reg => reg.entry_type === filters.type);
    }
    
    setFilteredRegistrations(filtered);
  };

  const deleteRegistration = async (id: string) => {
    const { error } = await supabase.from('registrations').delete().eq('id', id);

    if (error) {
      toast({
        title: "Error Deleting Registration",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Deleted",
        description: "Registration has been removed successfully",
      });
      onRegistrationsChange();
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Class', 'Game', 'Type', 'Team Name', 'Phone', 'In-Game ID', 'UID', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.full_name,
        reg.class_section,
        reg.game,
        reg.entry_type,
        reg.team_name || 'N/A',
        reg.phone_number,
        reg.in_game_id || 'N/A',
        reg.uid || 'N/A',
        new Date(reg.created_at).toLocaleDateString()
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
            <SelectTrigger className="bg-secondary border-border text-foreground w-40">
              <SelectValue placeholder="Filter by Game" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-border">
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="free-fire">Free Fire</SelectItem>
              <SelectItem value="codm">CODM</SelectItem>
              <SelectItem value="fc-mobile">FC Mobile</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
            <SelectTrigger className="bg-secondary border-border text-foreground w-40">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV} className="bg-success hover:bg-success">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Registrations List */}
      <div className="grid gap-4">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No registrations found
          </div>
        ) : (
          filteredRegistrations.map((registration) => (
            <Card key={registration.id} className="bg-secondary border-border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{registration.full_name}</h3>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {registration.class_section}
                      </Badge>
                      <Badge variant="outline" className="border-primary text-primary">
                        {registration.game.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground space-y-1">
                      <p><strong>Type:</strong> {registration.entry_type}</p>
                      {registration.team_name && <p><strong>Team:</strong> {registration.team_name}</p>}
                      <p><strong>Phone:</strong> {registration.phone_number}</p>
                      {registration.in_game_id && <p><strong>In-Game ID:</strong> {registration.in_game_id}</p>}
                      {registration.uid && <p><strong>UID:</strong> {registration.uid}</p>}
                      <p><strong>Registered:</strong> {new Date(registration.created_at).toLocaleString()}</p>
                      {registration.entry_type === 'team' && registration.members && (
                        <div>
                          <strong>Members:</strong>
                          <ul className="ml-4 mt-1">
                            <li>1. {registration.full_name} (Captain)</li>
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
