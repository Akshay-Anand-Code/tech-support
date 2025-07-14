import { sendMessage as getScammerResponse } from './scammer-character.js';

class ScammerChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.isTyping = false;
        this.checkApiKey();
    }

    // Check if API key is set and show warning if not
    checkApiKey() {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            const systemMessage = document.createElement('div');
            systemMessage.className = 'message system';
            systemMessage.innerHTML = `
                <div class="system-message">
                    ⚠️ DEVELOPER NOTE: No OpenAI API key found. Please add your API key to the .env file for the full scammer experience.
                </div>
            `;
            this.chatMessages.appendChild(systemMessage);
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();
        this.isTyping = true;

        try {
            // Get AI response
            const response = await getScammerResponse(message);
            
            // Remove typing indicator and add response
            this.hideTypingIndicator();
            setTimeout(() => {
                this.addMessage(response, 'support');
                this.isTyping = false;
            }, 500 + Math.random() * 1500); // Random delay for realism

        } catch (error) {
            console.error("Error getting response:", error);
            this.hideTypingIndicator();
            this.addMessage("Sir, there is technical problem with connection. Please try again!", 'support');
            this.isTyping = false;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], {
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">You</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <div class="message-text">${text}</div>
                </div>
                <div class="message-avatar"><i class="fas fa-user"></i></div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="./pump.PNG" alt="Pump.fun" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">Pump.fun</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <div class="message-text">${text}</div>
                </div>
            `;
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message support';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="./public/pump.PNG" alt="Pump.fun" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Pump.fun</span>
                    <span class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div class="message-text">
                    <div class="typing-indicator">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    }
}

// Copy contract address to clipboard
function copyAddress() {
    const address = '0x1234...5678...9abc...def0';
    navigator.clipboard.writeText(address).then(() => {
        // Show feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'linear-gradient(to bottom, #27ae60, #2ecc71)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'linear-gradient(to bottom, #3498db, #2980b9)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy address:', err);
        alert('Failed to copy address to clipboard');
    });
}

// Reveal airdrop function
function revealAirdrop() {
    const airdropButton = document.getElementById('airdropButton');
    const chatMessages = document.getElementById('chatMessages');
    
    // Disable button temporarily
    airdropButton.disabled = true;
    airdropButton.style.opacity = '0.5';
    
    // Add dramatic effect
    document.body.style.animation = 'screen-shake 0.5s ease-in-out';
    
    // Create fake airdrop message
    setTimeout(() => {
        const airdropMessage = document.createElement('div');
        airdropMessage.className = 'message system';
        airdropMessage.innerHTML = `
            <div class="system-message">
                <i class="fas fa-gift"></i> AIRDROP REVEALED! 
                <br>🎉 You've been selected for 10,000 $PUMP tokens! 
                <br>💰 Value: $50,000 USD
                
            </div>
        `;
        chatMessages.appendChild(airdropMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add scammer response
        setTimeout(() => {
            const scammerMessage = document.createElement('div');
            scammerMessage.className = 'message support';
            scammerMessage.innerHTML = `
                <div class="message-avatar">
                    <img src="./pump.PNG" alt="Pump.fun" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">Pump.fun</span>
                        <span class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    <div class="message-text">
                        CONGRATULATIONS! 🎉 You have won the exclusive Pumpfun airdrop! To claim your 10,000 $PUMP tokens worth $50,000, please provide your wallet address and private key for verification. This is 100% legitimate Pumpfun procedure! It will be delivered in 69,420 business days because of Jewish Policies 🚀
                    </div>
                </div>
            `;
            chatMessages.appendChild(scammerMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        // Re-enable button
        setTimeout(() => {
            airdropButton.disabled = false;
            airdropButton.style.opacity = '1';
            document.body.style.animation = '';
        }, 3000);
        
    }, 500);
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chat = new ScammerChat();
    
    // Make functions globally available
    window.sendMessage = () => chat.sendMessage();
    window.handleKeyPress = (event) => chat.handleKeyPress(event);
    window.startChat = () => {
        document.getElementById('chat').scrollIntoView({behavior: 'smooth'});
    };
    window.copyAddress = copyAddress;
    window.revealAirdrop = revealAirdrop;
}); 