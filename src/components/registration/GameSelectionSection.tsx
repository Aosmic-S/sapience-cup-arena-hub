
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Game {
  name: string;
  display_name: string;
}

interface GameSelectionSectionProps {
  games: Game[];
  selectedGame: string;
  onGameChange: (value: string) => void;
}

const GameSelectionSection = ({ games, selectedGame, onGameChange }: GameSelectionSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Game *</Label>
      <Select value={selectedGame} onValueChange={onGameChange}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Select a game" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          {games.map((game) => (
            <SelectItem key={game.name} value={game.name}>
              {game.display_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameSelectionSection;
