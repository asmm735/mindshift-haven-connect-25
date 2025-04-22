
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navigationItems = [
  { name: "Home", path: "/" },
  { name: "Mood Tracker", path: "/mood-tracker" },
  { name: "AI Chat", path: "/ai-chat" },
  { name: "Pomodoro", path: "/pomodoro" },
  { name: "TheraConnect", path: "/therapists" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-mindshift-raspberry font-serif font-bold text-2xl"
        >
          <div className="h-8 w-8 rounded-full mindshift-gradient flex items-center justify-center text-white font-bold">M</div>
          <span>MindShift</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-base font-medium transition-colors duration-200 hover:text-mindshift-raspberry ${
                location.pathname === item.path 
                  ? "text-mindshift-raspberry border-b-2 border-mindshift-raspberry" 
                  : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white/95 backdrop-blur-md py-4 px-6 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-lg font-medium py-2 transition-colors duration-200 hover:text-mindshift-raspberry ${
                  location.pathname === item.path 
                    ? "text-mindshift-raspberry border-l-4 pl-2 border-mindshift-raspberry" 
                    : "text-gray-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
