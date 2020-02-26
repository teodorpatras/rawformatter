"use strict";

const { href } = window.location;
const { pathname } = parseURL(href);
const modeConfig = getConfigFromPath(pathname);
const themeConfig = getTheme();

if (modeConfig && document.body.childNodes.length === 1) {
  const config = {
    theme: themeConfig.theme,
    value: document.body.firstChild.textContent,
    lineNumbers: true,
    foldGutter: true,
    lineWrapping: true,
    readOnly: true,
    scrollbarStyle: "overlay",
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
  };

  window.codeMirror = CodeMirror(document.body, {
    mode: modeConfig,
    ...config
  });
  document.body.firstChild.remove();
  document.body.style.background = themeConfig.color;
  document.body.firstChild.style.height = "100%";
  document.body.firstChild.style.width = "100%";
  // simulate scroll to render whole content
  document.getElementsByClassName("CodeMirror-scroll")[0].scrollTop = 5;
}
