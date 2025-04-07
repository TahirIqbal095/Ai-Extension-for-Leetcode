// Make sure this file uses ES modules syntax if "type": "module" is specified in manifest
console.log("Background script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openPopup") {
        chrome.action.openPopup(); // Opens the popup programmatically
    }
    // Always return true for async operations
    return true;
});
