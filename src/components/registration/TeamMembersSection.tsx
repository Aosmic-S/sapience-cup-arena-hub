
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TeamMembersSectionProps {
  members: string[];
  onMemberChange: (index: number, value: string) => void;
}

const TeamMembersSection = ({ members, onMemberChange }: TeamMembersSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground">Team Members (Optional - up to 4 additional members)</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {members.map((member, index) => (
          <Input
            key={index}
            value={member}
            onChange={(e) => onMemberChange(index, e.target.value)}
            placeholder={`Member ${index + 2} name`}
            className="bg-secondary border-border text-foreground"
          />
        ))}
      </div>
    </div>
  );
};

export default TeamMembersSection;
