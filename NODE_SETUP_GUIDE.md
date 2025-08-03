# Node.js Setup Guide for macOS

You need to install Node.js and npm to run this realtor platform. Here are the recommended installation methods:

## Option 1: Official Node.js Installer (Recommended)

1. **Download Node.js**:
   - Visit: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Choose the macOS installer (.pkg file)

2. **Install**:
   - Double-click the downloaded .pkg file
   - Follow the installation wizard
   - This will install both Node.js and npm

3. **Verify Installation**:
   ```bash
   node --version
   npm --version
   ```

## Option 2: Using Homebrew (If you have admin access)

If you have administrator privileges on your Mac:

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   ```bash
   brew install node
   ```

## Option 3: Node Version Manager (nvm) - No Admin Required

This is the best option if you don't have admin access:

1. **Install nvm**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Restart your terminal** or run:
   ```bash
   source ~/.zshrc
   ```

3. **Install Node.js**:
   ```bash
   nvm install --lts
   nvm use --lts
   ```

## Option 4: Volta (Alternative Node Manager)

1. **Install Volta**:
   ```bash
   curl https://get.volta.sh | bash
   ```

2. **Restart terminal** and install Node.js:
   ```bash
   volta install node
   ```

## After Installation

Once Node.js is installed, navigate to your project directory and run:

```bash
cd /Users/marcosyadiel/Desktop/Code/VS/REALTORAPP
npm install
npm run dev
```

## Troubleshooting

- **Permission Issues**: If you get permission errors, try using nvm (Option 3)
- **Command Not Found**: Restart your terminal after installation
- **Old Version**: Make sure you're installing Node.js 18+ for this project

## Next Steps

After installing Node.js:
1. Run `npm install` in the project directory
2. Follow the QUICK_START.md guide
3. Set up your Firebase project
4. Start developing your realtor platform!