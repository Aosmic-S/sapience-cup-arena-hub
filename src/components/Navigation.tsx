import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Register', path: '/register' },
  { name: 'Brackets', path: '/brackets' },
  { name: 'Schedule', path: '/calendar' },
  { name: 'Rules', path: '/rules' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Team Login', path: '/team-login' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-primary rotate-45 shadow-[0_0_8px_hsl(var(--primary))]" />
          <span className="font-display font-bold uppercase tracking-wider text-sm md:text-base">
            Sapience<span className="text-primary">/</span>Cup
          </span>
          <span className="font-mono-tag text-[10px] text-muted-foreground uppercase px-1.5 py-0.5 rounded border border-border">
            2026
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-1.5 text-sm rounded font-medium transition-colors',
                pathname === item.path ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}

          {/* Admin Console Quick Link */}
          <Link
            to="/admin"
            className={cn(
              'ml-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-tag uppercase tracking-wider rounded border transition-all',
              pathname === '/admin'
                ? 'border-primary/80 bg-primary/10 text-primary'
                : 'border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-card/60'
            )}
            title="Tournament Organizer Console"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="lg:hidden p-2 text-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-6 py-3 font-display uppercase tracking-wider text-sm border-b border-border/60 transition-colors',
                pathname === item.path ? 'text-primary bg-primary/5 font-bold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Admin Link */}
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-6 py-3.5 font-mono-tag uppercase tracking-wider text-xs text-primary bg-primary/10 border-b border-primary/20"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              Organizer / Admin Panel
            </span>
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Staff</span>
          </Link>
        </div>
      )}
    </nav>
  );
};
