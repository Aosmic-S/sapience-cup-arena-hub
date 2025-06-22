
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
    queryKey: ['games'],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center">
              <UserPlus className="w-8 h-8 mr-3" />
              Tournament Registration
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoSection 
                formData={{ fullName: formData.fullName, classSection: formData.classSection }}
                onInputChange={handleInputChange}
              />

              <GameSelectionSection 
                games={games}
                selectedGame={formData.game}
                onGameChange={(value) => handleInputChange('game', value)}
              />

              <EntryTypeSection 
                entryType={formData.entryType}
                teamName={formData.teamName}
                teamUid={formData.teamUid}
                onEntryTypeChange={(value) => handleInputChange('entryType', value)}
                onTeamNameChange={(value) => handleInputChange('teamName', value)}
                onTeamUidChange={(value) => handleInputChange('teamUid', value)}
              />

              <ContactInfoSection 
                phoneNumber={formData.phoneNumber}
                password={formData.password}
                onPhoneChange={(value) => handleInputChange('phoneNumber', value)}
                onPasswordChange={(value) => handleInputChange('password', value)}
              />

              <GameInfoSection 
                inGameId={formData.inGameId}
                uid={formData.uid}
                onInGameIdChange={(value) => handleInputChange('inGameId', value)}
                onUidChange={(value) => handleInputChange('uid', value)}
              />

              {formData.entryType === 'team' && (
                <TeamMembersSection 
                  members={formData.members}
                  onMemberChange={handleMemberChange}
                />
              )}

              <AdminSection 
                customTeamId={formData.customTeamId}
                isAdminMode={isAdminMode}
                onCustomTeamIdChange={(value) => handleInputChange('customTeamId', value)}
                onAdminModeChange={setIsAdminMode}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
              >
                {isSubmitting ? 'Registering...' : 'Register for Tournament'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
