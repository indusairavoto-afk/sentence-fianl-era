chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.action === 'fetch_html' && request.url) {
      console.log('Received request to extract via network:', request.url);
      
      let capturedPayloads = [];
      let tabId = null;

      // Listen for messages from the content script relay (PARSE_THIS_JSON)
      const messageListener = (msg, senderProxy) => {
        if (msg.type === "PARSE_THIS_JSON" && senderProxy.tab?.id === tabId) {
           capturedPayloads.push(msg.payload);
        }
        // Also support the original message type just in case
        if (msg.type === "CAPTURED_CHAT_DATA" && senderProxy.tab?.id === tabId) {
           capturedPayloads.push(msg.payload);
        }
      };
      
      chrome.runtime.onMessage.addListener(messageListener);

      chrome.tabs.create({ url: request.url, active: false }, (tab) => {
        tabId = tab.id;
        
        // Wait a fixed amount of time for network payloads to settle
        // 8 seconds should be enough for the initial network requests
        setTimeout(() => {
          chrome.runtime.onMessage.removeListener(messageListener);
          
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => document.documentElement.outerHTML
          }).then((results) => {
            chrome.tabs.remove(tabId);
            
            let finalHtml = "";
            if (results && results[0] && results[0].result) {
               finalHtml = results[0].result;
            }

            // Parse the captured payloads
            const messages = parseJSONNetworkPayloads(capturedPayloads);

            console.log("Extracted messages via network:", messages);

            if (messages.length > 0) {
               sendResponse({ html: JSON.stringify(messages), success: true });
            } else {
               // Fallback: If we couldn't get JSON network payloads, return what we have
               // It's better than nothing, even if we shouldn't attempt to parse HTML
               sendResponse({ html: JSON.stringify([]), success: false }); // Do NOT send outerHTML
            }
          }).catch(e => {
            // fallback if script injection fails
            chrome.tabs.remove(tabId);
            sendResponse({ html: "[]", success: false });
          });
        }, 8000);
      });
      
      return true;
    }
  }
);

function extractPossibleJSONs(text) {
  let jsons = [];
  let depth = 0;
  let inString = false;
  let escape = false;
  let startIdx = -1;
  
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (char === '\\') escape = true;
      else if (char === '"') inString = false;
    } else {
      if (char === '"') inString = true;
      else if (char === '{') {
        if (depth === 0) startIdx = i;
        depth++;
      } else if (char === '}') {
        if (depth > 0) {
          depth--;
          if (depth === 0 && startIdx !== -1) {
            jsons.push(text.substring(startIdx, i + 1));
            startIdx = -1;
          }
        }
      }
    }
  }
  return jsons;
}

function parseJSONNetworkPayloads(payloads) {
  let allMessages = [];

  for (let text of payloads) {
    if (typeof text !== "string") continue;

    try {
      const data = JSON.parse(text);
      
      // ChatGPT Share Link / Conversation JSON structure
      if (data.mapping && data.current_node) {
        let mapping = data.mapping;
        let current = data.current_node;
        let thread = [];
        
        // Traverse back from current_node to root
        while (current) {
          const node = mapping[current];
          if (!node) break;
          
          if (node.message && node.message.author && node.message.content) {
            const msg = node.message;
            // Only include messages with content
            if (msg.content && msg.content.parts && msg.content.parts.length > 0) {
              thread.push(msg);
            }
          }
          current = node.parent;
        }
        
        thread.reverse(); // Order from oldest to newest
        
        for (let msg of thread) {
          let role = msg.author.role;
          if (role === "system") continue;
          
          let roleMapped = role === "assistant" ? "assistant" : "user";
          let content = msg.content.parts.join("\n");
          
          if (content.trim()) {
            allMessages.push({ role: roleMapped, content });
          }
        }
        
        // If we found a valid ChatGPT thread, we can return it (assuming one conversation per page)
        if (allMessages.length > 0) return allMessages;
      }
    } catch (e) {
      // Fallback to recursive traverse if not standard ChatGPT structure or parse failed
    }
  }

  // Fallback: original recursive traversal logic (cleaned up)
  let mappedMessages = [];
  function traverse(obj) {
    if (!obj || typeof obj !== "object") return;
    
    let roleCandidate = obj.role || obj.author?.role || obj.message?.author?.role;
    let contentCandidate = obj.content || obj.text || obj.message?.content?.parts;

    if (roleCandidate && contentCandidate) {
      let role = String(roleCandidate).toLowerCase();
      if (role === "human" || role === "user") role = "user";
      else if (role === "assistant" || role === "model" || role === "ai") role = "assistant";
      else role = "system";

      let content = "";
      if (typeof contentCandidate === "string") {
        content = contentCandidate;
      } else if (Array.isArray(contentCandidate)) {
        content = contentCandidate.map(p => typeof p === "string" ? p : (p.text || "")).join("\n");
      }

      if (content.trim() && role !== "system") {
        mappedMessages.push({ role, content });
      }
    }

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        traverse(obj[key]);
      }
    }
  }

  for (let text of payloads) {
    try {
      const data = JSON.parse(text);
      traverse(data);
    } catch (e) {}
  }

  // Deduplicate by content
  const seen = new Set();
  return mappedMessages.filter(m => {
    const key = m.role + m.content;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
