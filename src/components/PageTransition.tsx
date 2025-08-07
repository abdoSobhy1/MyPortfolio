
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`transition-all duration-400 ${isVisible ? 'animate-page-enter' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default PageTransition;
