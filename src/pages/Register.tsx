import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Copy, 
  Check, 
  Trophy, 
  AlertTriangle, 
  ArrowRight, 
  Gamepad2, 
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ROLES = [
  { id: 'IGL', label: 'IGL (Leader)', desc: 'In-Game Shot Caller' },
  { id: 'Fragger', label: 'Assaulter / Fragger', desc: 'Frontline Entry' },
  { id: 'Sniper', label: 'DMR / Sniper', desc: 'Long-range Support' },
  { id: 'Scout', label: 'Scout / Flanker', desc: 'Info & Rotation' },
  { id: 'Support', label: 'Support / Healer', desc: 'Utility & Revives' }
];

const ADMIN_CODES = ['ADMIN2024', 'TOURNAMENT_ADMIN', 'ESPORTS_ADMIN'];

export default function Register() {
  const [selectedGame, setSelectedGame] = useState<'bgmi' | 'fc-mobile'>('bgmi');
  const [teamMode, setTeamMode] = useState<'create' | 'join'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Success state modal data
  const [registeredTeam, setRegisteredTeam] = useState<{
    teamNumber: string;
    teamName: string;
    game: string;
    mode: 'create' | 'join' | 'solo';
    slot?: number;
    password?: string;
  } | null>(null);

  // Join squad lookup state
  const [joinCode, setJoinCode] = useState('');
  const [isCheckingTeam, setIsCheckingTeam] = useState(false);
  const [verifiedTeam, setVerifiedTeam] = useState<{
    team_number: string;
    team_name: string;
    memberCount: number;
  } | null>(null);

  // Admin bypass
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [customTeamId, setCustomTeamId] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNo: '',
    classSection: '',
    phoneNumber: '',
    inGameId: '',
    uid: '',
    playerRole: 'IGL',
    playerRank: 'Crown',
    teamName: '',
    teamUid: '',
    password: '',
    // FC Mobile specific
    teamOvr: '100',
    fcDivision: 'Legendary'
  });

  const { data: games = [] } = useQuery({
    queryKey: ['registrationGamesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('name, display_name')
        .eq('is_active', true);
      if (error) throw error;
      return data || [];
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdminCodeCheck = () => {
    if (ADMIN_CODES.includes(adminCodeInput.trim().toUpperCase())) {
      setIsAdminUnlocked(true);
      toast({
        title: "Admin Code Unlocked",
        description: "Custom team ID override is now enabled.",
      });
    } else {
      toast({
        title: "Invalid Admin Code",
        description: "The code entered is not valid.",
        variant: "destructive"
      });
    }
  };

  // Verify Squad Code for Teammates Joining
  const handleVerifySquadCode = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      toast({ title: "Enter Team Code", description: "Please enter the captain's team code.", variant: "destructive" });
      return;
    }

    setIsCheckingTeam(true);
    try {
      const { data: team, error } = await supabase
        .from('registrations')
        .select('team_number, team_name, game')
        .eq('team_number', code)
        .maybeSingle();

      if (error || !team) {
        setVerifiedTeam(null);
        toast({
          title: "Team Not Found",
          description: `No squad found with code "${code}". Please check with your captain.`,
          variant: "destructive"
        });
        return;
      }

      if (team.game !== 'bgmi') {
        toast({
          title: "Invalid Squad",
          description: "This team code is not registered for BGMI squad tournament.",
          variant: "destructive"
        });
        return;
      }

      // Check member count in team_members table
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('id, slot')
        .eq('team_number', code);

      const count = (members && !membersError) ? members.length : 1;
      if (count >= 5) {
        toast({
          title: "Squad is Full",
          description: "This team already has the maximum roster capacity (4 starters + 1 substitute).",
          variant: "destructive"
        });
        return;
      }

      setVerifiedTeam({
        team_number: team.team_number,
        team_name: team.team_name || 'BGMI Squad',
        memberCount: count
      });

      // Default role to next available
      if (formData.playerRole === 'IGL') {
        setFormData(prev => ({ ...prev, playerRole: 'Fragger' }));
      }

      toast({
        title: "Squad Verified!",
        description: `Found ${team.team_name} (${count}/5 slots filled). Complete your registration below.`,
      });
    } catch (err) {
      toast({ title: "Verification Failed", description: "Could not look up squad. Try again.", variant: "destructive" });
    } finally {
      setIsCheckingTeam(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.admissionNo.trim()) {
      toast({ title: "Admission Number Required", description: "Please provide your school admission number.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // ==========================================
      // FLOW 1: Teammate Joining Existing BGMI Squad
      // ==========================================
      if (selectedGame === 'bgmi' && teamMode === 'join') {
        if (!verifiedTeam) {
          toast({ title: "Squad Not Verified", description: "Please verify your team code first.", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }

        const nextSlot = verifiedTeam.memberCount + 1;

        // Insert into team_members table
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_number: verifiedTeam.team_number,
            full_name: formData.fullName.trim(),
            admission_no: formData.admissionNo.trim(),
            class_section: formData.classSection.trim(),
            phone_number: formData.phoneNumber.trim(),
            in_game_id: formData.inGameId.trim(),
            uid: formData.uid.trim(),
            role: formData.playerRole,
            player_rank: formData.playerRank,
            slot: nextSlot
          });

        if (memberError) {
          // If already joined or DB error
          throw memberError;
        }

        setRegisteredTeam({
          teamNumber: verifiedTeam.team_number,
          teamName: verifiedTeam.team_name,
          game: 'BGMI',
          mode: 'join',
          slot: nextSlot
        });

        toast({
          title: "Joined Squad Successfully!",
          description: `You are registered as Player ${nextSlot} (${formData.playerRole}) for ${verifiedTeam.team_name}.`
        });
        return;
      }

      // ==========================================
      // FLOW 2: Captain Creating BGMI Squad OR FC Mobile Solo
      // ==========================================
      let assignedTeamNumber = '';

      if (isAdminUnlocked && customTeamId.trim()) {
        const { data: existing } = await supabase
          .from('registrations')
          .select('team_number')
          .eq('team_number', customTeamId.trim())
          .maybeSingle();

        if (existing) {
          toast({ title: "Custom ID Taken", description: "This Team ID already exists. Please pick another.", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        assignedTeamNumber = customTeamId.trim().toUpperCase();
      } else {
        const { data: generated, error: genError } = await supabase.rpc('generate_team_number');
        if (genError || !generated) {
          assignedTeamNumber = selectedGame === 'bgmi' 
            ? `BGMI-${Math.floor(1000 + Math.random() * 9000)}`
            : `FCM-${Math.floor(1000 + Math.random() * 9000)}`;
        } else {
          assignedTeamNumber = generated;
        }
      }

      const isBGMI = selectedGame === 'bgmi';
      const registrationPayload = {
        full_name: formData.fullName.trim(),
        admission_no: formData.admissionNo.trim(),
        class_section: formData.classSection.trim(),
        game: selectedGame,
        entry_type: isBGMI ? 'team' : 'solo',
        team_name: isBGMI ? formData.teamName.trim() : `${formData.fullName.trim()} (Solo)`,
        team_uid: isBGMI ? (formData.teamUid.trim() || null) : null,
        phone_number: formData.phoneNumber.trim(),
        in_game_id: formData.inGameId.trim(),
        uid: formData.uid.trim(),
        team_number: assignedTeamNumber,
        password_hash: formData.password.trim(),
        player_rank: isBGMI ? formData.playerRank : formData.fcDivision,
        team_ovr: !isBGMI && formData.teamOvr ? parseInt(formData.teamOvr, 10) : null,
        status: 'active'
      };

      const { error: regError } = await supabase
        .from('registrations')
        .insert(registrationPayload);

      if (regError) throw regError;

      // If BGMI, record Captain as Slot 1 in team_members
      if (isBGMI) {
        await supabase
          .from('team_members')
          .insert({
            team_number: assignedTeamNumber,
            full_name: formData.fullName.trim(),
            admission_no: formData.admissionNo.trim(),
            class_section: formData.classSection.trim(),
            phone_number: formData.phoneNumber.trim(),
            in_game_id: formData.inGameId.trim(),
            uid: formData.uid.trim(),
            role: 'IGL',
            player_rank: formData.playerRank,
            slot: 1
          });
      }

      setRegisteredTeam({
        teamNumber: assignedTeamNumber,
        teamName: isBGMI ? formData.teamName : formData.fullName,
        game: isBGMI ? 'BGMI' : 'EA SPORTS FC Mobile',
        mode: isBGMI ? 'create' : 'solo',
        password: formData.password
      });

      toast({
        title: "Registration Confirmed!",
        description: `Your ${isBGMI ? 'Team Code' : 'Player ID'} is ${assignedTeamNumber}.`
      });

    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message || "An unexpected error occurred. Please verify your details.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast({ title: "Copied!", description: `Team code ${text} copied to clipboard.` });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Banner */}
      <div className="border-b border-border/60 bg-gradient-to-b from-card/80 to-background/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl py-12">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs uppercase px-2.5 py-0.5">
              Official Tournament Registration
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs uppercase">
              Class 9+ Enrolled
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-display">
            Sapience eSports Cup 2026
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
            Register your squad for BGMI (4+1 roster) or enter solo for EA SPORTS FC™ Mobile. 
            All participants must use handheld mobile devices — PC emulators are strictly prohibited.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-8">
        {/* SUCCESS CONFIRMATION MODAL */}
        {registeredTeam && (
          <Card className="border-primary/50 bg-card/90 shadow-2xl mb-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase font-display">
                      {registeredTeam.mode === 'join' ? 'Joined Squad Successfully!' : 'Registration Confirmed!'}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {registeredTeam.mode === 'join' 
                        ? `You are registered for ${registeredTeam.teamName} as Player ${registeredTeam.slot}.`
                        : `Your tournament pass for ${registeredTeam.game} is active.`}
                    </p>
                  </div>
                </div>

                <Badge className="bg-primary text-primary-foreground font-mono px-3 py-1 text-sm">
                  {registeredTeam.game}
                </Badge>
              </div>

              {/* Digital Pass Card */}
              <div className="mt-6 p-5 rounded-lg bg-secondary/50 border border-border/80 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                    {registeredTeam.mode === 'solo' ? 'Solo Player ID' : 'Official Team Code (Share with Squad)'}
                  </div>
                  <div className="text-3xl md:text-4xl font-black font-mono text-primary tracking-wider mt-1">
                    {registeredTeam.teamNumber}
                  </div>
                  {registeredTeam.mode === 'create' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Give this code to your 3-4 teammates so they can choose <strong className="text-foreground">"Join Existing Squad"</strong>.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button 
                    onClick={() => copyToClipboard(registeredTeam.teamNumber)}
                    className="flex-1 md:flex-initial gap-2 font-mono uppercase text-xs"
                    variant="outline"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Copied' : 'Copy Code'}
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/team-login'}
                    className="flex-1 md:flex-initial gap-2 font-display uppercase text-xs"
                  >
                    Team Login <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setRegisteredTeam(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Register Another Player / Team
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: GAME SELECTION */}
          <Card className="border-border/80 bg-card/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs text-primary font-bold">01</span>
                <h2 className="text-base font-bold uppercase tracking-wider font-display">Select Game Title</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BGMI Card */}
                <div 
                  onClick={() => { setSelectedGame('bgmi'); }}
                  className={`cursor-pointer rounded-lg p-4 border transition-all ${
                    selectedGame === 'bgmi' 
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/40' 
                      : 'border-border/60 bg-secondary/30 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-base uppercase font-display">BGMI Squad Battle</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">4+1 Roster</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Custom Room Battle Royale. 32 teams cap. Handheld smartphones only, 4 starters + 1 substitute.
                  </p>
                </div>

                {/* FC Mobile Card */}
                <div 
                  onClick={() => { setSelectedGame('fc-mobile'); setTeamMode('create'); }}
                  className={`cursor-pointer rounded-lg p-4 border transition-all ${
                    selectedGame === 'fc-mobile' 
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/40' 
                      : 'border-border/60 bg-secondary/30 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="font-bold text-base uppercase font-display">EA SPORTS FC™ Mobile</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">1v1 Solo</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Head-to-Head & VSA 1v1 single elimination bracket. Individual player seeding by Team OVR.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: SQUAD MODE (BGMI ONLY) */}
          {selectedGame === 'bgmi' && (
            <Card className="border-border/80 bg-card/60 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs text-primary font-bold">02</span>
                  <h2 className="text-base font-bold uppercase tracking-wider font-display">Squad Registration Mode</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { setTeamMode('create'); setVerifiedTeam(null); }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      teamMode === 'create'
                        ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                        : 'border-border/60 bg-secondary/30 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold font-display uppercase text-sm">
                      <UserPlus className="w-4 h-4 text-primary" />
                      Create New Squad (Captain / IGL)
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      You will create the squad, get the unique <strong>Team Code</strong>, and invite your 3–4 teammates to join.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTeamMode('join')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      teamMode === 'join'
                        ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                        : 'border-border/60 bg-secondary/30 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold font-display uppercase text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      Join Existing Squad (Teammate)
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Enter the <strong>Team Code</strong> provided by your Captain to register your spot in the squad roster.
                    </p>
                  </button>
                </div>

                {/* JOIN SQUAD CODE VERIFIER */}
                {teamMode === 'join' && (
                  <div className="mt-6 p-4 rounded-lg bg-secondary/40 border border-border">
                    <Label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                      Enter Captain's Team Code *
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        placeholder="e.g. TEAM1001 or 6-digit code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="font-mono bg-background border-border text-foreground uppercase tracking-wider"
                      />
                      <Button 
                        type="button" 
                        onClick={handleVerifySquadCode}
                        disabled={isCheckingTeam || !joinCode.trim()}
                        className="gap-2 font-display uppercase text-xs"
                      >
                        <Search className="w-4 h-4" />
                        {isCheckingTeam ? 'Checking…' : 'Verify Squad'}
                      </Button>
                    </div>

                    {verifiedTeam && (
                      <div className="mt-3 p-3 rounded bg-primary/10 border border-primary/30 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-foreground uppercase font-display">
                            {verifiedTeam.team_name}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            Team Code: {verifiedTeam.team_number} • {verifiedTeam.memberCount}/5 Roster Slots Filled
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* SQUAD DETAILS (If creating squad) */}
          {selectedGame === 'bgmi' && teamMode === 'create' && (
            <Card className="border-border/80 bg-card/60 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs text-primary font-bold">03</span>
                  <h2 className="text-base font-bold uppercase tracking-wider font-display">Squad Identity</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="text-xs uppercase font-mono text-muted-foreground">Team / Clan Name *</Label>
                    <Input 
                      id="teamName"
                      placeholder="e.g. SAPIENCE WARRIORS"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange('teamName', e.target.value)}
                      className="bg-secondary/40 border-border text-foreground uppercase tracking-wide font-display font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamUid" className="text-xs uppercase font-mono text-muted-foreground">In-Game Clan UID (Optional)</Label>
                    <Input 
                      id="teamUid"
                      placeholder="e.g. 5182947192"
                      value={formData.teamUid}
                      onChange={(e) => handleInputChange('teamUid', e.target.value)}
                      className="bg-secondary/40 border-border text-foreground font-mono"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded border border-border/70 bg-secondary/20 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Official Roster Rule:</strong> Minimum 4 players required for match room eligibility. 
                    After submitting, you will receive a <strong>Team Code</strong>. Share it with your remaining squad members so they can register into your roster slots.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: PLAYER CREDENTIALS (Full Name, Admission No, Class 9+) */}
          <Card className="border-border/80 bg-card/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs text-primary font-bold">
                  {selectedGame === 'bgmi' ? '04' : '02'}
                </span>
                <h2 className="text-base font-bold uppercase tracking-wider font-display">
                  Student Verification (Class 9+)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs uppercase font-mono text-muted-foreground">Student Full Name *</Label>
                  <Input 
                    id="fullName"
                    placeholder="e.g. Arham Ali"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="bg-secondary/40 border-border text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admissionNo" className="text-xs uppercase font-mono text-muted-foreground">Admission No. *</Label>
                    <span className="text-[10px] text-primary font-mono">School ID</span>
                  </div>
                  <Input 
                    id="admissionNo"
                    placeholder="e.g. 1248"
                    value={formData.admissionNo}
                    onChange={(e) => handleInputChange('admissionNo', e.target.value)}
                    className="bg-secondary/40 border-border text-foreground font-mono"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Must match your school records for eligibility</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classSection" className="text-xs uppercase font-mono text-muted-foreground">Class & Section *</Label>
                  <Input 
                    id="classSection"
                    placeholder="e.g. 10-A (Class 9+ only)"
                    value={formData.classSection}
                    onChange={(e) => handleInputChange('classSection', e.target.value)}
                    className="bg-secondary/40 border-border text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-xs uppercase font-mono text-muted-foreground">WhatsApp / Contact Number *</Label>
                  <Input 
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="bg-secondary/40 border-border text-foreground font-mono"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">For custom room ID, schedule & referee alerts</p>
                </div>

                {/* Password only needed when creating team or solo */}
                {(teamMode === 'create' || selectedGame === 'fc-mobile') && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase font-mono text-muted-foreground">Team Dashboard Password *</Label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="Enter a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-secondary/40 border-border text-foreground font-mono"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">Used with your Team ID to view match rooms</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* STEP 4: IN-GAME DETAILS & ROLES */}
          <Card className="border-border/80 bg-card/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs text-primary font-bold">
                  {selectedGame === 'bgmi' ? '05' : '03'}
                </span>
                <h2 className="text-base font-bold uppercase tracking-wider font-display">
                  In-Game Profile & Identity
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inGameId" className="text-xs uppercase font-mono text-muted-foreground">
                    Exact In-Game Name (IGN) *
                  </Label>
                  <Input 
                    id="inGameId"
                    placeholder="e.g. SAPIENCE_DEVIL"
                    value={formData.inGameId}
                    onChange={(e) => handleInputChange('inGameId', e.target.value)}
                    className="bg-secondary/40 border-border text-foreground font-mono font-bold"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Must match in-room character name exactly</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uid" className="text-xs uppercase font-mono text-muted-foreground">
                    In-Game Numeric UID *
                  </Label>
                  <Input 
                    id="uid"
                    placeholder="e.g. 512398471"
                    value={formData.uid}
                    onChange={(e) => handleInputChange('uid', e.target.value)}
                    className="bg-secondary/40 border-border text-foreground font-mono"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Referees verify UID before approving entry</p>
                </div>
              </div>

              {/* BGMI Specific: Krafton Role Chips & Tier */}
              {selectedGame === 'bgmi' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="text-xs uppercase font-mono text-muted-foreground block mb-2">
                      Roster Tactical Role *
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {ROLES.map((role) => {
                        const isCaptainOnly = role.id === 'IGL';
                        const isSelected = formData.playerRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => handleInputChange('playerRole', role.id)}
                            className={`p-2.5 rounded border text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/20 text-primary'
                                : 'border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <div className="font-mono text-xs font-bold uppercase">{role.id}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{role.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="playerRank" className="text-xs uppercase font-mono text-muted-foreground">Current BGMI Rank / Tier</Label>
                      <select 
                        id="playerRank"
                        value={formData.playerRank}
                        onChange={(e) => handleInputChange('playerRank', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-secondary/40 border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Conqueror">Conqueror</option>
                        <option value="Ace Dominator">Ace Dominator</option>
                        <option value="Ace Master">Ace Master</option>
                        <option value="Ace">Ace</option>
                        <option value="Crown">Crown</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Platinum">Platinum or below</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* FC Mobile Specific: OVR & Division */}
              {selectedGame === 'fc-mobile' && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamOvr" className="text-xs uppercase font-mono text-muted-foreground">Active Team OVR *</Label>
                    <Input 
                      id="teamOvr"
                      type="number"
                      placeholder="e.g. 102"
                      value={formData.teamOvr}
                      onChange={(e) => handleInputChange('teamOvr', e.target.value)}
                      className="bg-secondary/40 border-border text-foreground font-mono"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">Overall team rating for balanced seeding</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fcDivision" className="text-xs uppercase font-mono text-muted-foreground">H2H Division / Rank *</Label>
                    <select 
                      id="fcDivision"
                      value={formData.fcDivision}
                      onChange={(e) => handleInputChange('fcDivision', e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-secondary/40 border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="FC Champion">FC Champion</option>
                      <option value="Legendary I/II/III">Legendary I/II/III</option>
                      <option value="World Class">World Class</option>
                      <option value="Pro">Pro</option>
                      <option value="Amateur">Amateur</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ADMIN OVERRIDE SECTION */}
          <div className="p-4 rounded-lg border border-border/40 bg-secondary/10">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase font-mono text-muted-foreground">Staff Admin Code Override</div>
              {!isAdminUnlocked ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Admin Code"
                    value={adminCodeInput}
                    onChange={(e) => setAdminCodeInput(e.target.value)}
                    className="h-8 text-xs font-mono uppercase w-40 bg-background"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAdminCodeCheck}
                    className="h-8 text-xs font-mono"
                  >
                    Unlock
                  </Button>
                </div>
              ) : (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                  Admin Unlocked
                </Badge>
              )}
            </div>

            {isAdminUnlocked && (
              <div className="mt-3 space-y-1">
                <Label htmlFor="customId" className="text-xs uppercase font-mono text-muted-foreground">Assign Custom Team ID</Label>
                <Input 
                  id="customId"
                  placeholder="e.g. SAPIENCE-01"
                  value={customTeamId}
                  onChange={(e) => setCustomTeamId(e.target.value.toUpperCase())}
                  className="bg-background border-border text-foreground font-mono uppercase h-9"
                />
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              By submitting, you agree to the official <strong>Sapience Cup 2026</strong> rules. Emulators are strictly banned.
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting || (selectedGame === 'bgmi' && teamMode === 'join' && !verifiedTeam)}
              className="w-full md:w-auto uppercase tracking-wider font-display px-10 gap-2 h-12 text-sm shadow-lg shadow-primary/20"
            >
              {isSubmitting ? 'Registering…' : (
                selectedGame === 'bgmi' && teamMode === 'join' 
                  ? 'Confirm Squad Spot' 
                  : 'Submit Official Registration'
              )}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
