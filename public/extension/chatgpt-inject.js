(function () {
  function send(data) {
    window.postMessage({ type: "CHATGPT_SHARE_JSON", data }, "*");
  }

  const origFetch = window.fetch;
  window.fetch = async (...args) => {
    const res = await origFetch(...args);
    try {
      const clone = res.clone();
      const text = await clone.text();

      if (text.includes("conversation") && text.includes("message")) {
        send(text);
      }
    } catch (e) {}

    return res;
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      try {
        const text = this.responseText;
        if (text.includes("conversation") && text.includes("message")) {
          send(text);
        }
      } catch (e) {}
    });
    origOpen.apply(this, arguments);
  };
})();
