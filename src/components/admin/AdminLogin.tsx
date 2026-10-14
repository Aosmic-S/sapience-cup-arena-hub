import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const ADMIN_PASSWORD = 'SAP@CUP';

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') onLogin();
  }, [onLogin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      onLogin();
      toast({ title: 'Welcome back', description: 'Admin console unlocked' });
    } else {
      toast({ title: 'Wrong password', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-md border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="h-2.5 w-2.5 bg-primary rotate-45" />
          <span className="font-display font-bold uppercase tracking-wider">Sapience<span className="text-primary">/</span>Console</span>
        </div>
        <label htmlFor="password" className="font-mono-tag text-[11px] uppercase tracking-widest text-muted-foreground">
          Access key
        </label>
        <div className="relative mt-2">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input id="password" type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 bg-background" />
        </div>
        <Button type="submit" className="w-full mt-6 uppercase tracking-wider font-display">Enter</Button>
        <Link to="/" className="block mt-6 text-center text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
      </form>
    </div>
  );
};

export default AdminLogin;
