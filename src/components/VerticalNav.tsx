
import { Home, User, Code, Mail, Briefcase, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const VerticalNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { icon: Home, label: 'Home', href: 'home' },
    { icon: User, label: 'About', href: 'about' },
    { icon: Code, label: 'Skills', href: 'skills' },
    { icon: Briefcase, label: 'Projects', href: 'projects' },
    { icon: Mail, label: 'Contact', href: 'contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="glass-card p-2 rounded-2xl">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <Button
                key={item.label}
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300 group relative"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => scrollToSection(item.href)}
              >
                <item.icon className="h-5 w-5" />
                
                {/* Tooltip */}
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/90 rotate-45" />
                </div>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button - Visible only on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden glass-card w-12 h-12 rounded-xl transition-transform duration-300 hover:scale-110"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <div className="relative w-5 h-5">
          <Menu className={`h-5 w-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
          <X className={`h-5 w-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`} />
        </div>
      </Button>

      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        <div className={`absolute top-20 right-4 glass-card p-4 rounded-2xl transition-all duration-300 ${isMobileMenuOpen ? 'transform translate-y-0 opacity-100 scale-100' : 'transform -translate-y-4 opacity-0 scale-95'}`}>
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300 ${isMobileMenuOpen ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => scrollToSection(item.href)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerticalNav;
