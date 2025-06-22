
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TeamMembersSectionProps {
  members: string[];
  onMemberChange: (index: number, value: string) => void;
}

const TeamMembersSection = ({ members, onMemberChange }: TeamMembersSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-gray-300">Team Members (Optional - up to 4 additional members)</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {members.map((member, index) => (
          <Input
            key={index}
            value={member}
            onChange={(e) => onMemberChange(index, e.target.value)}
            placeholder={`Member ${index + 2} name`}
            className="bg-slate-700 border-slate-600 text-white"
          />
        ))}
      </div>
    </div>
  );
};

export default TeamMembersSection;
