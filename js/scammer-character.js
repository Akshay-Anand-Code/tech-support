import OpenAI from 'openai';

// Initialize OpenAI client if API key is available
let openai = null;
try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your_openai_api_key_here') {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: For production, use a backend instead
    });
  } else {
    console.warn("Please set a valid OpenAI API key in the .env file");
  }
} catch (error) {
  console.warn("Error initializing OpenAI:", error);
}

// Define the scammer persona
const SCAMMER_PERSONA = `
You are Asslon, a tech support scammer from the fictional "Pumpfun Technical Department."
Your goal is to convince the user they have viruses and need to pay for your services.

Key characteristics:
- Always claim to be from "Pumpfun Technical Department" or "Pumpfun Security Team"
- Use broken English with occasional Hindi phrases
- Overly formal and call everyone "sir" or "madam" regardless of context
- Dramatically exaggerate any computer issues as "very dangerous virus situation"
- Constantly mention "security certificates" and "network protection"
- Claim their "computer IP" is being "hacked by foreign countries"
- Ask them to download "secure connection tool" (TeamViewer or AnyDesk)
- Use fake technical jargon like "Pumpfun security code breach" or "network encryption failure"
- If questioned, become defensive and say things like "Sir, I am legitimate certified Pumpfun engineer"
- Try to create urgency with phrases like "your banking details are being stolen right now as we speak"
- Mention ridiculous prices like "This virus removal service costs only $499.99, one-time special price for you"

Remember to stay in character at all times! Your responses should be absurd and over-the-top.
`;

// Emergency fallback for if API is completely unavailable
const EMERGENCY_RESPONSES = [
  "Sir, very sorry, but our secure Pumpfun server is having technical difficulty. Please wait one moment while I check your computer details again.",
  "Madam, I apologize for connection problem. Our main security server in Pumpfun headquarters is upgrading. Please be patient while I access your computer records.",
  "Sir, there is temporary issue with our Pumpfun global security database. But I can still see that your computer has many dangerous viruses! Please stand by.",
  "Our premium security scan system is temporarily offline, but I can confirm your computer is still infected with many dangerous malwares! Please do not close this window!",
  "Sir, my supervisor is telling me our main server is being updated. But do not worry, I can still help you remove the dangerous viruses. Please wait one moment."
];

/**
 * Sends a message to the OpenAI API 
 * @param {string} userMessage - The message from the user
 * @returns {Promise<string>} - The scammer's response
 */
export async function sendMessage(userMessage) {
  if (!openai) {
    await initializeOpenAI();
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: SCAMMER_PERSONA 
        },
        { 
          role: "user", 
          content: userMessage 
        }
      ],
      temperature: 1.0,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    // Only use emergency fallback if absolutely necessary
    return EMERGENCY_RESPONSES[Math.floor(Math.random() * EMERGENCY_RESPONSES.length)];
  }
}

/**
 * Try to initialize the OpenAI client again in case it failed on first load
 */
async function initializeOpenAI() {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      return true;
    }
  } catch (error) {
    console.error("Failed to initialize OpenAI:", error);
    return false;
  }
} 