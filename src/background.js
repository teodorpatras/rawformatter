chrome.runtime.onInstalled.addListener(function() {
  const menu = chrome.contextMenus.create({
    title: "Open raw formatted",
    contexts: ["page", "link"],
    id: "openrawformatted"
  });
});

const parseURL = url => {
  const parser = document.createElement("a");
  const searchObject = {};
  // Let the browser do the work
  parser.href = url;
  // Convert query string to object
  const queries = parser.search.replace(/^\?/, "").split("&");
  for (let i = 0; i < queries.length; i++) {
    const split = queries[i].split("=");
    searchObject[split[0]] = split[1];
  }
  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    searchObject: searchObject,
    hash: parser.hash
  };
};

const getMode = path => {
  const modes = {
    yaml: ["yaml", "yml"],
    python: ["py"],
    javascript: ["js", "ts", "json"],
    jsx: ["jsx"],
    json: ["json"],
    xml: ["xml"],
    markdown: ["markdown", "md"]
  };

  const extension = /[.]/.exec(path)
    ? /[^.]+$/.exec(path)[0].toLowerCase()
    : null;

  for (const mode in modes) {
    if (modes[mode].includes(extension)) {
      if (extension === "json") {
        // special setting for json
        return { name: "javascript", json: true };
      }
      return mode;
    }
  }
  return null;
};

chrome.contextMenus.onClicked.addListener(itemData => {
  const { linkUrl } = itemData;
  if (linkUrl) {
    const { host, pathname } = parseURL(linkUrl);
    if (host === "github.com") {
      const mode = getMode(pathname);
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
