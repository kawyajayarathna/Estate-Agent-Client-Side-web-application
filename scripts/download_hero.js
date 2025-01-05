import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=80';
const filepath = path.join(__dirname, '..', 'public', 'images', 'hero-bg.jpg');

https.get(url, (res) => {
  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream(filepath))
       .on('finish', () => console.log('Downloaded hero image'));
  }
});
