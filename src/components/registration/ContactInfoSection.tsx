
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoSectionProps {
  phoneNumber: string;
  password: string;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const ContactInfoSection = ({ phoneNumber, password, onPhoneChange, onPasswordChange }: ContactInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Set Password *</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Create a password for team login"
          required
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
