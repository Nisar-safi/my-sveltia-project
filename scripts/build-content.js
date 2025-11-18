import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const pagesDir = 'src/content/pages';
fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.md'))
  .forEach(file => {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    const { data } = matter(content);
    fs.writeFileSync(
      path.join(pagesDir, file.replace('.md', '.json')),
      JSON.stringify(data, null, 2)
    );
  });
console.log('JSON files generated');build-content.js