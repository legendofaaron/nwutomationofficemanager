
import { Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className="relative">
        <div className="rounded-full border-2 border-app-blue p-1">
          <Hexagon className="h-6 w-6 text-app-blue" />
        </div>
      </div>
      <span className="font-semibold text-app-blue">NorthWestern AI</span>
    </Link>
  );
};
