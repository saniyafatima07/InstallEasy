

// const { execSync } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');

// class CppInstaller {
//     constructor() {
//         this.platform = os.platform();
//         this.isAdmin = false;
//     }

//     async init() {
//         console.log('🚀 Starting C/C++ Development Environment Installer');
        
//         switch(this.platform) {
//             case 'darwin':
//                 console.log('📍 Detected macOS');
//                 await this.checkBrewInstallation();
//                 break;
//             case 'linux':
//                 console.log('📍 Detected Linux');
//                 await this.checkSudo();
//                 break;
//             case 'win32':
//                 console.log('📍 Detected Windows');
//                 await this.checkAdmin();
//                 break;
//             default:
//                 throw new Error('Unsupported operating system');
//         }
//     }

//     async checkBrewInstallation() {
//         if (!this.isCommandAvailable('brew')) {
//             console.log('Installing Homebrew...');
//             const brewInstallCmd = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';
//             execSync(brewInstallCmd, { stdio: 'inherit' });
//         }
//     }

//     async checkSudo() {
//         try {
//             execSync('sudo -v');
//             this.isAdmin = true;
//         } catch (e) {
//             console.error('⚠️  Please run with sudo privileges');
//             process.exit(1);
//         }
//     }

//     async checkAdmin() {
//         try {
//             execSync('net session', { stdio: 'ignore' });
//             this.isAdmin = true;
//         } catch (e) {
//             console.error('⚠️  Please run as Administrator');
//             process.exit(1);
//         }
//     }

//     async installCompiler() {
//         console.log('📦 Installing C/C++ compiler...');
        
//         switch(this.platform) {
//             case 'darwin':
                
//                 execSync('brew install llvm gcc', { stdio: 'inherit' });
//                 break;
                
//             case 'linux':
                
//                 let installCmd = '';
//                 if (fs.existsSync('/etc/debian_version')) {
                   
//                     execSync('sudo apt-get update', { stdio: 'inherit' });
//                     installCmd = 'sudo apt-get install -y build-essential gdb';
//                 } else if (fs.existsSync('/etc/fedora-release')) {
                    
//                     installCmd = 'sudo dnf install -y gcc gcc-c++ gdb';
//                 } else if (fs.existsSync('/etc/arch-release')) {
                    
//                     installCmd = 'sudo pacman -S --noconfirm base-devel gdb';
//                 }
                
//                 if (installCmd) {
//                     execSync(installCmd, { stdio: 'inherit' });
//                 } else {
//                     console.warn('⚠️  Unable to detect Linux distribution. Please install C++ compiler manually.');
//                 }
//                 break;
                
//             case 'win32':
                
//                 if (!this.isCommandAvailable('choco')) {
//                     console.log('Installing Chocolatey...');
//                     const chocoCmd = `@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"`;
//                     execSync(chocoCmd);
//                 }
//                 execSync('choco install mingw -y');
//                 break;
//         }
//     }

//     async installVSCode() {
//         console.log('📝 Installing Visual Studio Code...');
        
//         switch(this.platform) {
//             case 'darwin':
//                 execSync('brew install --cask visual-studio-code', { stdio: 'inherit' });
//                 break;
                
//             case 'linux':
//                 if (fs.existsSync('/etc/debian_version')) {
                    
//                     execSync('sudo apt-get install -y wget gpg', { stdio: 'inherit' });
//                     execSync('wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg', { stdio: 'inherit' });
//                     execSync('sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/', { stdio: 'inherit' });
//                     execSync('sudo sh -c \'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list\'', { stdio: 'inherit' });
//                     execSync('sudo apt-get update', { stdio: 'inherit' });
//                     execSync('sudo apt-get install -y code', { stdio: 'inherit' });
//                 } else if (fs.existsSync('/etc/fedora-release')) {
                   
//                     execSync('sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc', { stdio: 'inherit' });
//                     execSync('sudo sh -c \'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo\'', { stdio: 'inherit' });
//                     execSync('sudo dnf install -y code', { stdio: 'inherit' });
//                 }
//                 break;
                
//             case 'win32':
//                 execSync('choco install vscode -y');
//                 break;
//         }
//     }

//     async installExtensions() {
//         console.log('🔌 Installing VS Code extensions...');
        
//         const extensions = [
//             'ms-vscode.cpptools',
//             'ms-vscode.cpptools-extension-pack',
//             'ms-vscode.cmake-tools'
//         ];

//         for (const ext of extensions) {
//             console.log(`Installing ${ext}...`);
//             execSync(`code --install-extension ${ext}`);
//         }
//     }

//     async configureVSCode() {
//         console.log('⚙️  Configuring VS Code settings...');
        
//         let compilerPath;
//         let intelliSenseMode;
        
//         switch(this.platform) {
//             case 'darwin':
//                 compilerPath = "/usr/local/opt/llvm/bin/clang++";
//                 intelliSenseMode = "macos-clang-x64";
//                 break;
//             case 'linux':
//                 compilerPath = "/usr/bin/g++";
//                 intelliSenseMode = "linux-gcc-x64";
//                 break;
//             case 'win32':
//                 compilerPath = "C:\\MinGW\\bin\\g++.exe";
//                 intelliSenseMode = "windows-gcc-x64";
//                 break;
//         }

//         const settings = {
//             "C_Cpp.default.compilerPath": compilerPath,
//             "C_Cpp.default.intelliSenseMode": intelliSenseMode,
//             "C_Cpp.default.cStandard": "c11",
//             "C_Cpp.default.cppStandard": "c++17"
//         };

//         const settingsPath = path.join(os.homedir(), '.vscode', 'settings.json');
//         fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
//         fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
//     }

//     isCommandAvailable(command) {
//         try {
//             execSync(this.platform === 'win32' ? `where ${command}` : `which ${command}`, { stdio: 'ignore' });
//             return true;
//         } catch {
//             return false;
//         }
//     }

//     async verifyInstallation() {
//         console.log('🔍 Verifying installation...');
        
//         try {
            
//             const compilerCmd = this.platform === 'darwin' ? 'clang++ --version' : 'g++ --version';
//             const version = execSync(compilerCmd).toString();
//             console.log('✅ Compiler installed successfully');
            
            
//             if (this.isCommandAvailable('code')) {
//                 console.log('✅ VS Code installed successfully');
//             }
            
//             console.log('\n✨ Installation completed successfully!');
//             console.log('Please restart your terminal to apply PATH changes.');
//         } catch (error) {
//             console.error('❌ Verification failed:', error.message);
//             throw error;
//         }
//     }
// }


// const installer = new CppInstaller();

// (async () => {
//     try {
//         await installer.init();
//         await installer.installCompiler();
//         await installer.installVSCode();
//         await installer.installExtensions();
//         await installer.configureVSCode();
//         await installer.verifyInstallation();
//     } catch (error) {
//         console.error('❌ Installation failed:', error.message);
//         process.exit(1);
//     }
// })();/