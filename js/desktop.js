let glitchIntervalId = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeDesktop();
    initializeStartMenu();
    initializePopups();
    initializeSolanaButton();
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
    // Start the chaotic glitching effect
    startChaoticGlitch();
    
    // After the glitch effect, show the normal virus popup
    setTimeout(() => {
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
    }, 4000); // Wait 4 seconds for the glitch effect to complete
}

function startChaoticGlitch() {
    const desktop = document.querySelector('.desktop');
    const body = document.body;
    
    // Add red tint overlay
    const redOverlay = document.createElement('div');
    redOverlay.id = 'redOverlay';
    redOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 0, 0.3);
        z-index: 9998;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.1s;
    `;
    body.appendChild(redOverlay);
    
    // Create multiple fake popups
    const fakePopupMessages = [
        "CRITICAL ERROR: System compromised!",
        "VIRUS DETECTED: Immediate action required!",
        "WARNING: Your computer is under attack!",
        "SECURITY BREACH: Contact support NOW!",
        "MALWARE ALERT: System files corrupted!",
        "EMERGENCY: Your data is being stolen!",
        "HACKER DETECTED: System lockdown initiated!",
        "FATAL ERROR: Windows security compromised!",
        "INTRUSION ALERT: Foreign IP detected!",
        "SYSTEM FAILURE: Critical files missing!"
    ];
    
    let popupCount = 0;
    const maxPopups = 8;
    
    // Function to create a random fake popup
    function createFakePopup() {
        if (popupCount >= maxPopups) return;
        
        const popup = document.createElement('div');
        popup.className = 'chaotic-popup';
        popup.style.cssText = `
            position: fixed;
            top: ${Math.random() * (window.innerHeight - 200)}px;
            left: ${Math.random() * (window.innerWidth - 300)}px;
            width: 300px;
            background: #ff0000;
            color: white;
            border: 3px solid #ffff00;
            padding: 20px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 0 20px #ff0000;
            animation: chaoticPopupShake 0.1s infinite;
            text-align: center;
        `;
        
        const message = fakePopupMessages[Math.floor(Math.random() * fakePopupMessages.length)];
        popup.innerHTML = `
            <div style="margin-bottom: 10px;">⚠️ ${message} ⚠️</div>
            <div style="font-size: 12px; color: #ffff00;">
                ${Math.floor(Math.random() * 9999)} ERRORS DETECTED<br>
                SYSTEM: ${Math.floor(Math.random() * 100)}% COMPROMISED
            </div>
        `;
        
        body.appendChild(popup);
        popupCount++;
        
        // Remove popup after random time
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
                popupCount--;
            }
        }, 500 + Math.random() * 1000);
    }
    
    // Start the chaotic sequence
    let glitchPhase = 0;
    const glitchInterval = setInterval(() => {
        glitchPhase++;
        
        // Phase 1: Start red tint and first popups
        if (glitchPhase <= 10) {
            redOverlay.style.opacity = Math.min(0.3, glitchPhase * 0.03);
            if (Math.random() < 0.3) createFakePopup();
        }
        // Phase 2: Intense glitching
        else if (glitchPhase <= 20) {
            redOverlay.style.opacity = 0.3 + Math.random() * 0.2;
            desktop.classList.add('glitchy');
            if (Math.random() < 0.6) createFakePopup();
        }
        // Phase 3: Peak chaos
        else if (glitchPhase <= 30) {
            redOverlay.style.opacity = 0.4 + Math.random() * 0.3;
            if (Math.random() < 0.8) createFakePopup();
            // Random screen shake
            if (Math.random() < 0.3) {
                body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                setTimeout(() => {
                    body.style.transform = '';
                }, 50);
            }
        }
        // Phase 4: Wind down
        else if (glitchPhase <= 40) {
            redOverlay.style.opacity = Math.max(0, 0.4 - (glitchPhase - 30) * 0.04);
            desktop.classList.remove('glitchy');
            if (Math.random() < 0.2) createFakePopup();
        }
        // End the chaos
        else {
            clearInterval(glitchInterval);
            redOverlay.remove();
            desktop.classList.remove('glitchy');
            body.style.transform = '';
        }
    }, 100);
}

function showCreditCardPopup() {
    const popup = document.getElementById('creditCardPopup');
    if (popup) {
        popup.style.display = 'block';
    }

    // Don't start a new interval if one is already running
    if (glitchIntervalId) return;

    // Start the first glitch immediately
    startChaoticGlitch();

    // Set the repeating glitch every 10 seconds
    glitchIntervalId = setInterval(() => {
        startChaoticGlitch();

        // The glitch runs for 4 seconds. After it's done, re-show the popup
        // in case the user closed it.
        setTimeout(() => {
            const popup = document.getElementById('creditCardPopup');
            if (popup) {
                popup.style.display = 'block';
            }
        }, 4000);
    }, 10000);
}
window.showCreditCardPopup = showCreditCardPopup;

function closeCreditCardPopup() {
    const popup = document.getElementById('creditCardPopup');
    if (popup) popup.style.display = 'none';
    // We don't clear the interval here, so the chaos will continue!
}
window.closeCreditCardPopup = closeCreditCardPopup;

function fakeSubmitCreditCard() {
    // Stop the repeating chaos
    if (glitchIntervalId) {
        clearInterval(glitchIntervalId);
        glitchIntervalId = null;
    }

    const form = document.getElementById('creditCardForm');
    if (form) {
        form.reset();
    }
    closeCreditCardPopup();

    // Show a more "official" confirmation window instead of an alert
    showFakeWindow(
        'Payment Successful', 
        '<i class="fas fa-check-circle" style="color: #28a745;"></i>', 
        'Your payment of $299 has been processed. Thank you for your cooperation, my friend. Your computer is now 100% secure, I promise.'
    );
}
window.fakeSubmitCreditCard = fakeSubmitCreditCard;

function initializeSolanaButton() {
    const solanaButton = document.getElementById('solanaButton');
    const solanaSound = document.getElementById('solanaSound');

    if (solanaButton && solanaSound) {
        solanaButton.addEventListener('click', () => {
            solanaSound.currentTime = 0; // Rewind to the start
            solanaSound.play().catch(error => {
                // Autoplay was prevented.
                console.warn("Audio play failed:", error);
            });
            
            // Show a scammy confirmation window
            showFakeWindow(
                'CONGRATULATIONS!',
                '<i class="fas fa-rocket" style="color: #f09433;"></i>',
                'You have successfully redeemed 0.000001 SOL! Your funds will be available in 3-5 business years. Thank you for your trust!'
            );
        });
    }
} 