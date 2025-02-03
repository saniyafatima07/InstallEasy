const { ipcRenderer } = require('electron');
        
        document.getElementById('startButton').addEventListener('click', () => {
            const startButton = document.getElementById('startButton');
            startButton.disabled = true;
            addProgress('Requesting administrator privileges...', '🔐');
            ipcRenderer.send('start-installation');
        });
        
        function addProgress(message, icon = '📝') {
            const progress = document.getElementById('progress');
            const messageElement = document.createElement('div');
            messageElement.className = 'progress-message';
            messageElement.innerHTML = `<span class="status-icon">${icon}</span>${message}`;
            progress.appendChild(messageElement);
            progress.scrollTop = progress.scrollHeight;
        }
        
        ipcRenderer.on('installation-progress', (event, message) => {
            const icons = {
                'Starting installation...': '🚀',
                'Installing compiler...': '⚙',
                'Installing VS Code...': '📝',
                'Installing extensions...': '🔌',
                'Configuring VS Code...': '⚡',
                'Verifying installation...': '🔍',
                'Installation completed successfully!': '✨'
            };
            addProgress(message, icons[message] || '📝');
        });
        
        ipcRenderer.on('installation-error', (event, message) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'progress-message error';
            messageElement.innerHTML = `<span class="status-icon">❌</span>Error: ${message}`;
            progress.appendChild(messageElement);
            document.getElementById('startButton').disabled = false;
        });
        
        ipcRenderer.on('elevation-failed', () => {
            addProgress('Failed to get administrator privileges. Please run the installer as administrator.', '⚠');
            document.getElementById('startButton').disabled = false;
        });
