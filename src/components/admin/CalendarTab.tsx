
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MatchDay {
  id: number;
  date: Date;
  game: string;
  time: string;
  description: string;
  timestamp: string;
}

interface CalendarTabProps {
  matchDays: MatchDay[];
  onMatchDaysChange: (matchDays: MatchDay[]) => void;
}

const CalendarTab = ({ matchDays, onMatchDaysChange }: CalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [matchDetails, setMatchDetails] = useState({ game: '', time: '', description: '' });

  const addMatchDay = () => {
    if (selectedDate && matchDetails.game && matchDetails.time) {
      const newMatch = {
        id: Date.now(),
        date: selectedDate,
        ...matchDetails,
        timestamp: new Date().toISOString()
      };
      const updated = [...matchDays, newMatch];
      onMatchDaysChange(updated);
      localStorage.setItem('matchDays', JSON.stringify(updated));
      setSelectedDate(null);
      setMatchDetails({ game: '', time: '', description: '' });
      toast({
        title: "Match Scheduled",
        description: "Match day has been added successfully",
      });
    }
  };

  const deleteMatchDay = (id: number) => {
    const updated = matchDays.filter(match => match.id !== id);
    onMatchDaysChange(updated);
    localStorage.setItem('matchDays', JSON.stringify(updated));
    toast({
      title: "Match Deleted",
      description: "Match day has been removed",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white">Schedule Match Days</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-600 border-slate-500 text-white",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-gray-300">Game</Label>
            <Select value={matchDetails.game} onValueChange={(value) => setMatchDetails({...matchDetails, game: value})}>
              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                <SelectValue placeholder="Select Game" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="free-fire">Free Fire</SelectItem>
                <SelectItem value="codm">CODM</SelectItem>
                <SelectItem value="fc-mobile">FC Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Time</Label>
            <Input
              type="time"
              value={matchDetails.time}
              onChange={(e) => setMatchDetails({...matchDetails, time: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          <div>
            <Label className="text-gray-300">Description</Label>
            <Input
              value={matchDetails.description}
              onChange={(e) => setMatchDetails({...matchDetails, description: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
              placeholder="Match description (optional)"
            />
          </div>

          <Button onClick={addMatchDay} className="w-full bg-blue-600 hover:bg-blue-700">
            <Clock className="w-4 h-4 mr-2" />
            Schedule Match
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl text-white">Scheduled Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {matchDays.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No matches scheduled</p>
            ) : (
              matchDays.map((match) => (
                <div key={match.id} className="bg-slate-600/50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{match.game.replace('-', ' ').toUpperCase()}</p>
                    <p className="text-gray-300 text-sm">{format(new Date(match.date), "PPP")} at {match.time}</p>
                    {match.description && <p className="text-gray-400 text-sm">{match.description}</p>}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMatchDay(match.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarTab;
