// Run by Netlify build command to regenerate all manifest.json files
const fs = require('fs');
const path = require('path');

const folders = ['blog','herramientas','podcast','videos'];

folders.forEach(folder => {
  const dir = path.join('content', folder);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort();
  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify(files, null, 2)
  );
  console.log(`✅ ${folder}/manifest.json → [${files.join(', ')}]`);
});
