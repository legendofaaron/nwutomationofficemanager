
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
    main: "electron/main.js"
  },
  mac: {
    target: ["dmg", "zip"],
    category: "public.app-category.productivity",
    icon: "public/favicon.ico",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    darkModeSupport: true,
    notarize: false, // Set to true if you have Apple Developer ID
    entitlements: "build/entitlements.mac.plist",
    entitlementsInherit: "build/entitlements.mac.plist"
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
    ]
  },
  publish: {
    provider: "generic",
    url: "https://your-update-server.com/",
    channel: "latest"
  },
  afterSign: "scripts/notarize.js"
};
