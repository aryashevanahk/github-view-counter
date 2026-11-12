const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'views.json');
  
  let views = 1;
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileData);
      views = (jsonData.views || 0) + 1;
    }
  } catch (err) {
    console.error("Error reading file", err);
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify({ views }));
  } catch (err) {
    console.error("Error writing file", err);
  }

  function shortNumber(num) {
    const units = ['', 'K', 'M', 'B', 'T'];
    let i = 0;
    while (num >= 1000) {
      num /= 1000;
      i++;
    }
    return Math.round(num * 10) / 10 + units[i];
  }

  const label = "Profile Views";
  const message = shortNumber(views);
  const color = "purple";
  const style = "for-the-badge";
  const logo = "github";

  const shieldsUrl = `https://img.shields.io/static/v1?label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}&color=${color}&style=${style}&logo=${logo}`;

  try {
    const response = await fetch(shieldsUrl);
    const svgText = await response.text();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(svgText);
  } catch (error) {
    res.status(500).send('Error generating badge');
  }
}