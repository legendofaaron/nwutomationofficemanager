
/**
 * Utility functions for handling shared folders and file permissions
 */

// Check if a folder exists
export const checkFolderExists = async (folderPath: string): Promise<boolean> => {
  try {
    // In a browser environment, we can't directly check if a folder exists
    // Instead, we'll simulate it by checking localStorage
    const savedFolders = localStorage.getItem('sharedFolders');
    if (!savedFolders) return false;
    
    const folders = JSON.parse(savedFolders);
    return folders.includes(folderPath);
  } catch (error) {
    console.error('Error checking folder existence:', error);
    return false;
  }
};

// Create a shared folder
export const createSharedFolder = async (folderPath: string): Promise<boolean> => {
  try {
    // In a browser environment, we simulate folder creation
    const savedFolders = localStorage.getItem('sharedFolders');
    const folders = savedFolders ? JSON.parse(savedFolders) : [];
    
    if (!folders.includes(folderPath)) {
      folders.push(folderPath);
      localStorage.setItem('sharedFolders', JSON.stringify(folders));
    }
    
    return true;
  } catch (error) {
    console.error('Error creating shared folder:', error);
    return false;
  }
};

// Save sharing settings
export const saveSharingSettings = (settings: SharingSettings): void => {
  try {
    localStorage.setItem('sharingSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving sharing settings:', error);
  }
};

// Get sharing settings
export const getSharingSettings = (): SharingSettings => {
  try {
    const savedSettings = localStorage.getItem('sharingSettings');
    if (!savedSettings) return DEFAULT_SHARING_SETTINGS;
    
    return JSON.parse(savedSettings);
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

