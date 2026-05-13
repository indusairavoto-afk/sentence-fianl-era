const AdmZip = require('adm-zip');
try {
  const zip = new AdmZip('public/chatgpt-extractor.zip');
  const zipEntries = zip.getEntries();
  zipEntries.forEach(function(zipEntry) {
    console.log(zipEntry.entryName);
  });
} catch(e) {
  console.log('Zip is invalid:', e.message);
}
