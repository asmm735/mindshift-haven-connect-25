
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

const PageLayout = ({ children, className = "", fullHeight = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow pt-20 pb-10 ${fullHeight ? 'flex' : ''} ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
