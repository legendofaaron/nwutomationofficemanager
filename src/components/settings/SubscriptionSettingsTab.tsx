
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckCircle, Code } from 'lucide-react';
import { OpenSourceInfo } from '../OpenSourceInfo';

export const SubscriptionSettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Code className="h-5 w-5 text-green-500" />
          Open Source Software
        </h3>
        <p className="text-sm text-muted-foreground">
          Office Manager is free and open source software available under the MIT license
        </p>
      </div>
      
      <OpenSourceInfo />
      
      <Card>
        <CardHeader>
          <CardTitle>Full Access - No Subscription Required</CardTitle>
          <CardDescription>All features available at no cost under MIT license</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You have complete access to all features in Office Manager. No subscription or payment is required.
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
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Source code available for modification</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
