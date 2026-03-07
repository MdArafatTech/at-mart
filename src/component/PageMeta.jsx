import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageMeta = () => {
  const location = useLocation();

  useEffect(() => {

    const path = location.pathname.toLowerCase();
    let title = path
      .split('/')
      .filter(Boolean)
      .map(word => {
        if (word === 'pass') return 'Password';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ') || 'Home';
    
    document.title = `${title} - AT-mart`;
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default PageMeta;

