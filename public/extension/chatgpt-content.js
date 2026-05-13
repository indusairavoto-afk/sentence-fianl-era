window.addEventListener("message", (e) => {
  if (e.data?.type === "CHATGPT_SHARE_JSON") {
    chrome.runtime.sendMessage({
      type: "PARSE_THIS_JSON",
      payload: e.data.data
    });
  }
});
