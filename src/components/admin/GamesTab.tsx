
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  display_name: string;
  color: string;
  description: string | null;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GamesTabProps {
  games: Game[];
  onGamesChange: () => void;
}

const GamesTab = ({ games, onGamesChange }: GamesTabProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    color: 'bg-primary',
    description: '',
    icon: 'gamepad',
    bracket_size: 32,
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      color: 'bg-primary',
      description: '',
      icon: 'gamepad',
      bracket_size: 32,
      is_active: true
    });
    setShowAddForm(false);
    setEditingGame(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.display_name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Name and Display Name are required", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingGame) {
        const { error } = await supabase
          .from('games')
          .update({
            name: formData.name.toLowerCase().replace(/\s+/g, '-'),
            display_name: formData.display_name,
            color: formData.color,
            bracket_size: formData.bracket_size,
            description: formData.description || null,
            icon: formData.icon,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGame.id);

        if (error) {
          console.error('Error updating game:', error);
          toast({ 
            title: "Error Updating Game", 
            description: error.message || "Failed to update game", 
            variant: "destructive" 
          });
        } else {
          toast({ title: "Game Updated", description: "Game has been updated successfully" });
          onGamesChange();
          resetForm();
        }
      } else {
        const { error } = await supabase
          .from('games')
          .insert([{
            name: formData.name.toLowerCase().replace(/\s+/g, '-'),
            display_name: formData.display_name,
            color: formData.color,
            bracket_size: formData.bracket_size,
            description: formData.description || null,
            icon: formData.icon,
            is_active: formData.is_active
          }]);

        if (error) {
          console.error('Error adding game:', error);
          toast({ 
            title: "Error Adding Game", 
            description: error.message || "Failed to add game", 
            variant: "destructive" 
          });
        } else {
          toast({ title: "Game Added", description: "New game has been added successfully" });
          onGamesChange();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      display_name: game.display_name,
      color: game.color,
      description: game.description || '',
      icon: game.icon,
      bracket_size: (game as any).bracket_size ?? 32,
      is_active: game.is_active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (gameId: string, gameName: string) => {
    if (window.confirm(`Are you sure you want to delete the game "${gameName}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', gameId);

        if (error) {
          console.error('Error deleting game:', error);
          toast({ 
            title: "Error Deleting Game", 
            description: error.message || "Failed to delete game", 
            variant: "destructive" 
          });
        } else {
          toast({ title: "Game Deleted", description: "Game has been deleted successfully" });
          onGamesChange();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({ 
          title: "Error", 
          description: "An unexpected error occurred", 
          variant: "destructive" 
        });
      }
    }
  };

  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ 
          is_active: !currentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', gameId);

      if (error) {
        console.error('Error updating game status:', error);
        toast({ 
          title: "Error Updating Game Status", 
          description: error.message || "Failed to update status", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Game Status Updated", 
          description: `Game has been ${!currentStatus ? 'activated' : 'deactivated'}` 
        });
        onGamesChange();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">Game Management</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              {editingGame ? 'Edit Game' : 'Add New Game'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-muted-foreground">Game Name (slug) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-secondary border-border text-foreground"
                    placeholder="e.g., free-fire"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="display_name" className="text-muted-foreground">Display Name *</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="bg-secondary border-border text-foreground"
                    placeholder="e.g., Free Fire"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Bracket Type</Label>
                <Select 
                  value={String(formData.bracket_size)} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bracket_size: Number(value) }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="32">32-team single elimination</SelectItem>
                    <SelectItem value="48">48-team single elimination (16 byes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Brief description of the game"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_active" className="text-muted-foreground">Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="bg-success hover:bg-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingGame ? 'Update Game' : 'Add Game')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Existing Games ({games.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No games found. Add your first game using the button above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">Game</TableHead>
                    <TableHead className="text-muted-foreground">Display Name</TableHead>
                    <TableHead className="text-muted-foreground">Description</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        <div className="border border-primary/40 text-primary font-mono-tag px-3 py-1 rounded text-sm inline-block">
                          {game.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{game.display_name}</TableCell>
                      <TableCell className="text-muted-foreground">{game.description || 'No description'}</TableCell>
                      <TableCell>
                        <Switch
                          checked={game.is_active}
                          onCheckedChange={() => toggleGameStatus(game.id, game.is_active)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(game)}
                            className="border-border text-muted-foreground hover:bg-secondary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(game.id, game.display_name)}
                            className="border-destructive text-destructive hover:bg-destructive hover:text-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamesTab;
