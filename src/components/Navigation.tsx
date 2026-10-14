import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-primary rotate-45" />
          <span className="font-display font-bold uppercase tracking-wider">Sapience<span className="text-primary">/</span>Cup</span>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-1.5 text-sm rounded transition-colors',
                pathname === item.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button className="lg:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-6 py-3 font-display uppercase tracking-wider text-sm border-b border-border',
                pathname === item.path ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
