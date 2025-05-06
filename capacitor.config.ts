
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.01b48752b4f546f3b0972535d8e730c6',
  appName: 'nwutomationofficemanager',
  webDir: 'dist',
  server: {
    url: 'https://01b48752-b4f5-46f3-b097-2535d8e730c6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#1E90FF",
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Haptics: {
      enableVibrationOnTap: true
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000"
    },
    Keyboard: {
      resize: true,
      resizeOnFullScreen: true
    }
  }
};

export default config;
