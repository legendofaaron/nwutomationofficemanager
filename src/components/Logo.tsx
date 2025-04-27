
import { Hexagon } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <div className="rounded-full border-2 border-white p-1">
          <Hexagon className="h-6 w-6 text-white" />
        </div>
      </div>
      <span className="font-semibold text-white">NWautomations</span>
    </div>
  );
};
