const EVENTS = {
  SESSION: {
    INSTALL: "INSTALL",
    SUSPEND: "SUSPEND"
  },
  USER_INTERACTIONS: {
    CONTEXT_MENU_CLICKED: "CONTEXT_MENU_CLICKED"
  }
};

const analytics = new Analytics(GA_TRACKING_ID);

chrome.runtime.onInstalled.addListener(() => {
  analytics.track(
    "event",
    EVENTS.SESSION.INSTALL,
    "session",
    "Extension has been installed!"
  );
  chrome.contextMenus.create({
    title: "Open raw formatted ❐",
    contexts: ["page", "link"],
    id: "openrawformatted"
  });
});

chrome.runtime.onSuspend.addListener(() => {
  analytics.track(
    "event",
    EVENTS.SESSION.SUSPEND,
    "session",
    "Extension has been unloaded!"
  );
});

chrome.contextMenus.onClicked.addListener(itemData => {
  analytics.track(
    "event",
    EVENTS.USER_INTERACTIONS.CONTEXT_MENU_CLICKED,
    "user_interactions",
    "Context menu clicked!"
  );
  const { linkUrl } = itemData;
  if (!linkUrl) {
    return;
  }
  const { host, pathname } = parseURL(linkUrl);
  if (host !== GITHUB) {
    return;
  }
  const mode = getConfigFromPath(pathname);
  if (!mode || linkUrl.indexOf("/blob/") === -1) {
    return;
  }
  chrome.tabs.getSelected(null, ({ index }) => {
    chrome.tabs.create({
      url: linkUrl.replace("/blob/", "/raw/"),
      index: index + 1
    });
  });
});
