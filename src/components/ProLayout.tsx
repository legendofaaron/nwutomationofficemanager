
import React from 'react';
import { Helmet } from 'react-helmet';

interface ProLayoutProps {
  children: React.ReactNode;
}

export const ProLayout: React.FC<ProLayoutProps> = ({ children }) => {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      {children}
    </>
  );
};
