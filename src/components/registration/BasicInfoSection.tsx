import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoSectionProps {
  formData: {
    fullName: string;
    classSection: string;
    admissionNo: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoSection = ({ formData, onInputChange }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-muted-foreground">Full Name *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange('fullName', e.target.value)}
          className="bg-secondary border-border text-foreground"
          placeholder="e.g. Arham Ali"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admissionNo" className="text-muted-foreground">Admission No. *</Label>
        <Input
          id="admissionNo"
          value={formData.admissionNo}
          onChange={(e) => onInputChange('admissionNo', e.target.value)}
          className="bg-secondary border-border text-foreground font-mono"
          placeholder="eg.1234"
          required
        />
        <p className="text-[11px] text-muted-foreground">School admission ID for academic eligibility</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="classSection" className="text-muted-foreground">Class & Section *</Label>
        <Input
          id="classSection"
          value={formData.classSection}
          onChange={(e) => onInputChange('classSection', e.target.value)}
          className="bg-secondary border-border text-foreground"
          placeholder="e.g. 10-A (Class 9+ only)"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
