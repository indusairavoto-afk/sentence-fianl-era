import fs from "fs";
import { extractMessagesFromHtml } from "./server";

const html = fs.readFileSync("chatgpt-share-dump.html", "utf8");
const res = extractMessagesFromHtml(html);
console.log("Found:", res.messages.length);
console.log(res.messages.slice(0, 2));
