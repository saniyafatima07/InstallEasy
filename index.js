

// const { execSync } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const readline = require('readline');
// const os = require('os');

// class CppInstaller {
//     constructor() {
//         this.platform = os.platform();
//         this.isAdmin = false;
//     }

//     async init() {
//         console.log('🚀 Starting C/C++ Development Environment Installer');
        
        
//         if (this.platform !== 'win32' && this.platform !== 'darwin' && this.platform !== 'linux') {
//             throw new Error('Unsupported operating system');
//         }

        
//         if (this.platform === 'win32') {
//             try {
//                 execSync('net session', { stdio: 'ignore' });
//                 this.isAdmin = true;
//             } catch (e) {
//                 console.error('⚠️  Please run this tool as Administrator');
//                 process.exit(1);
//             }
//         }
//     }

//     async installCompiler() {
//         console.log('📦 Installing C/C++ compiler...');
        
//         if (this.platform === 'win32') {
            
//             if (!this.isCommandAvailable('choco')) {
//                 console.log('Installing Chocolatey package manager...');
//                 const chocoCmd = `@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"`;
//                 execSync(chocoCmd);
//             }

            
//             console.log('Installing MinGW compiler...');
//             execSync('choco install mingw -y');
            
            
//             const mingwPath = 'C:\\MinGW\\bin';
//             if (!process.env.PATH.includes(mingwPath)) {
//                 execSync(`setx PATH "${process.env.PATH};${mingwPath}"`);
//             }
//         }
//     }

//     async installVSCode() {
//         console.log('📝 Installing Visual Studio Code...');
        
//         if (this.platform === 'win32') {
//             if (!this.isCommandAvailable('code')) {
//                 execSync('choco install vscode -y');
//             }
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
        
//         const settings = {
//             "C_Cpp.default.compilerPath": this.platform === 'win32' ? "C:\\MinGW\\bin\\g++.exe" : "/usr/bin/g++",
//             "C_Cpp.default.intelliSenseMode": this.platform === 'win32' ? "windows-gcc-x64" : "linux-gcc-x64",
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
            
//             const version = execSync('g++ --version').toString();
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
// })();