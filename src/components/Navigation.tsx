import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert, Trophy, Shield } from 'lucide-react';
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

  // Hide global navigation on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between gap-2">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold uppercase tracking-wider text-xs md:text-sm leading-tight text-foreground">
              Sapience <span className="text-primary">eSports</span>
            </span>
            <span className="font-mono-tag text-[9px] text-muted-foreground uppercase tracking-widest leading-none">
              Cup 2026
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items (Screens >= 1024px) */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-1.5 text-xs font-display uppercase tracking-wider rounded transition-colors',
                pathname === item.path
                  ? 'text-primary font-bold bg-primary/10 border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons & Mobile Controls */}
        <div className="flex items-center gap-2">
          {/* Always Visible Admin Badge/Button on ALL screens */}
          <Link
            to="/admin"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-tag uppercase tracking-wider rounded border transition-all',
              pathname === '/admin'
                ? 'border-primary bg-primary text-black font-bold'
                : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary'
            )}
            title="Tournament Organizer Console"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {/* Mobile Hamburger Toggle (Screens < 1024px) */}
          <button
            className="lg:hidden p-2 text-foreground rounded hover:bg-card border border-border"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-4 h-4 text-primary" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Screens < 1024px) */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 font-display uppercase tracking-wider text-xs rounded border transition-colors',
                  pathname === item.path
                    ? 'text-primary bg-primary/10 border-primary/30 font-bold'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-card'
                )}
              >
                <span>{item.name}</span>
                {pathname === item.path && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            ))}

            {/* Mobile Admin Dedicated Card */}
            <div className="pt-2">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 font-mono-tag uppercase tracking-wider text-xs text-primary bg-primary/10 border border-primary/30 rounded"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Staff / Admin Control Center
                </span>
                <span className="text-[10px] bg-primary text-black px-1.5 py-0.5 rounded font-bold">
                  PASSCODE
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
