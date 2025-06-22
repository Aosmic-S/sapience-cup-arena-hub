
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GameInfoSectionProps {
  inGameId: string;
  uid: string;
  onInGameIdChange: (value: string) => void;
  onUidChange: (value: string) => void;
}

const GameInfoSection = ({ inGameId, uid, onInGameIdChange, onUidChange }: GameInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="inGameId" className="text-gray-300">In-Game ID</Label>
        <Input
          id="inGameId"
          value={inGameId}
          onChange={(e) => onInGameIdChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uid" className="text-gray-300">UID</Label>
        <Input
          id="uid"
          value={uid}
          onChange={(e) => onUidChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
    </div>
  );
};

export default GameInfoSection;
