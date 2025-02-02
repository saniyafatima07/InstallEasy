// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { CppInstaller } = require('./installer'); // Your existing installer code
const elevate = require('windows-elevate');
const isDev = require('electron-is-dev');

let mainWindow;
let isElevated = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

// Check if running with admin privileges
function checkElevation() {
    try {
        execSync('net session', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Handle installation process
async function startInstallation() {
    try {
        const installer = new CppInstaller();
        
        // Send progress updates to the UI
        const sendProgress = (message) => {
            if (mainWindow) {
                mainWindow.webContents.send('installation-progress', message);
            }
        };

        sendProgress('Starting installation...');
        await installer.init();
        
        sendProgress('Installing compiler...');
        await installer.installCompiler();
        
        sendProgress('Installing VS Code...');
        await installer.installVSCode();
        
        sendProgress('Installing extensions...');
        await installer.installExtensions();
        
        sendProgress('Configuring VS Code...');
        await installer.configureVSCode();
        
        sendProgress('Verifying installation...');
        await installer.verifyInstallation();
        
        sendProgress('Installation completed successfully!');
    } catch (error) {
        mainWindow.webContents.send('installation-error', error.message);
    }
}

// Handle the install button click from UI
ipcMain.on('start-installation', async () => {
    if (!isElevated) {
        // Restart app with elevation
        elevate.elevate(app.getPath('exe'), [], {
            waitForTermination: true,
            onElevationFailed: () => {
                mainWindow.webContents.send('elevation-failed');
            }
        });
        return;
    }
    
    await startInstallation();
});

app.whenReady().then(() => {
    isElevated = checkElevation();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});