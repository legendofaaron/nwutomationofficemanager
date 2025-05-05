import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Bot, Calendar, FileText, Receipt, ScanSearch, Info, Settings, Edit } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { queryLlm } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
}
type SetupStep = 'welcome' | 'name' | 'company' | 'purpose' | 'complete' | null;
const AiAssistant = () => {
  const {
    aiAssistantOpen,
    setAiAssistantOpen,
    assistantConfig,
    setAssistantConfig,
    branding,
    setBranding,
    setViewMode,
    setCurrentFile,
    files,
    setFiles,
    currentFile
  } = useAppContext();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [currentSetupStep, setCurrentSetupStep] = useState<SetupStep>(null);
  const [setupData, setSetupData] = useState({
    name: assistantConfig?.name || 'Office Manager',
    companyName: branding.companyName || '',
    companyDescription: assistantConfig?.companyDescription || '',
    purpose: assistantConfig?.purpose || '',
    logoType: branding.logoType || 'default',
    logoUrl: branding.logoUrl || ''
  });
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'ai',
    content: `👋 Welcome to Office Manager

I'm your intelligent assistant designed to help you streamline office tasks efficiently. Here's what I can do for you:

📄 Document Creation
- Draft new documents
- Create reports and memos
- Generate templates

📅 Schedule Management
- Organize daily/weekly schedules
- Set up meeting arrangements
- Prioritize tasks

💵 Invoice Management
- Generate professional invoices
- Track payment statuses
- Maintain billing records

🧾 Receipt Processing
- Extract data from receipts
- Organize receipt information
- Maintain financial records

You can:
1. Use the quick action buttons above
2. Type natural language requests like "create a new document"
3. Ask questions about any feature

Your data remains secure on your local system. Need assistance? Just ask me anything!`
  }]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Check if setup is needed when assistant opens
  useEffect(() => {
    if (aiAssistantOpen && !assistantConfig?.companyName) {
      const shouldStartSetup = !setupData.companyName;
      if (shouldStartSetup) {
        startSetupProcess();
      }
    }
  }, [aiAssistantOpen, assistantConfig]);
  const startSetupProcess = () => {
    setIsSetupMode(true);
    setCurrentSetupStep('welcome');

    // Add welcome setup message
    setMessages([{
      id: Date.now().toString(),
      type: 'system',
      content: "🔧 Setup Mode"
    }, {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `I notice this is your first time using the assistant. Let's take a moment to personalize it for you. I'll guide you through a quick setup process.

Would you like to:
1. Start the guided setup now
2. Go to the setup page for more detailed configuration
3. Skip setup for now`
    }]);
  };
  const handleSetupResponse = (response: string) => {
    // Add user response to messages
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMessageId,
      type: 'user',
      content: response
    }]);

    // Process response based on current setup step
    switch (currentSetupStep) {
      case 'welcome':
        if (response.toLowerCase().includes('1') || response.toLowerCase().includes('start')) {
          processNextSetupStep('name');
        } else if (response.toLowerCase().includes('2') || response.toLowerCase().includes('setup page')) {
          navigate('/setup-assistant');
          setAiAssistantOpen(false);
          return;
        } else {
          // Skip setup
          setIsSetupMode(false);
          setCurrentSetupStep(null);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: "No problem! You can always configure me later through the setup page. How can I help you today?"
          }]);
        }
        break;
      case 'name':
        setSetupData(prev => ({
          ...prev,
          name: response
        }));
        processNextSetupStep('company');
        break;
      case 'company':
        setSetupData(prev => ({
          ...prev,
          companyName: response
        }));
        // Fix: update the branding with proper type checking
        setBranding({
          ...branding,
          companyName: response
        });
        processNextSetupStep('purpose');
        break;
      case 'purpose':
        setSetupData(prev => ({
          ...prev,
          purpose: response
        }));
        processNextSetupStep('complete');
        break;
      case 'complete':
        if (response.toLowerCase().includes('yes')) {
          // Navigate to full setup
          navigate('/setup-assistant');
          setAiAssistantOpen(false);
        } else {
          // Save settings and exit setup mode
          completeSetup();
        }
        break;
    }
  };
  const processNextSetupStep = (nextStep: SetupStep) => {
    setCurrentSetupStep(nextStep);
    let message = '';
    switch (nextStep) {
      case 'name':
        message = "What would you like to name your assistant?";
        break;
      case 'company':
        message = "Great! What's the name of your company or organization? This will be used for branding throughout the application.";
        break;
      case 'purpose':
        message = "What kind of tasks would you like me to help you with primarily? (e.g., document creation, schedule management, invoice processing)";
        break;
      case 'complete':
        message = `Thank you! I've saved your basic setup:

- Assistant name: ${setupData.name}
- Company: ${setupData.companyName}
- Primary tasks: ${setupData.purpose}

Would you like to go to the full setup page for more detailed configuration, including logo selection?`;
        break;
    }
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: message
    }]);
  };
  const completeSetup = () => {
    // Save to context
    if (setAssistantConfig) {
      setAssistantConfig({
        name: setupData.name,
        companyName: setupData.companyName,
        purpose: setupData.purpose
      });
    }

    // Update branding if company name was changed
    if (setupData.companyName && setupData.companyName !== branding.companyName) {
      setBranding({
        ...branding,
        companyName: setupData.companyName
      });
    }

    // Exit setup mode
    setIsSetupMode(false);
    setCurrentSetupStep(null);

    // Add completion message
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `Perfect! Your assistant is now set up as "${setupData.name}" for ${setupData.companyName}. I'll focus on helping you with ${setupData.purpose}.

You can always update your branding settings including company logo by clicking the Settings button in the assistant header.

How can I assist you today?`
    }]);
  };
  const quickActions = [{
    icon: FileText,
    label: 'Create Document',
    action: () => handleQuickAction('create document')
  }, {
    icon: Calendar,
    label: 'Create Schedule',
    action: () => handleQuickAction('create schedule')
  }, {
    icon: Receipt,
    label: 'Create Invoice',
    action: () => handleQuickAction('create invoice')
  }, {
    icon: ScanSearch,
    label: 'Analyze Receipt',
    action: () => handleQuickAction('analyze receipt')
  }, {
    icon: Info,
    label: 'How to use',
    action: () => handleQuickAction('explain how to use')
  }];
  const handleQuickAction = (action: string) => {
    if (isSetupMode) return;
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMessageId,
      type: 'user',
      content: action
    }]);
    let response = '';
    switch (action) {
      case 'create document':
        response = "I'd be happy to help you create a new document. What type of document would you like to create?";

        // Add options for document types
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: `Here are some common document types:
1. Project Proposal
2. Meeting Minutes
3. Business Report
4. Company Memo
5. Custom Document

Which would you like to create? Or describe your custom document needs.`
          }]);

          // Set up listener for next user input
          setActiveAction({
            type: 'document',
            step: 'select-type'
          });
        }, 800);
        break;
      case 'create schedule':
        response = "Let's organize a schedule for you. What type of schedule would you like to create?";

        // Switch to schedule view after response
        setTimeout(() => {
          setViewMode('document');

          // Create a new schedule document
          const newSchedule = {
            id: Date.now().toString(),
            name: 'New Schedule',
            type: 'document' as const,
            content: '# Schedule\n\n## Daily Tasks\n\n- [ ] Task 1\n\n- [ ] Task 2\n\n- [ ] Task 3\n\n## Weekly Goals\n\n- Goal 1\n- Goal 2'
          };

          // Find Documents folder or create it
          let documentsFolder = files.find(f => f.type === 'folder' && f.name === 'Documents');
          if (!documentsFolder) {
            documentsFolder = {
              id: 'documents-folder',
              name: 'Documents',
              type: 'folder',
              children: []
            };
            setFiles([...files, documentsFolder]);
          }

          // Add schedule to documents folder
          const updatedFiles = files.map(file => {
            if (file.id === documentsFolder?.id) {
              return {
                ...file,
                children: [...(file.children || []), newSchedule]
              };
            }
            return file;
          });
          setFiles(updatedFiles);
          setCurrentFile(newSchedule);
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: `I've created a new schedule document for you. You can now edit it in the document viewer.

Would you like me to help customize this schedule further? For example:
1. Add specific time blocks
2. Set recurring meetings
3. Add deadline reminders`
          }]);
          setActiveAction({
            type: 'schedule',
            step: 'customize',
            documentId: newSchedule.id
          });
        }, 800);
        break;
      case 'create invoice':
        response = "I can help you generate a professional invoice. Let's get started with the basic details.";

        // Navigate to invoice view
        setTimeout(() => {
          setViewMode('office');
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: `I've opened the Office Manager where you can create and manage invoices.

Please provide the following details to create your invoice:
1. Client Name
2. Invoice Amount
3. Due Date
4. Service Description

Or you can simply fill out the invoice form directly in the Office Manager panel.`
          }]);
          setActiveAction({
            type: 'invoice',
            step: 'create'
          });
        }, 800);
        break;
      case 'analyze receipt':
        response = "I can assist with receipt analysis. Please upload or share the receipt details so I can process the information.";

        // Switch to receipt analyzer
        setTimeout(() => {
          setViewMode('office');
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: `I've opened the Office Manager where you can upload and analyze receipts.

You can:
1. Upload a receipt image or PDF
2. Enter receipt details manually
3. Use the receipt scanning tool

The system will extract key information such as vendor, date, amount, and items purchased.`
          }]);
          setActiveAction({
            type: 'receipt',
            step: 'analyze'
          });
        }, 800);
        break;
      case 'explain how to use':
        response = `Here's how to make the most of ${assistantConfig?.name || 'Office Manager'}:

1. Quick Actions: Use the buttons above for common tasks
2. Natural Language: Type requests like "create a new document" or "set up a meeting schedule"
3. Document Management: Create, organize, and manage various document types
4. Receipt Processing: Upload receipts for information extraction and organization
5. Schedule Management: Create and organize calendars and schedules

Your data remains secure on your local system. How can I assist you today?`;
        break;
      default:
        response = "I'll help you with that request.";
    }
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response
      }]);
    }, 500);
  };

  // Active action tracking for multi-step processes
  const [activeAction, setActiveAction] = useState<{
    type: 'document' | 'schedule' | 'invoice' | 'receipt' | null;
    step: string;
    documentId?: string;
    data?: any;
  }>({
    type: null,
    step: ''
  });

  // Add a function to detect and update document title
  const updateDocumentTitle = (userInput: string) => {
    // Only process if we're in document mode and have a current file
    if (currentFile && currentFile.type === 'document') {
      // Check if the message contains something like "title should be" or "change title to"
      const titleRegex = /(?:title|name|call it|rename to|change to|make it)(?:\s+(?:the|a|an|this))?(?:\s+document)?\s+(?:to|as|be)?\s+["']?([^"'.!?]+)["']?/i;
      const match = userInput.match(titleRegex);
      if (match && match[1]) {
        // Extract the requested title
        const newTitle = match[1].trim();
        if (newTitle) {
          // Update document content only if it starts with a markdown header
          if (currentFile.content && currentFile.content.startsWith('# ')) {
            // Replace the first header line with the new title
            const updatedContent = currentFile.content.replace(/^# .*$/m, `# ${newTitle}`);

            // Update the document content
            const updatedFile = {
              ...currentFile,
              content: updatedContent
            };
            setCurrentFile(updatedFile);

            // Update in files tree
            const updateFiles = (filesArray: any[]): any[] => {
              return filesArray.map(file => {
                if (file.id === currentFile.id) {
                  return updatedFile;
                }
                if (file.children) {
                  return {
                    ...file,
                    children: updateFiles(file.children)
                  };
                }
                return file;
              });
            };
            setFiles(updateFiles(files));

            // Add confirmation message
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              type: 'ai',
              content: `I've updated your document title to "${newTitle}".`
            }]);
            return true;
          }
        }
      }
    }
    return false;
  };

  // Process user input based on active action
  const processActionInput = (userInput: string) => {
    // First check if it's a document title update request
    const titleUpdated = updateDocumentTitle(userInput);
    if (titleUpdated) return true;
    if (!activeAction.type) return false;
    switch (activeAction.type) {
      case 'document':
        if (activeAction.step === 'select-type') {
          // Create document based on selected type
          const documentType = getDocumentTypeFromInput(userInput);
          const content = generateDocumentTemplate(documentType);

          // Create new document
          const newDocument = {
            id: Date.now().toString(),
            name: `New ${documentType}`,
            type: 'document' as const,
            content
          };

          // Find Documents folder or create it
          let documentsFolder = files.find(f => f.type === 'folder' && f.name === 'Documents');
          if (!documentsFolder) {
            documentsFolder = {
              id: 'documents-folder',
              name: 'Documents',
              type: 'folder' as const,
              children: []
            };
            setFiles([...files, documentsFolder]);
          }

          // Add document to documents folder
          const updatedFiles = files.map(file => {
            if (file.id === documentsFolder?.id) {
              return {
                ...file,
                children: [...(file.children || []), newDocument]
              };
            }
            return file;
          });
          setFiles(updatedFiles);
          setCurrentFile(newDocument);
          setViewMode('document');

          // Respond to user
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I've created a new ${documentType} for you and opened it in the document viewer. You can now edit it.

Would you like me to help you fill in any specific sections of this document?`
          }]);

          // Update action state
          setActiveAction({
            type: 'document',
            step: 'editing',
            documentId: newDocument.id
          });
          return true;
        }
        break;
      case 'schedule':
        if (activeAction.step === 'customize' && activeAction.documentId) {
          // Update schedule based on customization request
          const updatedContent = customizeSchedule(userInput, files, activeAction.documentId);

          // Update file content
          const updatedFiles = updateFileContent(files, activeAction.documentId, updatedContent);
          setFiles(updatedFiles);

          // Find the current file and update it if it's the active one
          const updatedFile = findFileById(files, activeAction.documentId);
          if (updatedFile) {
            setCurrentFile({
              ...updatedFile,
              content: updatedContent
            });
          }

          // Respond to user
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I've updated your schedule with the requested customizations. You can continue editing it in the document viewer.

Is there anything else you'd like to add to your schedule?`
          }]);
          return true;
        }
        break;
      case 'invoice':
      case 'receipt':
        // These are handled in the Office Manager views
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've opened the appropriate tool in the Office Manager panel. You can now interact with it directly.

Let me know if you need help with any specific part of the ${activeAction.type === 'invoice' ? 'invoice creation' : 'receipt analysis'} process.`
        }]);

        // Clear active action after redirecting
        setActiveAction({
          type: null,
          step: ''
        });
        return true;
    }
    return false;
  };

  // Helper function to determine document type from user input
  const getDocumentTypeFromInput = (input: string): string => {
    input = input.toLowerCase();
    if (input.includes('1') || input.includes('proposal') || input.includes('project proposal')) {
      return 'Project Proposal';
    } else if (input.includes('2') || input.includes('minutes') || input.includes('meeting minutes')) {
      return 'Meeting Minutes';
    } else if (input.includes('3') || input.includes('report') || input.includes('business report')) {
      return 'Business Report';
    } else if (input.includes('4') || input.includes('memo') || input.includes('company memo')) {
      return 'Company Memo';
    } else {
      return 'Custom Document';
    }
  };

  // Generate document template based on type
  const generateDocumentTemplate = (type: string): string => {
    switch (type) {
      case 'Project Proposal':
        return `# Project Proposal: [Project Name]

## Executive Summary

[Brief overview of the project and its objectives]

## Project Scope

### Objectives
- Objective 1
- Objective 2
- Objective 3

### Deliverables
- Deliverable 1
- Deliverable 2
- Deliverable 3

## Timeline

| Phase | Start Date | End Date | Key Milestones |
|-------|------------|----------|----------------|
| Planning | | | |
| Development | | | |
| Testing | | | |
| Deployment | | | |

## Budget

| Category | Estimated Cost |
|----------|----------------|
| Personnel | $ |
| Equipment | $ |
| Software | $ |
| Other | $ |
| **Total** | $ |

## Team

- Project Manager:
- Team Members:
  - [Name], [Role]
  - [Name], [Role]

## Risks and Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| | | | |
| | | | |

## Approval

- Requested by: [Name], [Position]
- Approved by: [Name], [Position]
- Date:

`;
      case 'Meeting Minutes':
        return `# Meeting Minutes

## Meeting Details

- **Date:** ${new Date().toLocaleDateString()}
- **Time:** ${new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
- **Location:** 
- **Meeting Type:** 

## Attendees

- [Name], [Position]
- [Name], [Position]
- [Name], [Position]

## Agenda

1. 
2. 
3. 

## Discussions

### Topic 1
- 
- 
- 

### Topic 2
- 
- 
- 

## Action Items

| Action | Responsible | Due Date | Status |
|--------|-------------|----------|--------|
| | | | |
| | | | |
| | | | |

## Next Meeting

- **Date:** 
- **Time:** 
- **Location:** 

## Notes

[Additional notes or information]

`;
      case 'Business Report':
        return `# Business Report: [Title]

## Executive Summary

[Brief summary of the report and key findings]

## Introduction

[Context and purpose of the report]

## Methodology

[How the information was gathered and analyzed]

## Findings

### Key Finding 1
- 
- 
- 

### Key Finding 2
- 
- 
- 

### Key Finding 3
- 
- 
- 

## Financial Summary

| Category | Amount | % Change |
|----------|--------|----------|
| Revenue | $ | |
| Expenses | $ | |
| Profit | $ | |

## Recommendations

1. 
2. 
3. 

## Conclusion

[Summary of report and final thoughts]

## Appendices

### Appendix A: [Title]
- 
- 

### Appendix B: [Title]
- 
- 

`;
      case 'Company Memo':
        return `# MEMORANDUM

**Date:** ${new Date().toLocaleDateString()}
**To:** [Recipient(s)]
**From:** [Sender]
**Subject:** [Subject of Memo]

## Purpose

[Brief statement of the memo's purpose]

## Background

[Relevant background information]

## Details

[Main content of the memo]

## Action Items

- 
- 
- 

## Timeline

[Deadlines or timeline information]

## Contact

For questions or further information, please contact [Name] at [Contact Information].

`;
      default:
        return `# New Document

[Start typing your content here]

`;
    }
  };

  // Customize schedule based on user input
  const customizeSchedule = (input: string, files: any[], documentId: string): string => {
    const file = findFileById(files, documentId);
    let content = file?.content || '';
    const lowerInput = input.toLowerCase();

    // Add time blocks if requested
    if (lowerInput.includes('time') || lowerInput.includes('block') || lowerInput.includes('1')) {
      content += `

## Time Blocks

### Morning
- 9:00 - 10:00: [Task]
- 10:00 - 11:30: [Task]
- 11:30 - 12:00: [Task]

### Afternoon
- 13:00 - 14:30: [Task]
- 14:30 - 16:00: [Task]
- 16:00 - 17:00: [Task]
`;
    }

    // Add recurring meetings if requested
    if (lowerInput.includes('meeting') || lowerInput.includes('recurring') || lowerInput.includes('2')) {
      content += `

## Recurring Meetings

- Monday 10:00 - Weekly Planning
- Wednesday 14:00 - Team Sync
- Friday 16:00 - Week Review
`;
    }

    // Add deadline reminders if requested
    if (lowerInput.includes('deadline') || lowerInput.includes('reminder') || lowerInput.includes('3')) {
      content += `

## Deadlines & Reminders

- [ ] Project proposal due on ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- [ ] Client meeting preparation by ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- [ ] Review quarterly results by ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
`;
    }
    return content;
  };

  // Find a file by ID in the file tree
  const findFileById = (files: any[], id: string): any => {
    for (const file of files) {
      if (file.id === id) {
        return file;
      }
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update file content in the file tree
  const updateFileContent = (files: any[], id: string, content: string): any[] => {
    return files.map(file => {
      if (file.id === id) {
        return {
          ...file,
          content
        };
      }
      if (file.children) {
        return {
          ...file,
          children: updateFileContent(file.children, id, content)
        };
      }
      return file;
    });
  };
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // If in setup mode, process as setup response
    if (isSetupMode) {
      handleSetupResponse(input);
      setInput('');
      return;
    }
    const userMessageId = Date.now().toString();
    setMessages([...messages, {
      id: userMessageId,
      type: 'user',
      content: input
    }]);
    try {
      // First check if this is part of an active action flow or a document title request
      const wasProcessed = processActionInput(input);
      if (!wasProcessed) {
        // Simple AI response simulation for immediate feedback
        setTimeout(() => {
          setMessages(current => [...current, {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I'll help you with "${input}". How would you like to proceed?`
          }]);
        }, 800);
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the assistant. Please try again later.',
        variant: 'destructive'
      });
    }
    setInput('');
  };
  const handleEditBranding = () => {
    navigate('/setup-assistant');
    setAiAssistantOpen(false);
  };
  if (!aiAssistantOpen) return null;
  return <div className="fixed right-4 bottom-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px] z-20">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Logo small />
          {assistantConfig?.name && <span className="text-sm font-medium">{assistantConfig.name}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleEditBranding} className="h-6 w-6" title="Edit branding and settings">
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="h-6 w-6" title="AI settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setAiAssistantOpen(false)} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showSettings ? <LlmSettings /> : <>
          {!isSetupMode && <div className="grid grid-cols-2 gap-2 p-3 border-b">
              {quickActions.map((action, index) => <Button key={index} variant="outline" size="sm" className="w-full justify-start" onClick={action.action}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>)}
            </div>}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
                <div className={`${message.type === 'user' ? 'bg-blue-600 text-white max-w-[80%] p-3 rounded-lg' : message.type === 'system' ? 'bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-xs font-medium' : 'bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg'} whitespace-pre-wrap`}>
                  {message.content}
                </div>
              </div>)}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t mx-0">
            <div className="flex gap-2 px-[7px] py-[2px] mx-[9px] my-px">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder={isSetupMode ? "Type your response..." : "Type your message..."} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="px-[7px] py-[7px] my-0 mx-0" />
              <Button onClick={handleSendMessage} className="my-0 mx-[52px] px-[10px] py-0">Send</Button>
            </div>
          </div>
        </>}
    </div>;
};
export default AiAssistant;