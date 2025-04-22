
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md shadow-md mt-auto py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-mindshift-raspberry font-serif font-bold text-xl mb-4">
              <div className="h-6 w-6 rounded-full mindshift-gradient flex items-center justify-center text-white font-bold text-xs">M</div>
              <span>MindShift</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Helping you find your mental clarity and strength through technology and connection.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-mindshift-raspberry mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/mood-tracker" className="text-gray-600 hover:text-mindshift-raspberry text-sm">Mood Tracker</Link></li>
              <li><Link to="/ai-chat" className="text-gray-600 hover:text-mindshift-raspberry text-sm">AI Chat Support</Link></li>
              <li><Link to="/pomodoro" className="text-gray-600 hover:text-mindshift-raspberry text-sm">Pomodoro Timer</Link></li>
              <li><Link to="/therapists" className="text-gray-600 hover:text-mindshift-raspberry text-sm">TheraConnect</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-mindshift-raspberry mb-4">About</h3>
            <p className="text-gray-600 text-sm mb-4">
              MindShift is a mental wellness platform designed to provide tools and resources for your well-being journey.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} MindShift. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
