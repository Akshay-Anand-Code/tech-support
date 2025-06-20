document.addEventListener('DOMContentLoaded', () => {
    initializeDesktop();
    initializeStartMenu();
    initializePopups();
    updateClock();
    setInterval(updateClock, 60000); // Update clock every minute
});

/**
 * Initialize desktop icon functionality
 */
function initializeDesktop() {
    // Add click effects to desktop icons
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    desktopIcons.forEach(icon => {
        // Handle single click (open directly)
        icon.addEventListener('click', (e) => {
            // First deselect all other icons
            desktopIcons.forEach(otherIcon => {
                if (otherIcon !== icon) {
                    otherIcon.classList.remove('selected');
                }
            });
            
            // Select this icon
            icon.classList.add('selected');
            
            // Open the window directly on single click
            const iconType = icon.querySelector('.icon-label').textContent.trim();
            
            switch(iconType) {
                case 'My Computer':
                    showFakeWindow('My Computer', '<i class="fas fa-desktop"></i>', 'COMPUTER UNDER ATTACK');
                    break;
                case 'My Documents':
                    showFakeWindow('My Documents', '<i class="fas fa-folder"></i>', 'Your documents appear to be encrypted by dangerous virus!');
                    break;
                case 'Recycle Bin':
                    showFakeWindow('Recycle Bin', '<i class="fas fa-trash-alt"></i>', 'Critical system files found in Recycle Bin! Do not empty!');
                    break;
                default:
                    break;
            }
        });
    });
    
    // Clear selected icons when clicking on desktop background
    document.querySelector('.desktop').addEventListener('click', (e) => {
        if (e.target.classList.contains('desktop')) {
            desktopIcons.forEach(icon => {
                icon.classList.remove('selected');
            });
        }
    });
}

/**
 * Initialize start menu functionality
 */
function initializeStartMenu() {
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('startMenu');
    
    // Toggle start menu when button is clicked
    startButton.addEventListener('click', () => {
        startMenu.classList.toggle('visible');
        startButton.classList.toggle('active');
        
        // Hide start menu when clicking elsewhere
        function hideStartMenu(e) {
            if (!startMenu.contains(e.target) && e.target !== startButton) {
                startMenu.classList.remove('visible');
                startButton.classList.remove('active');
                document.removeEventListener('click', hideStartMenu);
            }
        }
        
        // Only add the event listener if the start menu is visible
        if (startMenu.classList.contains('visible')) {
            // Use setTimeout to avoid immediate triggering
            setTimeout(() => {
                document.addEventListener('click', hideStartMenu);
            }, 0);
        }
    });
    
    // Handle start menu items
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemName = item.querySelector('.item-name').textContent.trim();
            
            switch(itemName) {
                case 'Internet Explorer':
                    showFakeWindow('Internet Explorer', '<i class="fas fa-globe"></i>', 'Internet Explorer has stopped working due to virus attack!');
                    break;
                case 'Control Panel':
                    showFakeWindow('Control Panel', '<i class="fas fa-cogs"></i>', 'WARNING: Security settings compromised! Contact Microsoft immediately!');
                    break;
                case 'My Computer':
                    showFakeWindow('My Computer', '<i class="fas fa-desktop"></i>', 'This feature is not available in this demo.');
                    break;
                case 'Shut Down':
                    showShutdownDialog();
                    break;
                default:
                    break;
            }
            
            // Hide start menu after selection
            startMenu.classList.remove('visible');
            startButton.classList.remove('active');
        });
    });
}

/**
 * Initialize popup windows and controls
 */
function initializePopups() {
    // Handle window controls (minimize, maximize, close)
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            const windowElement = button.closest('.window');
            
            if (button.classList.contains('close')) {
                // For main chat window, just minimize instead of closing
                if (windowElement.id === 'chatWindow') {
                    windowElement.classList.add('minimized');
                    addToTaskbar('AI Tech Support Chat', '💬', 'chatWindow');
                } else {
                    windowElement.remove();
                }
            } else if (button.classList.contains('minimize')) {
                windowElement.classList.add('minimized');
                
                // Add to taskbar if it's not already there
                const windowTitle = windowElement.querySelector('.window-title').textContent.trim();
                const windowIcon = windowElement.querySelector('.window-icon').textContent;
                addToTaskbar(windowTitle, windowIcon, windowElement.id);
            } else if (button.classList.contains('maximize')) {
                windowElement.classList.toggle('maximized');
                
                // Change the maximize button to a restore button
                button.innerHTML = windowElement.classList.contains('maximized') ? '❐' : '□';
            }
        });
    });
    
    // Handle popup close button
    const popupClose = document.querySelector('.popup-close');
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            const popup = popupClose.closest('.fake-popup');
            popup.style.display = 'none';
        });
    }
    
    // Handle popup buttons
    const popupButtons = document.querySelectorAll('.popup-btn');
    popupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isDownloadBtn = button.classList.contains('danger');
            if (isDownloadBtn) {
                showVirusInstallPopup();
            } else {
                // Show another warning if they try to ignore
                showFakeWindow('Security Warning', '<i class="fas fa-exclamation-triangle"></i>', 'WARNING! Ignoring this virus will result in permanent damage to your computer! Please call our tech support immediately!');
            }
            
            // Hide the popup
            const popup = button.closest('.fake-popup');
            popup.style.display = 'none';
        });
    });
}

/**
 * Create and show a fake window with the given title and content
 */
function showFakeWindow(title, icon, content) {
    // Generate a unique ID for the window
    const windowId = 'window-' + Date.now();
    
    // Create the window HTML
    const windowHTML = `
        <div class="window fake-window" id="${windowId}">
            <div class="window-header">
                <div class="window-title">
                    <span class="window-icon">${icon}</span>
                    ${title}
                </div>
                <div class="window-controls">
                    <button class="control-btn minimize">−</button>
                    <button class="control-btn maximize">□</button>
                    <button class="control-btn close">×</button>
                </div>
            </div>
            <div class="window-content">
                <div class="fake-window-content">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    // Add the window to the desktop
    document.querySelector('.desktop').insertAdjacentHTML('beforeend', windowHTML);
    
    // Make the window draggable
    makeWindowDraggable(document.getElementById(windowId));
    
    // Add to taskbar
    addToTaskbar(title, icon, windowId);
    
    // Initialize window controls for the new window
    const newWindow = document.getElementById(windowId);
    initializeWindowControls(newWindow);
    
    // Focus the new window
    focusWindow(newWindow);
    
    return newWindow;
}

/**
 * Initialize window controls for a specific window
 */
function initializeWindowControls(windowElement) {
    const controlButtons = windowElement.querySelectorAll('.control-btn');
    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('close')) {
                windowElement.remove();
                // Remove from taskbar
                const taskbarItem = document.querySelector(`[data-window="${windowElement.id}"]`);
                if (taskbarItem) taskbarItem.remove();
            } else if (button.classList.contains('minimize')) {
                windowElement.classList.add('minimized');
                // Add to taskbar if not already there
                const windowTitle = windowElement.querySelector('.window-title').textContent.trim();
                const windowIcon = windowElement.querySelector('.window-icon').textContent;
                addToTaskbar(windowTitle, windowIcon, windowElement.id);
            } else if (button.classList.contains('maximize')) {
                windowElement.classList.toggle('maximized');
                button.innerHTML = windowElement.classList.contains('maximized') ? '❐' : '□';
            }
        });
    });
    
    // Make the window draggable
    makeWindowDraggable(windowElement);
}

/**
 * Make a window element draggable by its header
 */
function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', (e) => {
        // Don't drag if window is maximized or if clicking a control button
        if (windowElement.classList.contains('maximized') || 
            e.target.classList.contains('control-btn')) {
            return;
        }
        
        isDragging = true;
        offsetX = e.clientX - windowElement.getBoundingClientRect().left;
        offsetY = e.clientY - windowElement.getBoundingClientRect().top;
        
        // Focus this window
        focusWindow(windowElement);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            windowElement.style.left = (e.clientX - offsetX) + 'px';
            windowElement.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

/**
 * Focus a window by bringing it to the front
 */
function focusWindow(windowElement) {
    // Lower z-index of all windows
    document.querySelectorAll('.window').forEach(win => {
        win.style.zIndex = 100;
    });
    
    // Raise z-index of this window
    windowElement.style.zIndex = 101;
    
    // Update active state in taskbar
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.window === windowElement.id) {
            item.classList.add('active');
        }
    });
}

/**
 * Add an item to the taskbar
 */
function addToTaskbar(title, icon, windowId) {
    // Check if this window already has a taskbar item
    let taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
    
    if (!taskbarItem) {
        // Create new taskbar item
        const taskbarItemHTML = `
            <div class="taskbar-item" data-window="${windowId}">
                <span class="app-icon">${icon}</span>
                ${title}
            </div>
        `;
        
        document.querySelector('.taskbar-items').insertAdjacentHTML('beforeend', taskbarItemHTML);
        
        // Add click handler to the new taskbar item
        taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
        taskbarItem.addEventListener('click', () => {
            const windowElement = document.getElementById(windowId);
            
            if (windowElement) {
                if (windowElement.classList.contains('minimized')) {
                    windowElement.classList.remove('minimized');
                    focusWindow(windowElement);
                } else {
                    // Toggle minimize if window is already visible
                    windowElement.classList.add('minimized');
                    taskbarItem.classList.remove('active');
                }
            }
        });
    }
    
    // Set the taskbar item as active
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.classList.remove('active');
    });
    taskbarItem.classList.add('active');
}

/**
 * Show a fake shutdown dialog
 */
function showShutdownDialog() {
    const dialogHTML = `
        <div class="window shutdown-dialog" id="shutdown-dialog">
            <div class="window-header">
                <div class="window-title">
                    <span class="window-icon"><i class="fas fa-exclamation-triangle"></i></span>
                    System Shutdown
                </div>
                <div class="window-controls">
                    <button class="control-btn close">×</button>
                </div>
            </div>
            <div class="window-content">
                <div class="shutdown-content">
                    <p>WARNING: Your system is infected with dangerous viruses!</p>
                    <p>Shutting down is not recommended until viruses are removed.</p>
                    <p>Please contact Microsoft Technical Support before shutting down.</p>
                    <div class="shutdown-buttons">
                        <button class="shutdown-btn">Shut Down Anyway</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.desktop').insertAdjacentHTML('beforeend', dialogHTML);
    
    const shutdownDialog = document.getElementById('shutdown-dialog');
    makeWindowDraggable(shutdownDialog);
    focusWindow(shutdownDialog);
    
    // Handle dialog buttons
    shutdownDialog.querySelector('.shutdown-btn').addEventListener('click', () => {
        showBlueScreen();
        shutdownDialog.remove();
    });
    
    shutdownDialog.querySelector('.cancel-btn').addEventListener('click', () => {
        shutdownDialog.remove();
    });
    
    shutdownDialog.querySelector('.control-btn.close').addEventListener('click', () => {
        shutdownDialog.remove();
    });
}

/**
 * Show a fake blue screen of death
 */
function showBlueScreen() {
    const blueScreenHTML = `
        <div class="blue-screen">
            <div class="bsod-content">
                <h1>A problem has been detected and Windows has been shut down to prevent damage to your computer.</h1>
                
                <p>VIRUS_INFECTION_DETECTED</p>
                
                <p>If this is the first time you've seen this error screen, contact Microsoft Technical Support immediately.</p>
                
                <p>Technical Information:</p>
                <p>*** STOP: 0x000000D1 (0x00000044, 0x00000002, 0x00000000, 0xF73A89C2)</p>
                
                <p class="bsod-continue">Press any key to return to Windows...</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', blueScreenHTML);
    
    // Hide everything except the blue screen
    document.querySelector('.desktop').style.display = 'none';
    
    // Allow user to return to Windows by pressing any key
    document.addEventListener('keydown', removeBsod);
    document.addEventListener('click', removeBsod);
    
    function removeBsod() {
        document.querySelector('.blue-screen').remove();
        document.querySelector('.desktop').style.display = 'block';
        document.removeEventListener('keydown', removeBsod);
        document.removeEventListener('click', removeBsod);
    }
}

/**
 * Update the clock in the taskbar
 */
function updateClock() {
    const clock = document.querySelector('.clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// --- Virus Install Popup Logic ---
window.showVirusInstallPopup = showVirusInstallPopup;

function showVirusInstallPopup() {
    const popup = document.getElementById('virusInstallPopup');
    if (!popup) return;
    popup.style.display = 'block';
    let percent = 0;
    const fill = document.getElementById('virusLoadingFill');
    const percentText = document.getElementById('virusPercent');
    const message = document.getElementById('virusMessage');
    const desktop = document.querySelector('.desktop');
    fill.style.width = '0%';
    percentText.textContent = '0%';
    message.textContent = 'Downloading premium virus protection...';
    message.classList.remove('glitch-text');
    desktop.classList.remove('glitchy');
    let interval = setInterval(() => {
        percent += Math.random() * 5 + 2;
        if (percent > 100) percent = 100;
        fill.style.width = percent + '%';
        percentText.textContent = Math.floor(percent) + '%';
        if (percent >= 100) {
            clearInterval(interval);
            message.textContent = "Virus installed! System compromised!";
            message.classList.add('glitch-text');
            message.setAttribute('data-text', message.textContent);
            desktop.classList.add('glitchy');
            setTimeout(() => {
                desktop.classList.remove('glitchy');
                popup.style.display = 'none';
                showCreditCardPopup();
            }, 3000);
        }
    }, 80);
}

function showCreditCardPopup() {
    const popup = document.getElementById('creditCardPopup');
    if (popup) popup.style.display = 'block';
}

function closeCreditCardPopup() {
    const popup = document.getElementById('creditCardPopup');
    if (popup) popup.style.display = 'none';
}

function fakeSubmitCreditCard() {
    const form = document.getElementById('creditCardForm');
    if (form) {
        form.reset();
    }
    alert('Thank you for your submission! (Not really)');
    closeCreditCardPopup();
} 