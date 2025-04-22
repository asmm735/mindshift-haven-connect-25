
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus, LogOut } from "lucide-react";
import Logo from "@/components/common/Logo";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const navigationItems = [
  { name: "Home", path: "/" },
  { name: "Mood Tracker", path: "/mood-tracker" },
  { name: "AI Chat", path: "/ai-chat" },
  { name: "Pomodoro", path: "/pomodoro" },
  { name: "TheraConnect", path: "/therapists" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Logo size="md" />

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

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/signup')}
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Button>
            </>
          )}
        </div>

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
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              {session ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full justify-center"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-center"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                  <Button
                    variant="default"
                    className="flex items-center gap-2 w-full justify-center"
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
