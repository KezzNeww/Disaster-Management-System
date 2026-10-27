import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center font-mono space-y-4">
      <div className="h-16 w-16 rounded-xs bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-100">404 - SECTOR NOT FOUND</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The requested tactical telemetry endpoint or command channel does not exist in the mission network.
      </p>
      <Link to="/">
        <Button variant="default">RETURN TO COMMAND OVERVIEW</Button>
      </Link>
    </div>
  );
}
