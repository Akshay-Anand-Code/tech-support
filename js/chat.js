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

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chat = new ScammerChat();
    
    // Make functions globally available
    window.sendMessage = () => chat.sendMessage();
    window.handleKeyPress = (event) => chat.handleKeyPress(event);
    window.startChat = () => {
        document.getElementById('chat').scrollIntoView({behavior: 'smooth'});
    };
}); 