
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Users, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    classSection: '',
    game: '',
    entryType: 'solo',
    teamName: '',
    members: ['', '', '', '', ''], // 5 members max
    phoneNumber: '',
    paymentConfirmation: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.classSection.trim()) newErrors.classSection = 'Class & Section is required';
    if (!formData.game) newErrors.game = 'Please select a game';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.paymentConfirmation.trim()) newErrors.paymentConfirmation = 'Payment confirmation is required';
    
    if (formData.entryType === 'team') {
      if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
      
      // Count non-empty member names
      const memberCount = formData.members.filter(member => member.trim()).length + 1; // +1 for registrant
      if (memberCount > 5) {
        newErrors.members = 'Maximum 5 team members allowed (including you)';
      }
      if (memberCount < 2) {
        newErrors.members = 'At least 2 team members required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    const registrationData = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Save to localStorage (simulating database)
    const existingRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    existingRegistrations.push(registrationData);
    localStorage.setItem('registrations', JSON.stringify(existingRegistrations));

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
      members: ['', '', '', '', ''],
      phoneNumber: '',
      paymentConfirmation: ''
    });
  };

  const updateMember = (index, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData({ ...formData, members: newMembers });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              Tournament Registration
            </CardTitle>
            <p className="text-gray-300 text-center">Fill in your details to join the competition</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                
                <div>
                  <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="classSection" className="text-gray-300">Class & Section *</Label>
                  <Input
                    id="classSection"
                    value={formData.classSection}
                    onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., 10-A, 11-B"
                  />
                  {errors.classSection && <p className="text-red-400 text-sm mt-1">{errors.classSection}</p>}
                </div>

                <div>
                  <Label className="text-gray-300">Game Selection *</Label>
                  <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="free-fire">Free Fire</SelectItem>
                      <SelectItem value="codm">Call of Duty Mobile</SelectItem>
                      <SelectItem value="fc-mobile">FC Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.game && <p className="text-red-400 text-sm mt-1">{errors.game}</p>}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Entry Type */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Entry Type
                </h3>
                
                <RadioGroup
                  value={formData.entryType}
                  onValueChange={(value) => setFormData({ ...formData, entryType: value })}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" className="border-slate-600" />
                    <Label htmlFor="solo" className="text-gray-300">Solo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="team" className="border-slate-600" />
                    <Label htmlFor="team" className="text-gray-300">Team</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Team Details */}
              {formData.entryType === 'team' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Team Details</h3>
                  
                  <div>
                    <Label htmlFor="teamName" className="text-gray-300">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter your team name"
                    />
                    {errors.teamName && <p className="text-red-400 text-sm mt-1">{errors.teamName}</p>}
                  </div>

                  <div>
                    <Label className="text-gray-300">Team Members (Max 5 including you)</Label>
                    <div className="space-y-2 mt-2">
                      <Input
                        value={formData.fullName}
                        readOnly
                        className="bg-slate-600 border-slate-500 text-gray-300"
                        placeholder="Member 1 (You) - Auto-filled"
                      />
                      {formData.members.map((member, index) => (
                        <Input
                          key={index}
                          value={member}
                          onChange={(e) => updateMember(index, e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder={`Member ${index + 2} (Optional)`}
                        />
                      ))}
                    </div>
                    {errors.members && <p className="text-red-400 text-sm mt-1">{errors.members}</p>}
                  </div>
                </div>
              )}

              {/* Payment Confirmation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Payment Confirmation</h3>
                <div>
                  <Label htmlFor="paymentConfirmation" className="text-gray-300">
                    Payment Details/Transaction ID *
                  </Label>
                  <Textarea
                    id="paymentConfirmation"
                    value={formData.paymentConfirmation}
                    onChange={(e) => setFormData({ ...formData, paymentConfirmation: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter transaction ID, UPI reference, or payment details"
                    rows={3}
                  />
                  {errors.paymentConfirmation && <p className="text-red-400 text-sm mt-1">{errors.paymentConfirmation}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
              >
                Submit Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
