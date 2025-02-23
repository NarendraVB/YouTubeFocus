document.addEventListener("DOMContentLoaded", function () {
    let toggle = document.getElementById("toggleExtension");
    let statusText = document.getElementById("statusText");

    // Load saved state from storage
    chrome.storage.local.get("extensionEnabled", function (data) {
        if (data.extensionEnabled === undefined) {
            chrome.storage.local.set({ extensionEnabled: true }); // Default ON
            toggle.checked = true;
            statusText.innerText = "ON";
        } else {
            toggle.checked = data.extensionEnabled;
            statusText.innerText = data.extensionEnabled ? "ON" : "OFF";
        }
    });

    // Update state when toggled
    toggle.addEventListener("change", function () {
        let isEnabled = toggle.checked;
        chrome.storage.local.set({ extensionEnabled: isEnabled });
        statusText.innerText = isEnabled ? "ON" : "OFF";

        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { enabled: isEnabled });
            }
        });
    });
});
