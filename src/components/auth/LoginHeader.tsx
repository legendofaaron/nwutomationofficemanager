
import React from 'react';
import { Logo } from '@/components/Logo';

interface LoginHeaderProps {
  companyName: string;
}

export const LoginHeader = ({ companyName }: LoginHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <Logo />
      <h1 className="text-2xl font-bold text-center mt-6">Welcome to Office Manager</h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Log in to continue to {companyName}
      </p>
    </div>
  );
};
