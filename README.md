# Scammer AI Chat Simulator

A humorous tech support scammer AI chat simulator using OpenAI's API. This project creates a satirical fake "Windows XP" interface with a chat window that simulates common tech support scam tactics.

## 🚨 Disclaimer

This project is **purely educational and satirical**. It demonstrates common tactics used by tech support scammers to help people recognize and avoid falling victim to such scams. Never share personal information or allow remote access to your computer from unsolicited support calls.

## 📋 Features

- Realistic Windows XP-style UI with desktop icons, taskbar, and fake alert popup
- Chat interface with typing indicators
- AI-powered responses using OpenAI's GPT model
- Convincing "scammer" persona that mimics common tech support scam tactics
- Responsive design that works on both desktop and mobile
- Minimal emergency fallbacks if API connection fails

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)
- OpenAI API key ([Get one here](https://platform.openai.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [project-folder]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Project

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## ⚠️ Important Note

This application requires an OpenAI API key to function properly. Without a valid API key in the `.env` file, the chat experience will be severely limited.

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The OpenAI client is configured with `dangerouslyAllowBrowser: true` for simplicity, but for a production application, you should use a backend API to handle OpenAI requests
- This is meant for educational purposes only

## 🎮 Usage

1. Open the application in your browser at http://localhost:3000
2. Type messages in the chat input field like:
   - "My computer is slow"
   - "I think I have a virus"
   - "Can you help me?"
3. Watch as "RAsslonaj" responds with over-the-top scammer tactics
4. Interact with the fake Windows XP interface elements for added immersion

## 🛠️ Customization

You can modify the scammer persona in `js/scammer-character.js` to:
- Change the character's background story
- Adjust response patterns
- Add specific scenarios
- Modify the level of absurdity

## 📝 License

This project is available under the MIT License. See the LICENSE file for more details. 