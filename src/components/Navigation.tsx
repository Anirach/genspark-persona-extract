import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, BarChart3, Users, Settings, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/ai-generation', label: 'AI Gen', icon: Wand2 },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/reviewer-admin', label: 'Admin', icon: Users },
    { path: '/system-dashboard', label: 'System', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Blog System</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/blog' && location.pathname.startsWith('/blog')) ||
                (item.path === '/ai-generation' && location.pathname.startsWith('/ai-generation'));

              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={cn(
                    "flex items-center gap-2",
                    isActive && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  <Link to={item.path}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};