
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface FreePlanProps {
  onContinue: () => void;
}

export const FreePlan = ({ onContinue }: FreePlanProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>Free Plan</CardTitle>
        <CardDescription>Basic features for personal use</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">$0<span className="text-sm font-normal">/month</span></div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Limited LLM support</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Basic document management</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Up to 5 team members</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onContinue}
        >
          Continue with Free Plan <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
