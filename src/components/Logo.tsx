
import { Hexagon } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
      <div className="relative">
        <div className="rounded-full border-2 border-app-blue p-1">
          <Hexagon className="h-5 w-5 text-app-blue" />
        </div>
      </div>
      <span className="font-medium text-sm tracking-tight text-app-blue">NorthWestern AI</span>
    </div>
  );
};
