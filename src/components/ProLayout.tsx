
import React from 'react';

interface ProLayoutProps {
  children: React.ReactNode;
}

// Custom component to include font links in the app
const FontLoader: React.FC = () => {
  React.useEffect(() => {
    // Add Inter font links to document head
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogle);

    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = '';
    document.head.appendChild(preconnectGstatic);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    // Cleanup function to remove the links when component unmounts
    return () => {
      document.head.removeChild(preconnectGoogle);
      document.head.removeChild(preconnectGstatic);
      document.head.removeChild(fontLink);
    };
  }, []);

  return null;
};

export const ProLayout: React.FC<ProLayoutProps> = ({ children }) => {
  return (
    <>
      <FontLoader />
      {children}
    </>
  );
};
