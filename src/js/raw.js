"use strict";

const GITHUB = "github.com";

/**
 * Returns the supported codemirror modes.
 *
 * @return {Object} Supported modes.
 */
function getSupportedModes() {
  const modes = {
    yaml: ["yaml", "yml"],
    python: ["py"],
    javascript: ["js", "ts", "json"],
    jsx: ["jsx"],
    json: ["json"],
    xml: ["xml"],
    markdown: ["markdown", "md"]
  };
}

/**
 * Parses the url and returns its components.
 *
 * @param  {string} url to be parsed.
 *
 * @return {object} url components.
 *
 */
function parseURL(url) {
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
}

/**
 * Returns the supported mode config or null if not supported.
 *
 * @param  {string} pathname as returned by the parsed url object.
 *
 * @return {string | object | null} supported url config.
 *
 */
function getConfigFromPath(path) {
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
}

/**
 * Returns the mirror theme based on os dark/light color theme.
 *
 * @param  {string} pathname as returned by the parsed url object.
 *
 * @return {string | object | null} supported url config.
 *
 */
function getTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return { theme: "material", color: "#263238" };
  }
  return { theme: "neo", color: "#ffffff;" };
}
