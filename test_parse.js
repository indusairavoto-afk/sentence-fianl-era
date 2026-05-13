const text = `{"mapping": {"1": {"id": "1", "message": {"author": {"role": "user"}, "content": {"parts": ["Hello"]}}, "parent": null}, "2": {"id": "2", "message": {"author": {"role": "assistant"}, "content": {"parts": ["Hi!"]}}, "parent": "1"}}, "current_node": "2"}`;

let finalMessages = [];
try {
    const data = JSON.parse(text);
    if (data.mapping && data.current_node) {
        let mapping = data.mapping;
        let current = data.current_node;
        let thread = [];
        while (current) {
            const node = mapping[current];
            if (!node) break;
            if (node.message && node.message.author && node.message.content) {
                thread.push(node.message);
            }
            current = node.parent;
        }
        thread.reverse();
        for (let msg of thread) {
            let role = msg.author.role;
            if (role === "system") continue;
            let content = "";
            if (msg.content.parts) {
                content = msg.content.parts.join("\n");
            }
            if (content.trim()) {
                finalMessages.push({ role, content });
            }
        }
    }
} catch(e) {}
console.log(finalMessages);
