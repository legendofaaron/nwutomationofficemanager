
# Office Manager - 100% Free Software
<img width="1005" alt="light and dark mode " src="https://github.com/user-attachments/assets/3920a9bc-b4f9-43c5-8ece-803d06aeb412" />


## Overview

Office Manager is a completely free solution for document management, schedule organization, and enhanced workplace productivity. It's available at no cost for both commercial and personal use.

## Features

- **Document Management**: Create, edit, and organize documents with AI assistance
- **Knowledge Base**: Build and maintain a searchable company knowledge base
- **Office Management**: Schedule management, team coordination, and productivity tools
- **Intelligent Assistant**: AI-powered assistance for various office tasks
- **100% Free**: All features available at no cost

## Project info

**URL**: https://lovable.dev/projects/01b48752-b4f5-46f3-b097-2535d8e730c6

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/01b48752-b4f5-46f3-b097-2535d8e730c6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/lovable-labs/office-manager.git

# Step 2: Navigate to the project directory.
cd office-manager

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Download Options

You can download the source code in several ways:

1. Clone the repository using Git
2. Download as ZIP from the GitHub repository
3. Use the download button in the app interface

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Electron (for desktop applications)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/01b48752-b4f5-46f3-b097-2535d8e730c6) and click on Share -> Publish.

## Building Desktop Applications

To build the desktop application:

```sh
# Build the web application
npm run build

# Build the desktop application for all platforms
npx electron-builder build

# Build specifically for Apple Silicon (M1/M2/M3 Macs)
npx electron-builder build --mac --arm64
```

### Apple Silicon Support

The application is fully optimized for Apple Silicon (M1/M2/M3) processors. The .dmg file created by the build process will work natively on Apple Silicon, providing maximum performance without Rosetta translation.

Key features of the Apple Silicon build:
- Native ARM64 architecture support
- Optimized performance for M1/M2/M3 chips
- Reduced power consumption compared to x86 builds
- Full hardware acceleration for machine learning features

## Support Development

If you find Office Manager useful, please consider supporting its development with a tip at https://www.paypal.me/aaronthelegend

## Contact

For questions or support, please open an issue on the GitHub repository or contact us at northwesternautomation@gmail.com
