
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Phone, Mail } from 'lucide-react';
import { DraggableItem } from '../schedule/DraggableItem';

interface DraggableClientCardProps {
  client: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    tags?: string[];
    status?: 'active' | 'inactive' | 'pending';
  };
  className?: string;
}

const DraggableClientCard: React.FC<DraggableClientCardProps> = ({ client, className }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  };

  return (
    <DraggableItem
      id={client.id}
      type="client"
      data={{ id: client.id, name: client.name, type: 'client' }}
    >
      <Card className={cn("shadow-sm border transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing", className)}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
          <div className="flex-1">
            <div className="font-medium text-lg">{client.name}</div>
            {client.status && (
              <Badge variant="outline" className={cn("mt-1", statusColors[client.status])}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground">
            <Briefcase className="h-4 w-4" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {(client.address || client.city) && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                {client.address && <div>{client.address}</div>}
                {client.city && <div>{client.city}{client.state ? `, ${client.state}` : ''} {client.zip || ''}</div>}
              </div>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{client.phone}</span>
            </div>
          )}
          
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {client.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DraggableItem>
  );
};

export default DraggableClientCard;
