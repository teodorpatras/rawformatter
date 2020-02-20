const { href } = document.location;

if (href.endsWith(".yaml") || href.endsWith(".yml")) {
  const myCodeMirror = CodeMirror(document.body, {
    value: document.body.firstChild.textContent,
    mode: "yaml",
    lineNumbers: true,
    readOnly: true,
    scrollbarStyle: null
  });
  document.body.firstChild.remove();
  document.body.firstChild.style.height = "100vh";
  document.getElementsByClassName("CodeMirror-scroll")[0].scrollTop = 5;
}
