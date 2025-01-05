import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrls = {
  prop1: {
    main: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    living: 'https://images.unsplash.com/photo-1600210492493-0946911123ea',
    kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    bedroom: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8',
    bathroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  },
  prop2: {
    main: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    living: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
    kitchen: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
    bathroom: 'https://images.unsplash.com/photo-1604014238170-4def1e4e6fcf',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  },
  prop3: {
    main: 'https://images.unsplash.com/photo-1613977257363-707ba9348227',
    living: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
    kitchen: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    bedroom: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed',
    bathroom: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  },
  prop4: {
    main: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    living: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e',
    kitchen: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
    bathroom: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  },
  prop5: {
    main: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    living: 'https://images.unsplash.com/photo-1618219944342-824e40a13285',
    kitchen: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
    bathroom: 'https://images.unsplash.com/photo-1604014238170-4def1e4e6fcf',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  },
  prop6: {
    main: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b',
    living: 'https://images.unsplash.com/photo-1618219944342-824e40a13285',
    kitchen: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
    bathroom: 'https://images.unsplash.com/photo-1604014238170-4def1e4e6fcf',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  },
  prop7: {
    main: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
    living: 'https://images.unsplash.com/photo-1618219944342-824e40a13285',
    kitchen: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
    bathroom: 'https://images.unsplash.com/photo-1604014238170-4def1e4e6fcf',
    garden: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
    floorplan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7'
  }
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(`${url}?w=1200&q=80`, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}

async function downloadAllImages() {
  for (const [propId, images] of Object.entries(imageUrls)) {
    const propDir = path.join(__dirname, '..', 'public', 'images', 'properties', propId);
    
    if (!fs.existsSync(propDir)) {
      fs.mkdirSync(propDir, { recursive: true });
    }

    for (const [type, url] of Object.entries(images)) {
      const filepath = path.join(propDir, `${type}.jpg`);
      try {
        await downloadImage(url, filepath);
        console.log(`Downloaded ${propId} ${type} image`);
      } catch (error) {
        console.error(`Error downloading ${propId} ${type} image:`, error);
      }
    }
  }
}

downloadAllImages().catch(console.error);
