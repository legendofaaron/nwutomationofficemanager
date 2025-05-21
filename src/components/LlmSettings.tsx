
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLlmConfig } from '@/hooks/useLlmConfig';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';
import { LocalModelsTab } from './settings/llm/LocalModelsTab';
import { OpenAiTab } from './settings/llm/OpenAiTab';
import { CustomModelTab } from './settings/llm/CustomModelTab';
import { isLlmConfigured } from '@/utils/modelConfig';

interface LlmSettingsProps {
  onConfigured?: () => void;
}

export const LlmSettings: React.FC<LlmSettingsProps> = ({ onConfigured }) => {
  // Set default active tab
  const [activeTab, setActiveTab] = useState<string>('local');
  
  // Import premium feature hook
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();
  
  // Import the LLM configuration hook
  const {
    config,
    setConfig,
    isCustomModel,
    useOpenAiKey,
    testingOpenAi,
    useLocalLlama,
    downloadProgress,
    isDownloading,
    downloadModelName,
    uploadedModels,
    handleOpenAiToggle,
    handleLocalLlamaToggle,
    downloadLocalModel,
    handleModelUploaded,
    selectUploadedModel,
    testLocalModel,
    testOpenAiKey
  } = useLlmConfig({ onConfigured });

  return (
    <div className="space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="local">Local Models</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="custom">Custom Model</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-6">
          <LocalModelsTab
            useLocalLlama={useLocalLlama}
            handleLocalLlamaToggle={(enabled) => handleLocalLlamaToggle(enabled, checkAccess)}
            threads={config.localLlama?.threads || 4}
            setThreads={(threads) => setConfig(prev => ({
              ...prev,
              localLlama: { ...prev.localLlama, threads }
            }))}
            contextSize={config.localLlama?.contextSize || 2048}
            setContextSize={(contextSize) => setConfig(prev => ({
              ...prev,
              localLlama: { ...prev.localLlama, contextSize }
            }))}
            modelPath={config.localLlama?.modelPath || ''}
            setModelPath={(modelPath) => setConfig(prev => ({
              ...prev,
              localLlama: { ...prev.localLlama, modelPath }
            }))}
            uploadedModels={uploadedModels}
            handleModelUploaded={(path, name) => handleModelUploaded(path, name, checkAccess)}
            selectUploadedModel={(path) => selectUploadedModel(path, checkAccess)}
            downloadLocalModel={(name) => downloadLocalModel(name, checkAccess)}
            isDownloading={isDownloading}
            downloadModelName={downloadModelName}
            downloadProgress={downloadProgress}
            testLocalModel={testLocalModel}
            checkAccess={checkAccess}
          />
        </TabsContent>
        
        <TabsContent value="openai" className="space-y-6">
          <OpenAiTab
            useOpenAiKey={useOpenAiKey}
            handleOpenAiToggle={(enabled) => handleOpenAiToggle(enabled, checkAccess)}
            apiKey={config.openAi?.apiKey || ''}
            setApiKey={(apiKey) => setConfig(prev => ({
              ...prev,
              openAi: { ...(prev.openAi || {}), apiKey, enabled: true }
            }))}
            model={config.model}
            setModel={(model) => setConfig(prev => ({ ...prev, model }))}
            testOpenAiKey={testOpenAiKey}
            testingOpenAi={testingOpenAi}
            checkAccess={checkAccess}
          />
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          <CustomModelTab
            name={config.customModel?.name || ''}
            setName={(name) => setConfig(prev => ({
              ...prev,
              customModel: { ...prev.customModel, name, isCustom: true }
            }))}
            apiKey={config.customModel?.apiKey || ''}
            setApiKey={(apiKey) => setConfig(prev => ({
              ...prev,
              customModel: { ...prev.customModel, apiKey, isCustom: true }
            }))}
            baseUrl={config.customModel?.baseUrl || ''}
            setBaseUrl={(baseUrl) => setConfig(prev => ({
              ...prev,
              customModel: { ...prev.customModel, baseUrl, isCustom: true }
            }))}
            contextLength={config.customModel?.contextLength || 4000}
            setContextLength={(contextLength) => setConfig(prev => ({
              ...prev,
              customModel: { ...prev.customModel, contextLength, isCustom: true }
            }))}
          />
        </TabsContent>
      </Tabs>
      
      {/* Premium Feature Gate component */}
      <PremiumFeatureGate />
    </div>
  );
};

// Export utility function for checking model configuration
export { isLlmConfigured, isModelConfigured } from '@/utils/modelConfig';
