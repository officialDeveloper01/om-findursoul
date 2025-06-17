
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Moon, Sun, Sparkles } from 'lucide-react';

interface CelestialHeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const CelestialHeader = ({ currentView, setCurrentView }: CelestialHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-amber-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="text-center fade-in">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-amber-500 floating" />
                <div className="absolute inset-0 w-8 h-8 bg-amber-400/20 rounded-full blur-sm"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mystic-text tracking-wider">ॐ</h1>
                <p className="text-sm text-amber-600 font-light tracking-widest -mt-1">HEAL YOUR SOUL</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Button 
              onClick={() => setCurrentView('form')}
              variant={currentView === 'form' ? 'default' : 'ghost'}
              className={`sacred-button text-white font-medium ${
                currentView === 'form' ? '' : 'bg-transparent text-slate-700 hover:text-amber-600'
              }`}
            >
              <Moon className="w-4 h-4 mr-2" />
              New Reading
            </Button>
            
            <Button 
              onClick={() => setCurrentView('search')}
              variant={currentView === 'search' ? 'default' : 'ghost'}
              className={`sacred-button text-white font-medium ${
                currentView === 'search' ? '' : 'bg-transparent text-slate-700 hover:text-amber-600'
              }`}
            >
              <Sun className="w-4 h-4 mr-2" />
              Search Records
            </Button>

            {/* User Info */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-amber-200">
              <span className="text-amber-900 text-sm font-medium">
                {user?.email?.split('@')[0]}
              </span>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm"
                className="border-amber-200 text-slate-600 hover:bg-amber-50 hover:border-amber-300"
              >
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
