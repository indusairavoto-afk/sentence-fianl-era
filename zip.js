import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const extDir = path.join(process.cwd(), 'public', 'extension');
const zipPath = path.join(process.cwd(), 'public', 'chatgpt-extractor.zip');

try {
  const zip = new AdmZip();
  zip.addLocalFolder(extDir);
  zip.writeZip(zipPath);
  console.log('Zipped successfully using adm-zip!');
} catch (e) {
  console.error(e);
}
