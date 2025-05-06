
import React from 'react';
import { generateDocumentContent } from '@/utils/llm';

export interface DocumentTemplate {
  id: string;
  name: string;
  template: string;
  description: string;
  placeholders: string[];
  aiGenerated: string[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'report',
    name: 'Report Template',
    description: 'A professional report with executive summary, findings, and recommendations',
    template: `# {name}

## Executive Summary
{summary}

{purpose}

## Introduction
{introduction}

## Key Findings
- {finding1}
- {finding2}
- {finding3}

## Recommendations
1. {recommendation1}
2. {recommendation2}

## Conclusion
{conclusion}`,
    placeholders: ['name', 'summary', 'purpose'],
    aiGenerated: ['introduction', 'finding1', 'finding2', 'finding3', 'recommendation1', 'recommendation2', 'conclusion']
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Structured notes for team meetings',
    template: `# {name}

**Date:** {date}
**Participants:** {participants}

## Agenda
{agenda}

## Discussion Points
{discussionPoints}

## Action Items
{actionItems}

## Next Steps
{nextSteps}`,
    placeholders: ['name', 'date', 'participants', 'agenda'],
    aiGenerated: ['discussionPoints', 'actionItems', 'nextSteps']
  },
  {
    id: 'project',
    name: 'Project Plan',
    description: 'Comprehensive project planning document',
    template: `# {name}

## Project Overview
{overview}

## Timeline
{timeline}

## Team Members
{team}

## Milestones
{milestones}

## Budget
{budget}

## Risk Assessment
{risks}`,
    placeholders: ['name', 'overview'],
    aiGenerated: ['timeline', 'team', 'milestones', 'budget', 'risks']
  }
];

export const generateDocumentFromTemplate = async (
  template: DocumentTemplate,
  placeholderValues: Record<string, string>
): Promise<string> {
  let content = template.template;
  
  // Fill in user-provided placeholders
  for (const key of template.placeholders) {
    content = content.replace(`{${key}}`, placeholderValues[key] || `(fill ${key})`);
  }
  
  // Generate AI content for each placeholder
  for (const key of template.aiGenerated) {
    try {
      // Create a specific prompt based on the field
      const prompt = `Generate content for the "${key}" section of a ${template.name.toLowerCase()}. 
      Context: This is for a document titled "${placeholderValues.name || 'New Document'}".
      ${placeholderValues.purpose ? `Purpose: ${placeholderValues.purpose}` : ''}
      ${placeholderValues.summary ? `Summary: ${placeholderValues.summary}` : ''}`;
      
      const aiGeneratedContent = await generateDocumentContent(prompt, key);
      content = content.replace(`{${key}}`, aiGeneratedContent || `(ai generated content for ${key})`);
    } catch (error) {
      console.error(`Error generating content for ${key}:`, error);
      content = content.replace(`{${key}}`, `(ai generated content for ${key})`);
    }
  }
  
  return content;
};
