
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
  mac: {
    target: "dmg",
    category: "public.app-category.productivity",
    icon: "public/favicon.ico",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    darkModeSupport: true
  },
  win: {
    target: "nsis",
    icon: "public/favicon.ico"
  },
  linux: {
    target: "AppImage",
    category: "Office",
    icon: "public/favicon.ico"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  },
  dmg: {
    backgroundColor: "#000000",
    icon: "public/favicon.ico",
    title: "${productName} ${version}"
  }
};
