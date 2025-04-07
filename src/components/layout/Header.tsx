
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full bg-cinema-navy/90 backdrop-blur-md border-b border-border">
      <div className="cinema-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-cinema-white">CIHAN</span>
          <span className="text-sm text-cinema-red uppercase tracking-wider">Cinema</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-cinema-white hover:text-cinema-red transition-colors">Home</Link>
          <Link to="/movies" className="text-cinema-white hover:text-cinema-red transition-colors">Movies</Link>
          <Link to="/news" className="text-cinema-white hover:text-cinema-red transition-colors">News</Link>
        </nav>
        
        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-cinema-white hover:text-cinema-red transition-colors">
            <Search size={20} />
          </button>
          <Button variant="ghost" className="text-cinema-white hover:text-cinema-red transition-colors">
            <User size={20} />
          </Button>
          <Button className="bg-cinema-red hover:bg-opacity-90 text-white">
            Sign In
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-cinema-white"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden fixed inset-0 top-16 z-40 bg-cinema-navy/95 backdrop-blur-md transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col p-6 space-y-6">
          <Link 
            to="/" 
            className="text-cinema-white text-lg hover:text-cinema-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className="text-cinema-white text-lg hover:text-cinema-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Movies
          </Link>
          <Link 
            to="/news" 
            className="text-cinema-white text-lg hover:text-cinema-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            News
          </Link>
          <div className="pt-4 border-t border-muted">
            <Button className="w-full bg-cinema-red hover:bg-opacity-90 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
