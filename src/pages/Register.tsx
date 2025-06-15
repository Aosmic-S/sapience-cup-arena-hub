import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { UserPlus, GamepadIcon, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  fullName: string;
  classSection: string;
  game: string;
  entryType: string;
  teamName: string;
  email: string;
  phoneNumber: string;
  paymentConfirmation: string;
  inGameId: string;
  uid: string;
  members: string[];
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    classSection: '',
    game: '',
    entryType: 'solo',
    teamName: '',
    email: '',
    phoneNumber: '',
    paymentConfirmation: '',
    inGameId: '',
    uid: '',
    members: ['', '', '', '']
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.classSection) newErrors.classSection = 'Class & Section is required';
    if (!formData.game) newErrors.game = 'Please select a game';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.paymentConfirmation.trim()) newErrors.paymentConfirmation = 'Payment confirmation is required';
    if (!formData.inGameId.trim()) newErrors.inGameId = 'In-Game ID is required';
    if (!formData.uid.trim()) newErrors.uid = 'UID is required';

    if (formData.entryType === 'team') {
      if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
      
      const filledMembers = formData.members.filter(member => member.trim() !== '');
      if (filledMembers.length > 4) {
        newErrors.members = ['Maximum 4 additional members allowed (5 total including captain)'];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    // Save to Supabase
    const { error } = await supabase
      .from('registrations')
      .insert([
        { 
          full_name: formData.fullName,
          class_section: formData.classSection,
          game: formData.game,
          entry_type: formData.entryType,
          team_name: formData.entryType === 'team' ? formData.teamName : null,
          phone_number: formData.phoneNumber,
          in_game_id: formData.inGameId,
          uid: formData.uid,
          members: formData.entryType === 'team' ? formData.members.filter(m => m.trim() !== '') : null,
        }
      ]);
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Successful!",
      description: "Your registration has been submitted successfully.",
    });

    // Reset form
    setFormData({
      fullName: '',
      classSection: '',
      game: '',
      entryType: 'solo',
      teamName: '',
      email: '',
      phoneNumber: '',
      paymentConfirmation: '',
      inGameId: '',
      uid: '',
      members: ['', '', '', '']
    });
    setErrors({});
  };

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    updateFormData('members', newMembers);
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
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
              </div>

              {/* Class & Section */}
              <div>
                <Label htmlFor="classSection" className="text-gray-300">Class & Section *</Label>
                <Select value={formData.classSection} onValueChange={(value) => updateFormData('classSection', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="9-A">Class 9-A</SelectItem>
                    <SelectItem value="9-B">Class 9-B</SelectItem>
                    <SelectItem value="10-A">Class 10-A</SelectItem>
                    <SelectItem value="10-B">Class 10-B</SelectItem>
                    <SelectItem value="11-A">Class 11-A</SelectItem>
                    <SelectItem value="11-B">Class 11-B</SelectItem>
                    <SelectItem value="12-A">Class 12-A</SelectItem>
                    <SelectItem value="12-B">Class 12-B</SelectItem>
                  </SelectContent>
                </Select>
                {errors.classSection && <p className="text-red-400 text-sm mt-1">{errors.classSection}</p>}
              </div>

              {/* Game Selection */}
              <div>
                <Label className="text-gray-300">Select Game *</Label>
                <Select value={formData.game} onValueChange={(value) => updateFormData('game', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Choose your game" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="free-fire">Free Fire</SelectItem>
                    <SelectItem value="codm">Call of Duty Mobile</SelectItem>
                    <SelectItem value="fc-mobile">FC Mobile</SelectItem>
                  </SelectContent>
                </Select>
                {errors.game && <p className="text-red-400 text-sm mt-1">{errors.game}</p>}
              </div>

              {/* In-Game ID */}
              <div>
                <Label htmlFor="inGameId" className="text-gray-300">In-Game ID *</Label>
                <Input
                  id="inGameId"
                  value={formData.inGameId}
                  onChange={(e) => updateFormData('inGameId', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your in-game ID"
                />
                {errors.inGameId && <p className="text-red-400 text-sm mt-1">{errors.inGameId}</p>}
              </div>

              {/* UID */}
              <div>
                <Label htmlFor="uid" className="text-gray-300">UID *</Label>
                <Input
                  id="uid"
                  value={formData.uid}
                  onChange={(e) => updateFormData('uid', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your UID"
                />
                {errors.uid && <p className="text-red-400 text-sm mt-1">{errors.uid}</p>}
              </div>

              {/* Entry Type */}
              <div>
                <Label className="text-gray-300">Entry Type *</Label>
                <RadioGroup 
                  value={formData.entryType} 
                  onValueChange={(value) => updateFormData('entryType', value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" className="border-slate-400" />
                    <Label htmlFor="solo" className="text-gray-300 flex items-center">
                      <GamepadIcon className="w-4 h-4 mr-1" />
                      Solo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="team" className="border-slate-400" />
                    <Label htmlFor="team" className="text-gray-300 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Team
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Team Details (conditional) */}
              {formData.entryType === 'team' && (
                <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <h3 className="text-lg font-semibold text-white">Team Details</h3>
                  
                  <div>
                    <Label htmlFor="teamName" className="text-gray-300">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) => updateFormData('teamName', e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                    {errors.teamName && <p className="text-red-400 text-sm mt-1">{errors.teamName}</p>}
                  </div>

                  <div>
                    <Label className="text-gray-300">Team Members (Max 5 total including you)</Label>
                    <div className="space-y-2 mt-2">
                      <div className="text-sm text-blue-400">
                        Member 1 (Captain): {formData.fullName || 'Your name will appear here'}
                      </div>
                      {formData.members.map((member, index) => (
                        <div key={index}>
                          <Input
                            placeholder={`Member ${index + 2} (Optional)`}
                            value={member}
                            onChange={(e) => updateMember(index, e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      ))}
                    </div>
                    {errors.members && Array.isArray(errors.members) && <p className="text-red-400 text-sm mt-1">{errors.members[0]}</p>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Payment Confirmation */}
              <div>
                <Label htmlFor="paymentConfirmation" className="text-gray-300">Payment Confirmation *</Label>
                <Input
                  id="paymentConfirmation"
                  value={formData.paymentConfirmation}
                  onChange={(e) => updateFormData('paymentConfirmation', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Transaction ID or confirmation details"
                />
                {errors.paymentConfirmation && <p className="text-red-400 text-sm mt-1">{errors.paymentConfirmation}</p>}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
                Register for Tournament
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
