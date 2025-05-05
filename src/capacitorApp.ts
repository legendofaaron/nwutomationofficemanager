
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Haptics } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const initializeCapacitorPlugins = async () => {
  try {
    // Check if we're running in a native context (iOS/Android)
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      // Hide the splash screen
      await SplashScreen.hide();
      
      // Set status bar style
      await StatusBar.setStyle({ style: 'dark' });
      await StatusBar.setBackgroundColor({ color: '#000000' });
      
      // Initialize push notifications
      await PushNotifications.requestPermissions();
      await PushNotifications.register();
      
      // Add push notification listeners
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success:', token.value);
      });
      
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });
      
      // Initialize haptics feedback
      Haptics.addListener('tap', () => {
        Haptics.impact({ style: 'medium' });
      });
    }
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
};
