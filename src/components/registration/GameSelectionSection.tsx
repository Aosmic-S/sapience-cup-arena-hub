
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
      <Label className="text-muted-foreground">Game *</Label>
      <Select value={selectedGame} onValueChange={onGameChange}>
        <SelectTrigger className="bg-secondary border-border text-foreground">
          <SelectValue placeholder="Select a game" />
        </SelectTrigger>
        <SelectContent className="bg-secondary border-border">
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
