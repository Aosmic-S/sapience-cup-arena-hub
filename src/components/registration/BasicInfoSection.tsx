
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoSectionProps {
  formData: {
    fullName: string;
    classSection: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoSection = ({ formData, onInputChange }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange('fullName', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="classSection" className="text-gray-300">Class/Section *</Label>
        <Input
          id="classSection"
          value={formData.classSection}
          onChange={(e) => onInputChange('classSection', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="e.g., 12-A"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
