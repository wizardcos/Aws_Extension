
document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');

    // Set API Key (Optional: Remove this if already stored securely)
    chrome.storage.local.set({ apiKey: 'YOUR_API_KEY' }, function () {
        console.log('API Key has been set.');
    });

    // Load chat history
    chrome.storage.local.get(['chatHistory'], function (result) {
        const chatHistory = result.chatHistory || [];

        if (chatHistory.length > 0) {
            displayMessages(chatHistory);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            displayAssistantInfo();
        }

        updateClearChatBtnState();
    });

    // Auto-enable/disable send button
    userInput.addEventListener('keyup', function () {
        sendBtn.disabled = userInput.value.trim() === '';
        if (event.code === 'Enter' && !event.shiftKey) {
            sendBtn.click();
        }
    });

    // Resize input dynamically
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    // Send message
    sendBtn.addEventListener('click', function () {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            sendMessage(userMessage);
            userInput.value = '';
            userInput.style.height = 'auto';
            sendBtn.disabled = true;
        }
    });

    // Clear chat history
    clearChatBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear the chat history?')) {
            chrome.storage.local.set({ chatHistory: [] }, function () {
                chatMessages.innerHTML = '';
                displayAssistantInfo();
                updateClearChatBtnState();
            });
        }
    });

    // Handle incoming responses
    chrome.runtime.onMessage.addListener(function (message) {
        if (message.answer) {
            displayMessage('assistant', message.answer);
        } else if (message.error) {
            displayMessage('system', message.error);
        }

        sendBtn.disabled = false;
        userInput.disabled = false;
        sendBtn.innerHTML = '<i class="fa fa-paper-plane"></i>';
    });

    function sendMessage(userMessage) {
        chrome.runtime.sendMessage({ userInput: userMessage });
        displayMessage('user', userMessage);
        sendBtn.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
        userInput.disabled = true;
    }

    function displayMessage(role, content) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;

        if (content.startsWith('https://')) {
            const img = document.createElement('img');
            img.src = content;
            messageElement.appendChild(img);
        } else {
            messageElement.textContent = content;
        }

        chatMessages.appendChild(messageElement);
        messageElement.scrollIntoView();
        updateClearChatBtnState();
    }

    function displayMessages(messages) {
        messages.forEach(msg => displayMessage(msg.role, msg.content));
    }

    function displayAssistantInfo() {
        const infoWrapper = document.createElement('div');
        infoWrapper.id = 'assistant-info-wrapper';

        const icon = document.createElement('img');
        icon.src = '/assets/icons/icon-128.png';
        icon.alt = 'Assistant';
        infoWrapper.appendChild(icon);

        const text = document.createElement('p');
        text.innerText = 'How can I help you?';
        infoWrapper.appendChild(text);

        chatMessages.appendChild(infoWrapper);
    }

    function updateClearChatBtnState() {
        chrome.storage.local.get(['chatHistory'], function (result) {
            clearChatBtn.disabled = (result.chatHistory || []).length === 0;
        });
    }
});
