
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
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
      await StatusBar.setStyle({ style: Style.Dark });
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
      Haptics.impact({ style: ImpactStyle.Medium });
      
      // Note: Haptics doesn't have an addListener method in current API
      // We'll trigger haptic feedback in response to specific app actions instead
    }
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
};
