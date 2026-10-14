
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
        <Label htmlFor="fullName" className="text-muted-foreground">Full Name *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange('fullName', e.target.value)}
          className="bg-secondary border-border text-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="classSection" className="text-muted-foreground">Class/Section *</Label>
        <Input
          id="classSection"
          value={formData.classSection}
          onChange={(e) => onInputChange('classSection', e.target.value)}
          className="bg-secondary border-border text-foreground"
          placeholder="e.g., 12-A"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
