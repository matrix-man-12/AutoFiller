import { promises as fs } from 'fs';
import svg2img from 'svg2img';

async function convert() {
  const svgParams = await fs.readFile('../superx-icon.svg', 'utf8');
  svg2img(svgParams, { width: 128, height: 128 }, async (error, buffer) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    await fs.writeFile('../superx-icon.png', buffer);
    console.log('Successfully created superx-icon.png');
  });
}
convert();
