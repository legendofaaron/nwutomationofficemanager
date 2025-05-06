
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.01b48752b4f546f3b0972535d8e730c6',
  appName: 'Northwestern Office Manager',
  webDir: 'dist',
  server: {
    url: 'https://northwesternautomation.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
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
      backgroundColor: "#000000",
      overlaysWebView: false,
      translucent: true
    },
    Keyboard: {
      resize: true,
      resizeOnFullScreen: true,
      style: "dark"
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#1E90FF"
    },
    CapacitorHttp: {
      enabled: true
    },
    CapacitorCookies: {
      enabled: true
    },
    Device: {
      overrideUserAgent: 'Northwestern Office Manager Mobile App'
    },
    PrivacyScreen: {
      enable: true
    }
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#000000",
    allowsLinkPreview: true
  },
  android: {
    backgroundColor: "#000000", 
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  loggingBehavior: 'production'
};

export default config;
