
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Users, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    classSection: '',
    game: '',
    entryType: 'solo',
    teamName: '',
    phoneNumber: '',
    inGameId: '',
    uid: '',
    password: '',
    members: ['', '', '', ''] // Up to 4 additional members
  });
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
      // Get team number from database function
      const { data: teamNumberData, error: teamNumberError } = await supabase
        .rpc('generate_team_number');

      if (teamNumberError) {
        throw teamNumberError;
      }

      const teamNumber = teamNumberData;

      // Prepare registration data
      const registrationData = {
        full_name: formData.fullName,
        class_section: formData.classSection,
        game: formData.game,
        entry_type: formData.entryType,
        team_name: formData.entryType === 'team' ? formData.teamName : null,
        phone_number: formData.phoneNumber,
        in_game_id: formData.inGameId || null,
        uid: formData.uid || null,
        team_number: teamNumber,
        password_hash: formData.password, // In production, this should be properly hashed
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
        
        // Show team credentials in a more prominent way
        alert(`🎉 Registration Successful!\n\nYour Login Credentials:\nTeam Number: ${teamNumber}\nPassword: ${formData.password}\n\nPlease save these credentials to access your team dashboard.`);
        
        // Reset form
        setFormData({
          fullName: '',
          classSection: '',
          game: '',
          entryType: 'solo',
          teamName: '',
          phoneNumber: '',
          inGameId: '',
          uid: '',
          password: '',
          members: ['', '', '', '']
        });
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
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classSection" className="text-gray-300">Class/Section *</Label>
                  <Input
                    id="classSection"
                    value={formData.classSection}
                    onChange={(e) => handleInputChange('classSection', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., 12-A"
                    required
                  />
                </div>
              </div>

              {/* Game Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">Game *</Label>
                <Select value={formData.game} onValueChange={(value) => handleInputChange('game', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {games.map((game) => (
                      <SelectItem key={game.name} value={game.name}>
                        {game.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Entry Type */}
              <div className="space-y-3">
                <Label className="text-gray-300">Entry Type *</Label>
                <RadioGroup
                  value={formData.entryType}
                  onValueChange={(value) => handleInputChange('entryType', value)}
                  className="flex space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" className="border-purple-400" />
                    <Label htmlFor="solo" className="text-white flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Solo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="team" className="border-purple-400" />
                    <Label htmlFor="team" className="text-white flex items-center cursor-pointer">
                      <Users className="w-4 h-4 mr-2" />
                      Team
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Team Name (only if team entry) */}
              {formData.entryType === 'team' && (
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-gray-300">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => handleInputChange('teamName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required={formData.entryType === 'team'}
                  />
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Set Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Create a password for team login"
                    required
                  />
                </div>
              </div>

              {/* Game Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inGameId" className="text-gray-300">In-Game ID</Label>
                  <Input
                    id="inGameId"
                    value={formData.inGameId}
                    onChange={(e) => handleInputChange('inGameId', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uid" className="text-gray-300">UID</Label>
                  <Input
                    id="uid"
                    value={formData.uid}
                    onChange={(e) => handleInputChange('uid', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Team Members (only if team entry) */}
              {formData.entryType === 'team' && (
                <div className="space-y-4">
                  <Label className="text-gray-300">Team Members (Optional - up to 4 additional members)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.members.map((member, index) => (
                      <Input
                        key={index}
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder={`Member ${index + 2} name`}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    ))}
                  </div>
                </div>
              )}

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
