
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import BasicInfoSection from '@/components/registration/BasicInfoSection';
import GameSelectionSection from '@/components/registration/GameSelectionSection';
import EntryTypeSection from '@/components/registration/EntryTypeSection';
import ContactInfoSection from '@/components/registration/ContactInfoSection';
import GameInfoSection from '@/components/registration/GameInfoSection';
import TeamMembersSection from '@/components/registration/TeamMembersSection';
import AdminSection from '@/components/registration/AdminSection';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNo: '', // <-- Add this
    classSection: '',
    game: '',
    entryType: 'solo',
    teamName: '',
    teamUid: '',
    phoneNumber: '',
    inGameId: '',
    uid: '',
    password: '',
    members: ['', '', '', ''],
    customTeamId: ''
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: games = [] } = useQuery({
    queryKey: ['registrationGames'],
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

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let teamNumber;
      
      // Use custom team ID if admin mode is enabled and custom ID is provided
      if (isAdminMode && formData.customTeamId.trim()) {
        // Check if custom team ID already exists
        const { data: existingTeam } = await supabase
          .from('registrations')
          .select('team_number')
          .eq('team_number', formData.customTeamId.trim())
          .single();

        if (existingTeam) {
          toast({
            title: "Registration Failed",
            description: "Custom team ID already exists. Please choose a different one.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        teamNumber = formData.customTeamId.trim();
      } else {
        // Generate team number from database function
        const { data: teamNumberData, error: teamNumberError } = await supabase
          .rpc('generate_team_number');

        if (teamNumberError) {
          throw teamNumberError;
        }
        teamNumber = teamNumberData;
      }

      // Prepare registration data
            const registrationData = {
        full_name: formData.fullName,
        admission_no: formData.admissionNo.trim(), // <-- Add this
        class_section: formData.classSection,
        game: formData.game,
        entry_type: formData.entryType,
        team_name: formData.entryType === 'team' ? formData.teamName : null,
        team_uid: formData.entryType === 'team' ? formData.teamUid : null,
        phone_number: formData.phoneNumber,
        in_game_id: formData.inGameId || null,
        uid: formData.uid || null,
        team_number: teamNumber,
        password_hash: formData.password,
        members: formData.entryType === 'team' ? formData.members.filter(m => m.trim()) : null
      };


      const { error } = await supabase
        .from('registrations')
        .insert(registrationData);

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful!",
          description: `Your team number is ${teamNumber}. Please save this for login.`,
        });
        
        alert(`🎉 Registration Successful!\n\nYour Login Credentials:\nTeam Number: ${teamNumber}\nPassword: ${formData.password}\n\nPlease save these credentials to access your team dashboard.`);
        
        // Reset form
        setFormData({
          fullName: '',
          classSection: '',
          game: '',
          entryType: 'solo',
          teamName: '',
          teamUid: '',
          phoneNumber: '',
          inGameId: '',
          uid: '',
          password: '',
          members: ['', '', '', ''],
          customTeamId: ''
        });
        setIsAdminMode(false);
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl py-14">
          <div className="font-mono-tag text-xs uppercase tracking-widest text-muted-foreground">Sapience eSports Cup 2025</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold uppercase">Register</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">Solo or squad. You'll get a team number and use your password to log in and track your stats.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-4xl pb-20">
        <form onSubmit={handleSubmit}>
              <section className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-border">
                <div>
                  <div className="font-mono-tag text-xs text-primary">01</div>
                  <div className="font-display uppercase tracking-wider text-sm mt-1">Player</div>
                </div>
                <div className="space-y-4">

              <BasicInfoSection 
                formData={{ fullName: formData.fullName, classSection: formData.classSection }}
                onInputChange={handleInputChange}
              />
                </div>
              </section>
              <section className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-border">
                <div>
                  <div className="font-mono-tag text-xs text-primary">02</div>
                  <div className="font-display uppercase tracking-wider text-sm mt-1">Title</div>
                </div>
                <div className="space-y-4">


              <GameSelectionSection 
                games={games}
                selectedGame={formData.game}
                onGameChange={(value) => handleInputChange('game', value)}
              />
                </div>
              </section>
              <section className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-border">
                <div>
                  <div className="font-mono-tag text-xs text-primary">03</div>
                  <div className="font-display uppercase tracking-wider text-sm mt-1">Entry</div>
                </div>
                <div className="space-y-4">


              <EntryTypeSection 
                entryType={formData.entryType}
                teamName={formData.teamName}
                teamUid={formData.teamUid}
                onEntryTypeChange={(value) => handleInputChange('entryType', value)}
                onTeamNameChange={(value) => handleInputChange('teamName', value)}
                onTeamUidChange={(value) => handleInputChange('teamUid', value)}
              />

              {formData.entryType === 'team' && (
                <TeamMembersSection 
                  members={formData.members}
                  onMemberChange={handleMemberChange}
                />
              )}
                </div>
              </section>
              <section className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-border">
                <div>
                  <div className="font-mono-tag text-xs text-primary">04</div>
                  <div className="font-display uppercase tracking-wider text-sm mt-1">In-game</div>
                </div>
                <div className="space-y-4">


              <GameInfoSection 
                inGameId={formData.inGameId}
                uid={formData.uid}
                onInGameIdChange={(value) => handleInputChange('inGameId', value)}
                onUidChange={(value) => handleInputChange('uid', value)}
              />
                </div>
              </section>
              <section className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-border">
                <div>
                  <div className="font-mono-tag text-xs text-primary">05</div>
                  <div className="font-display uppercase tracking-wider text-sm mt-1">Account</div>
                </div>
                <div className="space-y-4">


              <ContactInfoSection 
                phoneNumber={formData.phoneNumber}
                password={formData.password}
                onPhoneChange={(value) => handleInputChange('phoneNumber', value)}
                onPasswordChange={(value) => handleInputChange('password', value)}
              />
                </div>
              </section>
              <section className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-border">
                <div>
                  <div className="font-mono-tag text-xs text-primary">06</div>
                  <div className="font-display uppercase tracking-wider text-sm mt-1">Admin</div>
                </div>
                <div className="space-y-4">


              <AdminSection 
                customTeamId={formData.customTeamId}
                isAdminMode={isAdminMode}
                onCustomTeamIdChange={(value) => handleInputChange('customTeamId', value)}
                onAdminModeChange={setIsAdminMode}
              />
                </div>
              </section>
              <div className="pt-8 flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto uppercase tracking-wider font-display px-10">
                  {isSubmitting ? 'Registering…' : 'Submit registration'}
                </Button>
              </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
