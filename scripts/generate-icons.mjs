import sharp from "sharp";
import fs from "fs";
import path from "path";

// SVG del logo Arsorandi (ricostruzione fedele del logo AO)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Sfondo crema -->
  <rect width="512" height="512" fill="#FAF7F2"/>

  <!-- Lettera A (sinistra) -->
  <text x="108" y="320"
    font-family="Georgia, serif"
    font-size="260"
    font-weight="400"
    fill="#1a1a1a"
    text-anchor="middle"
    letter-spacing="-5">A</text>

  <!-- Lettera O grande (destra, sfondo) -->
  <text x="370" y="320"
    font-family="Georgia, serif"
    font-size="260"
    font-weight="400"
    fill="#1a1a1a"
    text-anchor="middle">O</text>

  <!-- ARS ORANDI dentro la O -->
  <text x="370" y="248"
    font-family="Georgia, serif"
    font-size="32"
    font-weight="400"
    fill="#1a1a1a"
    text-anchor="middle"
    letter-spacing="2">ARS</text>
  <text x="370" y="290"
    font-family="Georgia, serif"
    font-size="32"
    font-weight="400"
    fill="#1a1a1a"
    text-anchor="middle"
    letter-spacing="2">ORANDI</text>

  <!-- Sottotitolo -->
  <text x="256" y="390"
    font-family="Georgia, serif"
    font-size="28"
    font-style="italic"
    fill="#7A6E66"
    text-anchor="middle">L'arte della preghiera</text>
</svg>`;

const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });

const svgBuffer = Buffer.from(svg);

// Genera tutte le dimensioni necessarie
const sizes = [
  { size: 512, name: "icon-512.png" },
  { size: 192, name: "icon-192.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 32,  name: "favicon-32.png" },
  { size: 16,  name: "favicon-16.png" },
];

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

// Favicon .ico (usa il 32px come base)
await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, "favicon.ico"));
console.log("✓ favicon.ico");

console.log("\nTutte le icone generate in /public/");
