import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Trash2, Download, Ban, CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface Registration {
  id: string;
  full_name: string;
  admission_no?: string;
  class_section: string;
  game: string;
  entry_type: string;
  team_name?: string;
  team_number?: string;
  phone_number: string;
  in_game_id?: string;
  uid?: string;
  created_at: string;
  members?: string[];
  status?: 'active' | 'eliminated' | 'disqualified' | string;
  dq_reason?: string;
}

interface RegistrationsTabProps {
  registrations: Registration[];
  onRegistrationsChange: () => void;
}

const RegistrationsTab = ({ registrations, onRegistrationsChange }: RegistrationsTabProps) => {
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ game: 'all', status: 'all', type: 'all' });
  
  // DQ dialog state
  const [dqTarget, setDqTarget] = useState<Registration | null>(null);
  const [dqReason, setDqReason] = useState('Emulator / Unauthorized software');

  useEffect(() => {
    let filtered = [...registrations];

    if (filters.game !== 'all') {
      filtered = filtered.filter(reg => reg.game === filters.game);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(reg => (reg.status || 'active') === filters.status);
    }
    if (filters.type !== 'all') {
      filtered = filtered.filter(reg => reg.entry_type === filters.type);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.full_name?.toLowerCase().includes(q) ||
        reg.team_name?.toLowerCase().includes(q) ||
        reg.team_number?.toLowerCase().includes(q) ||
        reg.admission_no?.toLowerCase().includes(q) ||
        reg.phone_number?.includes(q)
      );
    }

    setFilteredRegistrations(filtered);
  }, [registrations, filters, search]);

  const updateTeamStatus = async (id: string, status: 'active' | 'eliminated' | 'disqualified', reason?: string) => {
    const payload: Record<string, any> = { status };
    if (status === 'disqualified') {
      payload.dq_reason = reason || 'Rule violation';
    } else {
      payload.dq_reason = null;
    }

    const { error } = await supabase.from('registrations').update(payload).eq('id', id);

    if (error) {
      toast({
        title: "Status Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Team marked as ${status.toUpperCase()}`,
        description: reason ? `Reason: ${reason}` : 'Status updated successfully',
      });
      setDqTarget(null);
      onRegistrationsChange();
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this team?')) return;
    const { error } = await supabase.from('registrations').delete().eq('id', id);

    if (error) {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Registration Deleted" });
      onRegistrationsChange();
    }
  };

  const exportToCSV = () => {
    const headers = ['Team #', 'Name', 'Admission No', 'Class', 'Game', 'Type', 'Team Name', 'Status', 'DQ Reason', 'Phone'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.team_number || 'N/A',
        `"${reg.full_name}"`,
        reg.admission_no || 'N/A',
        reg.class_section,
        reg.game,
        reg.entry_type,
        `"${reg.team_name || 'N/A'}"`,
        reg.status || 'active',
        `"${reg.dq_reason || ''}"`,
        reg.phone_number
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-registrations-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const statusCounts = {
    total: registrations.length,
    active: registrations.filter(r => (r.status || 'active') === 'active').length,
    eliminated: registrations.filter(r => r.status === 'eliminated').length,
    disqualified: registrations.filter(r => r.status === 'disqualified').length,
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Pill Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-xs font-mono uppercase text-muted-foreground">Total Enrolled</div>
          <div className="text-2xl font-bold font-display mt-1">{statusCounts.total}</div>
        </div>
        <div className="bg-card border border-primary/40 p-4 rounded-lg">
          <div className="text-xs font-mono uppercase text-primary">Active Teams</div>
          <div className="text-2xl font-bold font-display text-primary mt-1">{statusCounts.active}</div>
        </div>
        <div className="bg-card border border-amber-500/30 p-4 rounded-lg">
          <div className="text-xs font-mono uppercase text-amber-400">Out of Tournament</div>
          <div className="text-2xl font-bold font-display text-amber-400 mt-1">{statusCounts.eliminated}</div>
        </div>
        <div className="bg-card border border-destructive/40 p-4 rounded-lg">
          <div className="text-xs font-mono uppercase text-destructive">Disqualified (DQ)</div>
          <div className="text-2xl font-bold font-display text-destructive mt-1">{statusCounts.disqualified}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-wrap gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search team, name, ID, phone..."
              className="pl-9 bg-secondary border-border h-9"
            />
          </div>
          <Select value={filters.game} onValueChange={v => setFilters(f => ({ ...f, game: v }))}>
            <SelectTrigger className="w-[130px] bg-secondary border-border h-9">
              <SelectValue placeholder="Game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="bgmi">BGMI</SelectItem>
              <SelectItem value="fcmobile">FC Mobile</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
            <SelectTrigger className="w-[150px] bg-secondary border-border h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="eliminated">Out of Tourney</SelectItem>
              <SelectItem value="disqualified">Disqualified (DQ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2 border-border">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Teams List */}
      <div className="space-y-3">
        {filteredRegistrations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
            No registrations found matching the filters.
          </div>
        ) : (
          filteredRegistrations.map((reg) => {
            const isDQ = reg.status === 'disqualified';
            const isEliminated = reg.status === 'eliminated';

            return (
              <Card 
                key={reg.id} 
                className={`transition-all border ${
                  isDQ 
                    ? 'border-destructive/60 bg-destructive/5' 
                    : isEliminated 
                    ? 'border-border/60 bg-muted/20 opacity-75' 
                    : 'border-border bg-card'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Team Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary font-bold">
                          {reg.team_number || 'PENDING'}
                        </span>
                        <h4 className={`font-display font-bold text-base ${isDQ ? 'line-through text-destructive' : 'text-foreground'}`}>
                          {reg.team_name || reg.full_name}
                        </h4>

                        {/* Status Badges */}
                        {isDQ && (
                          <Badge variant="destructive" className="uppercase font-mono text-[10px] gap-1">
                            <Ban className="w-3 h-3" /> DQ: {reg.dq_reason || 'Disqualified'}
                          </Badge>
                        )}
                        {isEliminated && (
                          <Badge variant="outline" className="text-amber-400 border-amber-500/40 uppercase font-mono text-[10px] gap-1">
                            <XCircle className="w-3 h-3" /> Out of Tournament
                          </Badge>
                        )}
                        {(!reg.status || reg.status === 'active') && (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 uppercase font-mono text-[10px] gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </Badge>
                        )}
                        <Badge variant="secondary" className="uppercase font-mono text-[10px]">
                          {reg.game}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                        <span>Captain: <strong>{reg.full_name}</strong></span>
                        {reg.admission_no && <span>Adm No: <strong className="font-mono">{reg.admission_no}</strong></span>}
                        <span>Class: <strong>{reg.class_section}</strong></span>
                        <span>Phone: <strong className="font-mono">{reg.phone_number}</strong></span>
                        {reg.in_game_id && <span>IGN: <strong className="font-mono">{reg.in_game_id}</strong></span>}
                      </div>

                      {reg.members && reg.members.length > 0 && (
                        <div className="text-xs text-muted-foreground/80 mt-1">
                          Roster: {reg.members.join(' • ')}
                        </div>
                      )}
                    </div>

                    {/* Quick Management Buttons */}
                    <div className="flex items-center gap-2">
                      {isDQ || isEliminated ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => updateTeamStatus(reg.id, 'active')}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Re-instate Active
                        </Button>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                            onClick={() => updateTeamStatus(reg.id, 'eliminated')}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Mark Out
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 text-xs gap-1"
                            onClick={() => setDqTarget(reg)}
                          >
                            <Ban className="w-3.5 h-3.5" /> Disqualify
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteRegistration(reg.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Disqualification Reason Modal */}
      <Dialog open={!!dqTarget} onOpenChange={(open) => !open && setDqTarget(null)}>
        <DialogContent className="sm:max-w-[440px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-display text-lg">
              <AlertTriangle className="w-5 h-5" /> Disqualify Team
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              You are disqualifying <strong className="text-foreground">{dqTarget?.team_name || dqTarget?.full_name}</strong> ({dqTarget?.team_number}). They will be removed from tournament brackets and barred from matches.
            </p>

            <div className="space-y-2">
              <Label className="text-xs">Violation Reason</Label>
              <Select value={dqReason} onValueChange={setDqReason}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emulator / Unauthorized hardware">PC Emulator / Macro detected</SelectItem>
                  <SelectItem value="Unsportsmanlike conduct">Toxicity / Unsportsmanlike conduct</SelectItem>
                  <SelectItem value="No-show / Missed check-in">No-show / Exceeded grace period</SelectItem>
                  <SelectItem value="Ineligible player / Roll number mismatch">Ineligible player / Disciplinary record</SelectItem>
                  <SelectItem value="Cheating / Ringing">Impersonation / Roster violation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDqTarget(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => dqTarget && updateTeamStatus(dqTarget.id, 'disqualified', dqReason)}
            >
              Confirm Disqualification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationsTab;
