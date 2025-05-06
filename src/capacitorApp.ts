
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useIsMobile } from './hooks/use-mobile';

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
      
      // Initialize haptics feedback for improved mobile experience
      Haptics.impact({ style: ImpactStyle.Medium });
      
      // Apply mobile-specific body classes
      document.body.classList.add('capacitor-app');
      
      // Adjust viewport for mobile
      const metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Add listener for device orientation changes
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          // Force layout recalculation after orientation change
          document.body.style.display = 'none';
          // Reading offsetHeight triggers a reflow
          const reflow = document.body.offsetHeight;
          document.body.style.display = '';
        }, 100);
      });
      
      // Improve tap highlight behavior on mobile
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
        input, textarea, button, select, a, div[role="button"] {
          touch-action: manipulation;
        }
      `;
      document.head.appendChild(style);
    }
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
};

// Helper to detect if we're running in a Capacitor environment
export const isCapacitorEnvironment = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Helper to provide haptic feedback on important actions
export const provideTactileFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (Capacitor.isNativePlatform()) {
    try {
      switch (type) {
        case 'light':
          Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          Haptics.impact({ style: ImpactStyle.Heavy });
          break;
      }
    } catch (error) {
      console.error('Error providing haptic feedback:', error);
    }
  }
};
