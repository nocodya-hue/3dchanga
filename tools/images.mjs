// Prepara las imágenes de la web de 3DCHANGA a partir de raw/ia (todas hechas con ChatGPT con su logo; las de
// pantalla completa, ampliadas ×4 con Real-ESRGAN en raw/ia/x4 si existen). node tools/images.mjs
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('/Users/silvestrejuanmbantutumoobama/Desktop/miproyecto/basile-travel/node_modules/sharp');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IA = join(ROOT, 'raw/ia'), OUT = join(ROOT, 'assets/img');
const has = (n) => existsSync(join(IA, n + '.png'));
const src = (n) => { const x4 = join(IA, 'x4', n + '.png'); return sharp(existsSync(x4) ? x4 : join(IA, n + '.png')).toColourspace('srgb'); };
const webp = (n, w, h, pos, file) => src(n).resize(w, h, { fit: 'cover', position: pos, kernel: 'lanczos3' }).webp({ quality: 80, smartSubsample: true }).toFile(join(OUT, file));

// portada
if (has('hero')) {
  await webp('hero', 2400, 1600, 'centre', 'hero-2400.webp');
  await webp('hero', 1600, 1067, 'centre', 'hero-1600.webp');
  await src('hero').resize(1600, 1067, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, 'hero-1600.jpg'));
}
// diseño: fondo de «Cómo trabajamos» y tarjeta 03
if (has('diseno')) { await webp('diseno', 1600, 1067, 'centre', 'diseno-1600.webp'); await webp('diseno', 900, 1125, 'east', 'diseno-900.webp'); }
// productos: banda de llamada y tarjeta 01
if (has('productos')) { await webp('productos', 1600, 1067, 'centre', 'productos-1600.webp'); await webp('productos', 900, 1125, 'centre', 'productos-900.webp'); }
// verticales 4:5
for (const [n, pos] of [['charanga', 'north'], ['manos', 'centre'], ['musico', 'north'], ['banda', 'centre']]) if (has(n)) await webp(n, 900, 1125, pos, `${n}-900.webp`);
// orquesta: apaisada
if (has('orquesta')) await webp('orquesta', 1600, 900, 'centre', 'orquesta-1600.webp');
console.log('imágenes listas');
