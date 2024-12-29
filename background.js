// Initialize chat history
let chatHistory = [];

// Listen for when the extension is installed
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ chatHistory: [] });
    console.log("Extension installed and chat history initialized.");
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.userInput) {
        console.log("Received user input:", message.userInput);

        // API details
        const apiKey = "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";
        const apiModel = "EleutherAI/gpt-neo-1.3B";

        try {
            // Fetch chat history from local storage
            const result = await getStorageData(["chatHistory"]);
            chatHistory = result.chatHistory || [];
            console.log("Chat history retrieved:", chatHistory);

            // Append user's message to chat history
            chatHistory.push({ role: "user", content: message.userInput });

            // Send messages to the API
            const assistantResponse = await fetchChatCompletion(chatHistory, apiKey, apiModel);
            console.log("Assistant response received:", assistantResponse);

            // Append the assistant's response to chat history
            chatHistory.push({ role: "assistant", content: assistantResponse });

            // Save the updated chat history to local storage
            chrome.storage.local.set({ chatHistory });

            // Send the assistant's response back to the popup
            sendResponse({ answer: assistantResponse });
        } catch (error) {
            console.error("Error occurred:", error.message);
            sendResponse({ error: error.message });
        }

        return true; // Keep the messaging channel open
    }
    return true;
});

// Fetch data from the Hugging Face API
async function fetchChatCompletion(messages, apiKey, apiModel) {
    try {
        // Limit the number of messages to avoid prompt overflow
        const maxMessages = 10;
        const truncatedMessages = messages.slice(-maxMessages);

        // Construct the prompt
        const prompt = truncatedMessages
            .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n")
            .concat("\nAssistant:");

        console.log("Generated prompt for API:", prompt);

        // Make the API request
        const response = await fetch(`https://api-inference.huggingface.co/models/${apiModel}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_length: 200 },
            }),
        });

        if (!response.ok) {
            console.error(`API call failed with status ${response.status}`);
            throw new Error(`Failed to fetch. Status code: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response data:", data);

        // Parse the response
        if (data && data[0] && data[0].generated_text) {
            const rawResponse = data[0].generated_text;
            return rawResponse.split("Assistant:").pop().trim();
        } else {
            throw new Error("Invalid response format from API.");
        }
    } catch (error) {
        console.error("Error while fetching chat completion:", error.message);
        throw error;
    }
}

// Get data from local storage
function getStorageData(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => resolve(result));
    });
}
