
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useIsMobile } from './hooks/use-mobile';

const IS_PRODUCTION = import.meta.env.MODE === 'production';

export const initializeCapacitorPlugins = async () => {
  try {
    // Check if we're running in a native context (iOS/Android)
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      // Hide the splash screen
      await SplashScreen.hide({
        fadeOutDuration: 500 // smoother transition in production
      });
      
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
      
      // Initialize push notifications with better error handling
      try {
        const permissionStatus = await PushNotifications.requestPermissions();
        if (permissionStatus.receive === 'granted') {
          await PushNotifications.register();
        }
      } catch (pushError) {
        console.error('Push notification initialization failed:', pushError);
        // Continue app initialization even if push fails
      }
      
      // Add push notification listeners
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success:', token.value);
        
        // In production, you might want to send this token to your server
        if (IS_PRODUCTION) {
          // Send token to your backend
          try {
            fetch('/api/register-device', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: token.value })
            });
          } catch (e) {
            // Silent fail in production
            console.error('Failed to register push token with server');
          }
        }
      });
      
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        
        // Provide haptic feedback when notification is received
        Haptics.impact({ style: ImpactStyle.Medium });
      });
      
      // Initialize haptics feedback for improved mobile experience
      Haptics.impact({ style: ImpactStyle.Medium });
      
      // Apply mobile-specific body classes
      document.body.classList.add('capacitor-app');
      
      // Add production class if needed
      if (IS_PRODUCTION) {
        document.body.classList.add('production-mode');
      }
      
      // Adjust viewport for mobile
      const metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Add listener for device orientation changes with better performance handling
      window.addEventListener('orientationchange', () => {
        // Use requestAnimationFrame for smoother transitions on orientation change
        requestAnimationFrame(() => {
          // Force layout recalculation after orientation change
          document.body.style.display = 'none';
          // Reading offsetHeight triggers a reflow
          const reflow = document.body.offsetHeight;
          document.body.style.display = '';
        });
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
        .production-mode .debug-only {
          display: none !important; 
        }
      `;
      document.head.appendChild(style);
      
      // Add error tracking for production
      if (IS_PRODUCTION) {
        window.addEventListener('error', (event) => {
          console.error('Global error caught:', event.error);
          // Here you would typically send to error tracking service
        });
      }
    }
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
    // Fail gracefully in production
    if (!IS_PRODUCTION) {
      throw error; // Only rethrow in development
    }
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
      // Silent fail in production
      if (!IS_PRODUCTION) {
        console.error('Error providing haptic feedback:', error);
      }
    }
  }
};

// Production-ready initialization
export const initializeApp = async () => {
  try {
    await initializeCapacitorPlugins();
    return true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return false;
  }
};
