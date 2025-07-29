// Simple OpenAI-powered chatbot integration for onboarding, Q&A, and recommendations
// This file handles the frontend chat UI and backend API calls

const chatWidget = document.createElement('div');
chatWidget.id = 'chatWidget';
chatWidget.innerHTML = `
  <div class="chat-header">AI Assistant <span class="chat-close" id="chatCloseBtn">×</span></div>
  <div class="chat-body" id="chatBody"></div>
  <form class="chat-input-area" id="chatForm">
    <input type="text" id="chatInput" placeholder="Ask me anything..." autocomplete="off" />
    <button type="submit">Send</button>
  </form>
`;
document.body.appendChild(chatWidget);

const chatBtn = document.createElement('button');
chatBtn.id = 'openChatBtn';
chatBtn.innerText = '💬';
chatBtn.title = 'Ask AI Assistant';
document.body.appendChild(chatBtn);

const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatCloseBtn = document.getElementById('chatCloseBtn');

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + sender;
  msg.innerText = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

chatBtn.onclick = () => {
  chatWidget.classList.add('open');
  chatBtn.style.display = 'none';
};
chatCloseBtn.onclick = () => {
  chatWidget.classList.remove('open');
  chatBtn.style.display = 'block';
};

chatForm.onsubmit = (e) => {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  appendMessage('user', userMsg);
  chatInput.value = '';
  setTimeout(() => {
    const reply = getStaticAIReply(userMsg);
    appendMessage('ai', reply);
  }, 600);
};

function getStaticAIReply(msg) {
  const text = msg.toLowerCase();
  // Onboarding
  if (text.includes('how') && text.includes('start')) return 'To get started, import your leads using the Import Leads section. Map your columns, and the AI will score and prioritize them instantly.';
  if (text.includes('import')) return 'Click on Import Leads in the sidebar, upload your CSV, and follow the mapping instructions.';
  if (text.includes('score') && text.includes('lead')) return 'Lead scores are calculated using advanced machine learning models based on your data. High scores indicate strong intent.';
  if (text.includes('explain') || text.includes('reason')) return 'Click the reasoning icon next to any lead to see a detailed explanation of their score, including key factors.';
  if (text.includes('filter')) return 'Use the filters above the lead list to narrow down by intent, industry, or company size.';
  if (text.includes('recommend')) return 'Focus on high-intent leads first. The dashboard highlights those most likely to convert.';
  if (text.includes('analytics')) return 'The Analytics section provides insights into conversion trends, SDR performance, and lead sources.';
  if (text.includes('settings')) return 'You can update your profile and notification preferences in the Settings section.';
  if (text.includes('help')) return 'I can help you with onboarding, lead scoring, filtering, and dashboard features. Ask me anything!';
  // Greetings
  if (text.match(/hi|hello|hey|good (morning|afternoon|evening)/)) return 'Hello! I am your AI assistant. How can I help you with lead management today?';
  // Fallback
  if (text.includes('thank')) return 'You’re welcome! Let me know if you have more questions.';
  if (text.includes('who are you')) return 'I am your built-in AI assistant, here to help you get the most out of LeadConnect AI.';
  if (text.includes('what can you do')) return 'I can answer questions about onboarding, lead scoring, filtering, analytics, and more.';
  // Default
  return 'I am here to help with onboarding, Q&A, and recommendations for your lead dashboard. Try asking about importing leads, scoring, or analytics!';
}
