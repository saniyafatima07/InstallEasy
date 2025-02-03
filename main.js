const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execSync } = require('child_process');
const { CppInstaller } = require('./installer.js');
const elevate = require('windows-elevate');
const isDev = require('electron-is-dev');
const url = require("url");

let mainWindow ;
let isElevated = false;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Note: In production, you should use contextIsolation: true with a preload script
        }
    });

    // Load the index.html file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'frontend/index.html'),
        protocol: 'file' ,
        slashes: true
    }));

    // Open DevTools in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

    // App event handlers
    app.whenReady().then(() => {
    isElevated = checkElevation();
    createWindow();

    // macOS-specific: Create a new window when app is activated with no windows
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Handle window-all-closed event
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// Check if running with admin privileges
function checkElevation() {
    try {
        execSync('net session', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
        //console.log("Not admitted");
    }
}

// Handle installation process
async function startInstallation() {
    if (!mainWindow) return;

    try {
        const installer = new CppInstaller();
        
        // Send progress updates to the UI
        const sendProgress = (message) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
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
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('installation-error', error.message);
        }
    }
}
 

// IPC handlers
ipcMain.on('start-installation', async () => {
    if (!isElevated) {
        // Restart app with elevation on Windows
        if (process.platform === 'win32') {
            elevate.elevate(app.getPath('exe'), [], {
                waitForTermination: true,
                onElevationFailed: () => {
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('elevation-failed');
                    }
                }
            });
            return;
        } else {
            // For non-Windows platforms, send error
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('installation-error', 'Administrator privileges required');
            }
             return;
        }
    }
    
    await startInstallation();
});