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

const getMode = () => {
  const modes = {
    yaml: ["yaml", "yml"],
    python: ["py"],
    javascript: ["js", "ts", "json"],
    jsx: ["jsx"],
    json: ["json"],
    xml: ["xml"],
    markdown: ["markdown", "md"]
  };

  const { pathname } = parseURL(document.location.href);
  const extension = /[.]/.exec(pathname)
    ? /[^.]+$/.exec(pathname)[0].toLowerCase()
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

const getTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "material";
  }
  return "neo";
};

const mode = getMode();

if (mode && document.body.childNodes.length === 1) {
  const config = {
    theme: getTheme(),
    value: document.body.firstChild.textContent,
    lineNumbers: true,
    foldGutter: true,
    lineWrapping: true,
    readOnly: true,
    scrollbarStyle: "overlay",
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
  };

  window.codeMirror = CodeMirror(document.body, {
    mode,
    ...config
  });
  document.body.firstChild.remove();
  document.body.firstChild.style.height = "100%";
  document.body.firstChild.style.width = "100%";
  document.getElementsByClassName("CodeMirror-scroll")[0].scrollTop = 5;
}
