import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const IMAGE_DIRS = [
  path.join(rootDir, 'public/images/blog'),
  path.join(rootDir, 'public/images/projects')
];

const CONTENT_DIRS = [
  path.join(rootDir, 'src/posts'),
  path.join(rootDir, 'src/projects'),
  path.join(rootDir, 'src/about')
];

async function processImages() {
  const imageMap = new Map();

  for (const dir of IMAGE_DIRS) {
    if (!(await fs.stat(dir).catch(() => false))) continue;
    
    async function walk(currentDir) {
      const files = await fs.readdir(currentDir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(currentDir, file.name);
        if (file.isDirectory()) {
          await walk(fullPath);
        } else if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
          const parsed = path.parse(fullPath);
          const newFileName = `${parsed.name}.webp`;
          const newPath = path.join(parsed.dir, newFileName);
          
          try {
            await sharp(fullPath)
              .webp({ quality: 80, effort: 6 })
              .toFile(newPath);
              
            imageMap.set(file.name, newFileName);
            imageMap.set(encodeURI(file.name), encodeURI(newFileName)); // For markdown links with spaces encoded
            
            // Delete original file
            await fs.unlink(fullPath);
            console.log(`Compressed: ${fullPath} -> ${newPath}`);
          } catch (e) {
            console.error(`Error processing ${fullPath}:`, e);
          }
        }
      }
    }
    
    await walk(dir);
  }

  // Update markdown files
  for (const dir of CONTENT_DIRS) {
    if (!(await fs.stat(dir).catch(() => false))) continue;
    
    async function walkContent(currentDir) {
      const files = await fs.readdir(currentDir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(currentDir, file.name);
        if (file.isDirectory()) {
          await walkContent(fullPath);
        } else if (/\.md$/i.test(file.name)) {
          let content = await fs.readFile(fullPath, 'utf8');
          let modified = false;
          
          for (const [oldName, newName] of imageMap.entries()) {
            // Need a regex that matches the old name ensuring it's an image reference (e.g. before closing quote or space or paren)
            const regex = new RegExp(oldName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g');
            if (regex.test(content)) {
              content = content.replace(regex, newName);
              modified = true;
            }
          }
          
          if (modified) {
            await fs.writeFile(fullPath, content, 'utf8');
            console.log(`Updated references in: ${fullPath}`);
          }
        }
      }
    }
    
    await walkContent(dir);
  }
}

processImages().then(() => console.log('Compression complete!')).catch(console.error);
