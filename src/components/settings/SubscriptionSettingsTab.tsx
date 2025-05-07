
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const SubscriptionSettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Features Available</h3>
        <p className="text-sm text-muted-foreground">
          All premium features are included at no cost
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Full Access Plan</CardTitle>
          <CardDescription>All features unlocked</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You have complete access to all features in Office Manager.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Complete document management</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Unlimited team members</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Full AI features and LLM support</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Knowledge base training</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Advanced customization options</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
