
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "app.lovable.01b48752b4f546f3b0972535d8e730c6",
  productName: "Northwestern Automation Office Manager",
  directories: {
    output: "electron-dist",
    buildResources: "public"
  },
  files: [
    "dist/**/*",
    "electron/**/*"
  ],
  extraMetadata: {
    main: "electron/main.js",
    license: "MIT"
  },
  extraResources: [
    {
      from: "models",
      to: "models",
      filter: ["*.gguf"]
    }
  ],
  mac: {
    target: [
      {
        target: "dmg",
        arch: ["arm64", "x64"]
      },
      {
        target: "zip",
        arch: ["arm64", "x64"]
      }
    ],
    category: "public.app-category.productivity",
    icon: "public/favicon.ico",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    darkModeSupport: true,
    notarize: false,
    entitlements: "build/entitlements.mac.plist",
    entitlementsInherit: "build/entitlements.mac.plist",
    artifactName: "${productName}-${version}-${arch}.${ext}"
  },
  win: {
    target: ["nsis", "portable"],
    icon: "public/favicon.ico",
    publisherName: "Northwestern Automation",
    verifyUpdateCodeSignature: false
  },
  linux: {
    target: ["AppImage", "deb", "rpm"],
    category: "Office",
    icon: "public/favicon.ico",
    maintainer: "Northwestern Automation"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Northwestern Office Manager"
  },
  dmg: {
    backgroundColor: "#000000",
    icon: "public/favicon.ico",
    title: "${productName} ${version}",
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: "link",
        path: "/Applications"
      }
    ],
    sign: false,
    window: {
      width: 540,
      height: 380
    }
  },
  publish: {
    provider: "generic",
    url: "https://northwesternautomation.app/updates/",
    channel: "latest"
  },
  afterSign: "scripts/notarize.js",
  // Additional llama.cpp configurations
  extraFiles: [
    {
      from: "node_modules/llama-cpp-wasm/dist",
      to: "resources/llama-cpp",
      filter: ["*.wasm", "*.js"]
    }
  ],
  beforeBuild: async (context) => {
    const fs = require('fs');
    const path = require('path');
    
    // Create models directory if it doesn't exist
    const modelsDir = path.join(context.appDir, 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    console.log('Preparing llama.cpp resources...');
  },
  // Ensure Electron uses the right architecture for Apple Silicon
  electronDownload: {
    arch: process.platform === 'darwin' ? 'arm64' : undefined
  },
  electronVersion: "^28.0.0", // Use Electron version that supports arm64
}
