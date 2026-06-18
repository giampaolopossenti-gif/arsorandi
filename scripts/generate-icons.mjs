import sharp from "sharp";
import fs from "fs";
import path from "path";

const logoPath = path.join(process.cwd(), "Logo italiano png.png");
const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });

const sizes = [
  { size: 512, name: "icon-512.png" },
  { size: 192, name: "icon-192.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 32,  name: "favicon-32.png" },
  { size: 16,  name: "favicon-16.png" },
];

for (const { size, name } of sizes) {
  await sharp(logoPath)
    .resize(size, size, { fit: "contain", background: { r: 250, g: 247, b: 242, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

await sharp(logoPath)
  .resize(32, 32, { fit: "contain", background: { r: 250, g: 247, b: 242, alpha: 1 } })
  .png()
  .toFile(path.join(publicDir, "favicon.ico"));
console.log("✓ favicon.ico");

console.log("\nTutte le icone generate in /public/");
