
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, Users } from 'lucide-react';

interface EntryTypeSectionProps {
  entryType: string;
  teamName: string;
  teamUid: string;
  onEntryTypeChange: (value: string) => void;
  onTeamNameChange: (value: string) => void;
  onTeamUidChange: (value: string) => void;
}

const EntryTypeSection = ({ 
  entryType, 
  teamName, 
  teamUid, 
  onEntryTypeChange, 
  onTeamNameChange, 
  onTeamUidChange 
}: EntryTypeSectionProps) => {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-gray-300">Entry Type *</Label>
        <RadioGroup
          value={entryType}
          onValueChange={onEntryTypeChange}
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

      {entryType === 'team' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-gray-300">Team Name *</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              required={entryType === 'team'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="teamUid" className="text-gray-300">Team UID</Label>
            <Input
              id="teamUid"
              value={teamUid}
              onChange={(e) => onTeamUidChange(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter team's unique identifier"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EntryTypeSection;
