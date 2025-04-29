
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Logo = ({ small }: { small?: boolean }) => {
  return (
    <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className="relative">
        <div className={`rounded-full border-2 border-app-blue ${small ? 'p-0.5' : 'p-1'}`}>
          <Sparkles className={`${small ? 'h-4 w-4' : 'h-6 w-6'} text-app-blue`} />
        </div>
      </div>
      {!small && <span className="font-semibold text-app-blue">My Logo</span>}
    </Link>
  );
};
