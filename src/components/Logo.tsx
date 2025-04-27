
import { Hexagon } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="rounded-full border-2 border-app-blue p-1">
          <Hexagon className="h-6 w-6 text-app-blue" />
        </div>
      </div>
      <span className="font-semibold text-app-blue">NWautomations</span>
    </div>
  );
};
