chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Open raw formatted ❐",
    contexts: ["page", "link"],
    id: "openrawformatted"
  });
});

chrome.contextMenus.onClicked.addListener(itemData => {
  const { linkUrl } = itemData;
  if (linkUrl) {
    const { host, pathname } = parseURL(linkUrl);
    if (host === GITHUB) {
      const mode = getConfigFromPath(pathname);
      if (mode && linkUrl.indexOf("/blob/") !== -1) {
        chrome.tabs.getSelected(null, ({ index }) => {
          chrome.tabs.create({
            url: linkUrl.replace("/blob/", "/raw/"),
            index: index + 1
          });
        });
      }
    }
  }
});
