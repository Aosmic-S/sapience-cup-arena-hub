
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
        <Label htmlFor="inGameId" className="text-muted-foreground">In-Game ID</Label>
        <Input
          id="inGameId"
          value={inGameId}
          onChange={(e) => onInGameIdChange(e.target.value)}
          className="bg-secondary border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uid" className="text-muted-foreground">UID</Label>
        <Input
          id="uid"
          value={uid}
          onChange={(e) => onUidChange(e.target.value)}
          className="bg-secondary border-border text-foreground"
        />
      </div>
    </div>
  );
};

export default GameInfoSection;
