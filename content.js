function replaceThumbnails() {
  chrome.storage.local.get("customThumbnail", function (data) {
      let customImage = data.customThumbnail || "https://your-default-image.com/image.jpg";
      document.querySelectorAll("img").forEach((img) => {
          if (img.src.includes("ytimg.com")) {
              img.src = customImage;
          }
      });
  });
}

// Check if the extension is enabled before running
chrome.storage.local.get("extensionEnabled", function (data) {
  if (!data.extensionEnabled) return;

  replaceThumbnails();
  const observer = new MutationObserver(replaceThumbnails);
  observer.observe(document.body, { childList: true, subtree: true });
});

// Listen for toggle messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.enabled) {
      replaceThumbnails();
  } else {
      location.reload(); // Reload to restore thumbnails
  }
});
