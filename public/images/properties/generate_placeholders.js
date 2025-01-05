import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const properties = [
    { id: 'prop1', type: 'House', bedrooms: 3, bathrooms: 2, price: '750,000' },
    { id: 'prop2', type: 'Flat', bedrooms: 2, bathrooms: 2, price: '399,995' },
    { id: 'prop3', type: 'House', bedrooms: 5, bathrooms: 4, price: '1,200,000' },
    { id: 'prop4', type: 'Flat', bedrooms: 1, bathrooms: 1, price: '250,000' },
    { id: 'prop5', type: 'House', bedrooms: 4, bathrooms: 3, price: '950,000' },
    { id: 'prop6', type: 'Flat', bedrooms: 3, bathrooms: 2, price: '650,000' },
    { id: 'prop7', type: 'House', bedrooms: 6, bathrooms: 5, price: '2,000,000' }
];

const imageTypes = ['main', 'living', 'kitchen', 'bedroom', 'bathroom', 'garden', 'floorplan'];
const colors = [
    ['#2C3E50', '#3498DB'],
    ['#8E44AD', '#9B59B6'],
    ['#2E4053', '#5D6D7E'],
    ['#784212', '#B7950B'],
    ['#1B4F72', '#2E86C1'],
    ['#186A3B', '#28B463'],
    ['#4A235A', '#8E44AD']
];

async function generatePlaceholders() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    
    const htmlPath = path.join(__dirname, 'placeholder.html');
    await page.goto(`file://${htmlPath}`);

    for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        const propDir = path.join(__dirname, prop.id);
        
        if (!fs.existsSync(propDir)) {
            fs.mkdirSync(propDir);
        }

        for (const type of imageTypes) {
            await page.evaluate(({ prop, type, colors }) => {
                document.querySelector('.placeholder').style.setProperty('--start-color', colors[0]);
                document.querySelector('.placeholder').style.setProperty('--end-color', colors[1]);
                document.getElementById('property-type').textContent = `${prop.type} - ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                document.getElementById('property-details').textContent = `${prop.bedrooms} Bedrooms • ${prop.bathrooms} Bathrooms`;
                document.getElementById('property-price').textContent = `£${prop.price}`;
            }, { prop, type, colors: colors[i] });

            await page.screenshot({
                path: path.join(propDir, `${type}.jpg`),
                quality: 80
            });
        }
    }

    await browser.close();
}

generatePlaceholders().catch(console.error);
