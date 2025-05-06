
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Lock } from 'lucide-react';
import { KnowledgeItem } from './types';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';

interface KnowledgeTrainingProps {
  knowledgeItems: KnowledgeItem[];
  trainingProgress: number;
  isTraining: boolean;
  onStartTraining: () => void;
  isPremium?: boolean;
}

export const KnowledgeTraining: React.FC<KnowledgeTrainingProps> = ({
  knowledgeItems,
  trainingProgress,
  isTraining,
  onStartTraining,
  isPremium = false
}) => {
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();

  const handleTraining = () => {
    // Check if user has access to this premium feature
    if (checkAccess('AI Training')) {
      onStartTraining();
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="relative">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Training
          {!isPremium && (
            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
              <Lock className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Train your AI assistant with your knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-7rem)]">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium flex items-center">
                <Brain className="h-5 w-5 text-primary mr-2" />
                Training Status
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {knowledgeItems.length === 0
                  ? "No training data available. Add items to your knowledge base first."
                  : `${knowledgeItems.length} items available for training.`}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Training progress</p>
                    <p className="text-sm text-muted-foreground">
                      {isTraining
                        ? "Training in progress..."
                        : trainingProgress === 100
                          ? "Training complete"
                          : "No training in progress"}
                    </p>
                  </div>
                  <Badge variant="outline">{trainingProgress}%</Badge>
                </div>

                {trainingProgress > 0 && trainingProgress < 100 && (
                  <Progress value={trainingProgress} className="w-full" />
                )}

                <Button
                  className="w-full"
                  disabled={knowledgeItems.length === 0 || isTraining}
                  onClick={handleTraining}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isTraining ? "Training..." : trainingProgress === 100 ? "Retrain Model" : "Start Training"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <PremiumFeatureGate />
    </Card>
  );
};
