import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Upload, Copy, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayer } from '@/hooks/usePlayer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Registration } from './RegistrationsTab';
interface Flag { severity: 'high' | 'medium' | 'low'; category: string; recordIds: string[]; explanation: string; recommendedAction: string }
interface Report { overview: string; flags: Flag[] }
export default function RegistrationAuditModal({ open, onOpenChange, registrations }: { open: boolean; onOpenChange: (value: boolean) => void; registrations: Registration[] }) {
  const { user } = usePlayer();
  const [mode, setMode] = useState('current');
  const [source, setSource] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const { data: staff, isLoading } = useQuery({ queryKey: ['registrationReviewStaffAccess', user?.id], enabled: open && Boolean(user), queryFn: async () => { if (!user) return false; const { data, error } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }); if (error) throw error; return data === true; } });
  const run = async () => {
    setBusy(true); setError(''); setReport(null); setCopied(false);
    controller.current = new AbortController();
    try {
      let records: unknown;
      if (mode === 'supplied') { try { records = JSON.parse(source); } catch { throw new Error('Provide records as a JSON array.'); } }
      else {
        const { data: roster, error: rosterError } = await supabase.from('team_members').select('id,team_number,full_name,admission_no,class_section,in_game_id,uid,phone_number');
        if (rosterError) throw rosterError;
        records = [...registrations.map(registration => ({ id: registration.id, team_number: registration.team_number || '', game: registration.game, full_name: registration.full_name, admission_no: registration.admission_no || '', class_section: registration.class_section, in_game_id: registration.in_game_id || '', uid: registration.uid || '', phone_number: registration.phone_number })), ...(roster || []).map(member => ({ ...member, game: 'bgmi' }))];
      }
      if (!Array.isArray(records) || records.length < 1 || records.length > 300) throw new Error('Provide between 1 and 300 records per review.');
      setCount(records.length);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sign in with your staff account first.');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audit-registrations`, { method: 'POST', signal: controller.current.signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }, body: JSON.stringify({ registrations: records }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error?.message || body.error || body.message || `Review unavailable (${response.status}).`); }
      if (!response.body) throw new Error('No review response received.');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let output = ''; let completed = false;
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary;
        while ((boundary = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, boundary).trim(); buffer = buffer.slice(boundary + 1);
          if (!line.startsWith('data:') || line === 'data: [DONE]') continue;
          const event = JSON.parse(line.slice(5).trim());
          if (event.type === 'response.output_text.delta') output += event.delta;
          if (event.type === 'response.completed') completed = true;
          if (event.type === 'error' || event.type === 'response.failed') throw new Error(event.message || event.error?.message || event.response?.error?.message || 'Review failed.');
          if (event.type === 'response.refusal.delta' || event.type === 'response.incomplete') throw new Error('The review could not be completed. No report was produced.');
        }
      }
      if (!completed || !output.trim()) throw new Error('The review did not return a complete report.');
      const parsed = JSON.parse(output);
      if (typeof parsed.overview !== 'string' || !Array.isArray(parsed.flags)) throw new Error('Invalid review report.');
      setReport(parsed);
    } catch (e) { if (e instanceof Error && e.name !== 'AbortError') setError(e.message); }
    finally { setBusy(false); controller.current = null; }
  };
  const flags = report?.flags.filter(flag => filter === 'all' || flag.severity === filter) || [];
  return <Dialog open={open} onOpenChange={value => { if (!value) controller.current?.abort(); onOpenChange(value); }}><DialogContent className="max-w-3xl w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle className="flex gap-2 items-center"><Sparkles className="w-5 h-5 text-primary"/>Registration review</DialogTitle><DialogDescription>AI findings are suggestions for referee review, not proof of misconduct. No entry is changed automatically.</DialogDescription></DialogHeader>
    {!user ? <Button asChild variant="outline"><Link to="/player-login">Sign in with a staff account</Link></Button> : isLoading ? <p className="text-sm text-muted-foreground">Checking staff access…</p> : !staff ? <p className="text-sm text-warning">Your account needs staff approval before reviewing records. The console password alone does not grant this access.</p> : <><Tabs value={mode} onValueChange={value => { setMode(value); setReport(null); setError(''); }}><TabsList><TabsTrigger value="current">Current entries</TabsTrigger><TabsTrigger value="supplied">Provided records</TabsTrigger></TabsList></Tabs>{mode === 'current' ? <p className="text-sm text-muted-foreground">{registrations.length} tournament entries, including their BGMI rosters.</p> : <div className="space-y-3"><Label htmlFor="auditRecords">Registration records · JSON array</Label><Textarea id="auditRecords" className="font-mono text-xs min-h-40" value={source} onChange={event => setSource(event.target.value)} placeholder={'[{"id":"entry-1","game":"bgmi","admission_no":"1234","uid":"51234567"}]'}/><input ref={fileInput} type="file" accept=".json,application/json" className="hidden" onChange={async event => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 200000) { setError('Choose a JSON file smaller than 200 KB.'); return; } setSource(await file.text()); setReport(null); }}/><Button variant="outline" size="sm" onClick={() => fileInput.current?.click()}><Upload/>Upload JSON</Button></div>}
      <div className="flex gap-3"><Button disabled={busy || (mode === 'current' && !registrations.length)} onClick={() => void run()}><Sparkles/>{busy ? 'Reviewing…' : 'Review records'}</Button>{busy && <Button variant="outline" onClick={() => controller.current?.abort()}><Square/>Stop</Button>}</div>
    </>}
    {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
    {report && <section className="border-t border-border pt-5"><div className="flex items-center justify-between gap-3"><p className="section-label">{count} records reviewed · {report.flags.length} findings</p><Button variant="ghost" size="icon" aria-label="Copy review report" onClick={async () => { try { await navigator.clipboard.writeText(JSON.stringify(report, null, 2)); setCopied(true); } catch { setError('Could not copy the report.'); } }}><Copy/></Button></div>{copied && <p role="status" className="text-success text-xs">Report copied.</p>}<p className="text-sm mt-3 mb-5">{report.overview}</p><Tabs value={filter} onValueChange={setFilter}><TabsList className="flex-wrap h-auto"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="high">High</TabsTrigger><TabsTrigger value="medium">Medium</TabsTrigger><TabsTrigger value="low">Low</TabsTrigger></TabsList></Tabs>{flags.length ? flags.map((flag, index) => <article key={index} className="py-5 border-b border-border"><p className={flag.severity === 'high' ? 'text-destructive text-xs uppercase' : flag.severity === 'medium' ? 'text-warning text-xs uppercase' : 'text-muted-foreground text-xs uppercase'}>{flag.severity} · {flag.category}</p><p className="text-sm mt-2">{flag.explanation}</p><p className="text-xs text-muted-foreground mt-3 break-all">Records: {flag.recordIds.join(', ')}</p><p className="text-sm text-muted-foreground mt-2">{flag.recommendedAction}</p></article>) : <p className="text-muted-foreground text-sm py-5">No findings in this view.</p>}</section>}
  </DialogContent></Dialog>;
}
