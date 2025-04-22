
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ withText = true, size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 text-mindshift-raspberry font-serif font-bold ${className}`}
    >
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-mindshift-raspberry to-mindshift-lavender flex items-center justify-center p-1.5`}>
        <Brain className="text-white w-full h-full" />
      </div>
      {withText && (
        <span className={`${textSizeClasses[size]} whitespace-nowrap`}>
          MindShift
        </span>
      )}
    </Link>
  );
};

export default Logo;
