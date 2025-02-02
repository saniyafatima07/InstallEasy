const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

class CppInstaller {
    constructor() {
        this.vscodePath = process.platform === 'win32' 
            ? path.join(process.env.APPDATA, 'Code')
            : path.join(process.env.HOME, '.vscode');
        
        this.extensionsToInstall = [
            'ms-vscode.cpptools',
            'formulahendry.code-runner',
            'twxs.cmake',
            'ms-vscode.cmake-tools'
        ];
    }

    async init() {
        // Create necessary directories
        try {
            if (!fs.existsSync(this.vscodePath)) {
                fs.mkdirSync(this.vscodePath, { recursive: true });
            }
            return true;
        } catch (error) {
            throw new Error(`Initialization failed: ${error.message}`);
        }
    }

    async installCompiler() {
        try {
            if (process.platform === 'win32') {
                // Install MinGW using winget
                await execPromise('winget install -e --id GnuWin32.Make');
                await execPromise('winget install -e --id MinGW.MinGW');
            } else if (process.platform === 'darwin') {
                // Install gcc on macOS using brew
                await execPromise('brew install gcc');
            } else {
                // Install gcc on Linux
                await execPromise('sudo apt-get update && sudo apt-get install -y build-essential');
            }
            return true;
        } catch (error) {
            throw new Error(`Compiler installation failed: ${error.message}`);
        }
    }

    async installVSCode() {
        try {
            if (process.platform === 'win32') {
                await execPromise('winget install -e --id Microsoft.VisualStudioCode');
            } else if (process.platform === 'darwin') {
                await execPromise('brew install --cask visual-studio-code');
            } else {
                await execPromise('sudo snap install code --classic');
            }
            return true;
        } catch (error) {
            throw new Error(`VS Code installation failed: ${error.message}`);
        }
    }

    async installExtensions() {
        try {
            for (const extension of this.extensionsToInstall) {
                await execPromise(`code --install-extension ${extension} --force`);
            }
            return true;
        } catch (error) {
            throw new Error(`Extension installation failed: ${error.message}`);
        }
    }

    async configureVSCode() {
        try {
            const settings = {
                "C_Cpp.default.cppStandard": "c++17",
                "C_Cpp.default.cStandard": "c11",
                "code-runner.runInTerminal": true,
                "code-runner.saveFileBeforeRun": true,
                "files.associations": {
                    "*.hpp": "cpp",
                    "*.cpp": "cpp",
                    "*.h": "c"
                }
            };

            const settingsPath = path.join(this.vscodePath, 'User', 'settings.json');
            
            // Create User directory if it doesn't exist
            if (!fs.existsSync(path.dirname(settingsPath))) {
                fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
            }

            // Merge with existing settings if they exist
            let existingSettings = {};
            if (fs.existsSync(settingsPath)) {
                existingSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            }

            const newSettings = { ...existingSettings, ...settings };
            fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 4));
            
            return true;
        } catch (error) {
            throw new Error(`VS Code configuration failed: ${error.message}`);
        }
    }

    async verifyInstallation() {
        try {
            // Verify compiler installation
            await execPromise(process.platform === 'win32' ? 'g++ --version' : 'gcc --version');
            
            // Verify VS Code installation
            await execPromise('code --version');
            
            // Verify settings file exists
            const settingsPath = path.join(this.vscodePath, 'User', 'settings.json');
            if (!fs.existsSync(settingsPath)) {
                throw new Error('VS Code settings file not found');
            }

            return true;
        } catch (error) {
            throw new Error(`Verification failed: ${error.message}`);
        }
    }
}

module.exports = { CppInstaller };