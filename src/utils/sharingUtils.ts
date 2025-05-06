
/**
 * Utility functions for handling shared folders and file permissions
 */

import { toast } from '@/hooks/use-toast';

// Check if a folder exists
export const checkFolderExists = async (folderPath: string): Promise<boolean> => {
  if (!folderPath) return false;
  
  try {
    // In a browser environment, we can't directly check if a folder exists
    // Instead, we'll simulate it by checking localStorage
    const savedFolders = localStorage.getItem('sharedFolders');
    if (!savedFolders) return false;
    
    const folders = JSON.parse(savedFolders);
    return Array.isArray(folders) && folders.includes(folderPath);
  } catch (error) {
    console.error('Error checking folder existence:', error);
    return false;
  }
};

// Create a shared folder
export const createSharedFolder = async (folderPath: string): Promise<boolean> => {
  if (!folderPath) {
    console.error('Invalid folder path provided');
    return false;
  }
  
  try {
    // In a browser environment, we simulate folder creation
    const savedFolders = localStorage.getItem('sharedFolders');
    const folders = savedFolders ? JSON.parse(savedFolders) : [];
    
    // Validate the parsed data is an array
    if (!Array.isArray(folders)) {
      localStorage.setItem('sharedFolders', JSON.stringify([folderPath]));
      return true;
    }
    
    if (!folders.includes(folderPath)) {
      folders.push(folderPath);
      localStorage.setItem('sharedFolders', JSON.stringify(folders));
    }
    
    // Show a success notification
    toast?.({
      title: 'Shared Folder Created',
      description: `Folder "${folderPath}" is now set up for sharing`,
    });
    
    return true;
  } catch (error) {
    console.error('Error creating shared folder:', error);
    
    // Show an error notification
    toast?.({
      title: 'Error Creating Folder',
      description: 'There was a problem creating the shared folder. Please try again.',
      variant: 'destructive'
    });
    
    return false;
  }
};

// Save sharing settings
export const saveSharingSettings = (settings: SharingSettings): void => {
  if (!settings) {
    console.error('Invalid sharing settings provided');
    return;
  }
  
  try {
    // Validate settings before saving
    const validatedSettings: SharingSettings = {
      enableSharedFolder: Boolean(settings.enableSharedFolder),
      folderPath: settings.folderPath || DEFAULT_SHARING_SETTINGS.folderPath,
      permissions: {
        read: Boolean(settings.permissions?.read ?? DEFAULT_SHARING_SETTINGS.permissions.read),
        write: Boolean(settings.permissions?.write ?? DEFAULT_SHARING_SETTINGS.permissions.write),
        modify: Boolean(settings.permissions?.modify ?? DEFAULT_SHARING_SETTINGS.permissions.modify),
      },
      privacy: {
        localProcessing: Boolean(settings.privacy?.localProcessing ?? DEFAULT_SHARING_SETTINGS.privacy.localProcessing),
        encryption: Boolean(settings.privacy?.encryption ?? DEFAULT_SHARING_SETTINGS.privacy.encryption),
        auditLogs: Boolean(settings.privacy?.auditLogs ?? DEFAULT_SHARING_SETTINGS.privacy.auditLogs),
      }
    };
    
    localStorage.setItem('sharingSettings', JSON.stringify(validatedSettings));
  } catch (error) {
    console.error('Error saving sharing settings:', error);
    
    // Show an error notification
    toast?.({
      title: 'Error Saving Settings',
      description: 'There was a problem saving your sharing settings. Please try again.',
      variant: 'destructive'
    });
  }
};

// Get sharing settings
export const getSharingSettings = (): SharingSettings => {
  try {
    const savedSettings = localStorage.getItem('sharingSettings');
    if (!savedSettings) return DEFAULT_SHARING_SETTINGS;
    
    const parsedSettings = JSON.parse(savedSettings);
    
    // Validate and merge with defaults to ensure all properties exist
    return {
      enableSharedFolder: Boolean(parsedSettings.enableSharedFolder ?? DEFAULT_SHARING_SETTINGS.enableSharedFolder),
      folderPath: parsedSettings.folderPath || DEFAULT_SHARING_SETTINGS.folderPath,
      permissions: {
        read: Boolean(parsedSettings.permissions?.read ?? DEFAULT_SHARING_SETTINGS.permissions.read),
        write: Boolean(parsedSettings.permissions?.write ?? DEFAULT_SHARING_SETTINGS.permissions.write),
        modify: Boolean(parsedSettings.permissions?.modify ?? DEFAULT_SHARING_SETTINGS.permissions.modify),
      },
      privacy: {
        localProcessing: Boolean(parsedSettings.privacy?.localProcessing ?? DEFAULT_SHARING_SETTINGS.privacy.localProcessing),
        encryption: Boolean(parsedSettings.privacy?.encryption ?? DEFAULT_SHARING_SETTINGS.privacy.encryption),
        auditLogs: Boolean(parsedSettings.privacy?.auditLogs ?? DEFAULT_SHARING_SETTINGS.privacy.auditLogs),
      }
    };
  } catch (error) {
    console.error('Error retrieving sharing settings:', error);
    return DEFAULT_SHARING_SETTINGS;
  }
};

// Types for sharing settings
export interface SharingSettings {
  enableSharedFolder: boolean;
  folderPath: string;
  permissions: {
    read: boolean;
    write: boolean;
    modify: boolean;
  };
  privacy: {
    localProcessing: boolean;
    encryption: boolean;
    auditLogs: boolean;
  };
}

// Default sharing settings
export const DEFAULT_SHARING_SETTINGS: SharingSettings = {
  enableSharedFolder: true,
  folderPath: '/shared',
  permissions: {
    read: true,
    write: true,
    modify: true,
  },
  privacy: {
    localProcessing: true,
    encryption: true,
    auditLogs: true,
  }
};

// Get list of shared folders
export const getSharedFolders = (): string[] => {
  try {
    const savedFolders = localStorage.getItem('sharedFolders');
    if (!savedFolders) return [];
    
    const folders = JSON.parse(savedFolders);
    return Array.isArray(folders) ? folders : [];
  } catch (error) {
    console.error('Error retrieving shared folders:', error);
    return [];
  }
};

// Check if sharing is enabled globally
export const isSharingEnabled = (): boolean => {
  const settings = getSharingSettings();
  return settings.enableSharedFolder;
};

// Reset sharing settings to defaults
export const resetSharingSettings = (): void => {
  localStorage.setItem('sharingSettings', JSON.stringify(DEFAULT_SHARING_SETTINGS));
  localStorage.removeItem('sharedFolders');
  
  toast?.({
    title: 'Settings Reset',
    description: 'Sharing settings have been reset to defaults',
  });
};
