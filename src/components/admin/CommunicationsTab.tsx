
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Mail, Bell, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailTemplate {
  subject: string;
  message: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
}

interface CommunicationsTabProps {
  emailTemplate: EmailTemplate;
  onEmailTemplateChange: (template: EmailTemplate) => void;
  announcements: Announcement[];
  onAnnouncementsChange: () => void;
  registrationCount: number;
}

const CommunicationsTab = ({ 
  emailTemplate, 
  onEmailTemplateChange, 
  announcements, 
  onAnnouncementsChange,
  registrationCount 
}: CommunicationsTabProps) => {
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal' });

  const sendBulkEmail = () => {
    toast({
      title: "Emails Sent",
      description: `Bulk email sent to ${registrationCount} participants`,
    });
  };

  const addAnnouncement = async () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const { error } = await supabase.from('announcements').insert([{...newAnnouncement}]);
      
      if (error) {
        toast({ title: "Error Adding Announcement", description: error.message, variant: "destructive" });
      } else {
        onAnnouncementsChange();
        setNewAnnouncement({ title: '', content: '', priority: 'normal' });
        toast({ title: "Announcement Added", description: "New announcement has been created" });
      }
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);

    if (error) {
      toast({ title: "Error Deleting Announcement", description: error.message, variant: "destructive" });
    } else {
      onAnnouncementsChange();
      toast({ title: "Announcement Deleted", description: "Announcement has been removed" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Bulk Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Subject</Label>
            <Input
              value={emailTemplate.subject}
              onChange={(e) => onEmailTemplateChange({...emailTemplate, subject: e.target.value})}
              className="bg-secondary border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Message</Label>
            <textarea
              value={emailTemplate.message}
              onChange={(e) => onEmailTemplateChange({...emailTemplate, message: e.target.value})}
              className="w-full h-32 bg-secondary border-border text-foreground rounded-md p-3"
            />
          </div>
          <Button onClick={sendBulkEmail} className="w-full bg-success hover:bg-success">
            <Mail className="w-4 h-4 mr-2" />
            Send to All Participants ({registrationCount})
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Title</Label>
            <Input
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              className="bg-secondary border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Content</Label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              className="w-full h-24 bg-secondary border-border text-foreground rounded-md p-3"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Priority</Label>
            <Select 
              value={newAnnouncement.priority} 
              onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addAnnouncement} className="w-full bg-primary hover:bg-primary/90">
            <Bell className="w-4 h-4 mr-2" />
            Add Announcement
          </Button>
          
          <div className="mt-4 space-y-2">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="bg-secondary p-2 rounded flex justify-between items-center">
                <div>
                  <p className="text-foreground text-sm font-medium">{announcement.title}</p>
                  <Badge variant={announcement.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                    {announcement.priority}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAnnouncement(announcement.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationsTab;
