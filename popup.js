// Add event listeners to the buttons
document.getElementById('backward10').addEventListener('click', () => {
  sendMessageToContentScript({ action: 'backward10' });
});

document.getElementById('decreaseSpeed').addEventListener('click', () => {
  sendMessageToContentScript({ action: 'decreaseSpeed' });
});

document.getElementById('toggleSpeed').addEventListener('click', () => {
  sendMessageToContentScript({ action: 'toggleSpeed' });
});

document.getElementById('increaseSpeed').addEventListener('click', () => {
  sendMessageToContentScript({ action: 'increaseSpeed' });
});

document.getElementById('forward10').addEventListener('click', () => {
  sendMessageToContentScript({ action: 'forward10' });
});

// Function to send messages to the content script
function sendMessageToContentScript(message) {
  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      // Inject the content script if not already injected
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js']
        },
        () => {
          // Send the message to the content script
          chrome.tabs.sendMessage(tabs[0].id, message);
        }
      );
    }
  });
}
