/**
 * Image pipeline — turns the original JPEGs in ../portfolio/<Category>/ into
 * responsive WebP files in public/photos/ and writes a typed manifest that the
 * app reads (dimensions, blur placeholder, camera settings).
 *
 *   npm run images              # incremental: only new/changed photos
 *   npm run images -- --force   # rebuild everything
 *
 * Output WebPs carry NO metadata (EXIF/GPS are stripped). Only the exposure
 * fields listed in `pickExif` are copied into the manifest.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import exifReader from 'exif-reader'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SOURCE = process.env.PHOTO_SOURCE ?? path.resolve(ROOT, '../portfolio')
const OUT_DIR = path.join(ROOT, 'public/photos')
const MANIFEST = path.join(ROOT, 'src/data/photos.manifest.json')
const WIDTHS = [480, 960, 1600, 2400]
const QUALITY = 78
const FORCE = process.argv.includes('--force')

/** Instagram-style exports with a white matte — trimmed so they sit on black. */
const TRIM_WHITE = new Set(['IMG_6153-04', 'IMG_6153-09', 'v h', 'bus-5', 'pl-3'])

const slugify = (s) =>
  s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function pickExif(buf) {
  if (!buf) return undefined
  try {
    const e = exifReader(buf)
    const p = e.Photo ?? {}
    const img = e.Image ?? {}
    const shutter = p.ExposureTime
      ? p.ExposureTime >= 1
        ? `${p.ExposureTime}s`
        : `1/${Math.round(1 / p.ExposureTime)}s`
      : undefined
    const out = {
      camera: img.Model?.trim(),
      lens: p.LensModel?.trim(),
      focal: p.FocalLength ? `${Math.round(p.FocalLength)}mm` : undefined,
      aperture: p.FNumber ? `f/${+p.FNumber.toFixed(1)}` : undefined,
      shutter,
      iso: p.ISOSpeedRatings ? `ISO ${Array.isArray(p.ISOSpeedRatings) ? p.ISOSpeedRatings[0] : p.ISOSpeedRatings}` : undefined,
    }
    return Object.values(out).some(Boolean) ? out : undefined
  } catch {
    return undefined
  }
}

async function processPhoto(category, file, previous) {
  const name = file.replace(/\.[^.]+$/, '')
  const slug = slugify(file)
  const id = `${slugify(category)}-${slug}`
  const srcPath = path.join(SOURCE, category, file)
  const outDir = path.join(OUT_DIR, slugify(category))
  const mtime = fs.statSync(srcPath).mtimeMs
  const prev = previous.get(id)
  const allExist = WIDTHS.every((w) => fs.existsSync(path.join(outDir, `${slug}-${w}.webp`)))

  if (!FORCE && prev && prev.sourceMtime === mtime && allExist) return { ...prev, skipped: true }

  fs.mkdirSync(outDir, { recursive: true })
  const meta = await sharp(srcPath).metadata()
  let base = sharp(srcPath).rotate() // honour EXIF orientation
  if (TRIM_WHITE.has(name)) base = sharp(await base.trim({ background: '#ffffff', threshold: 18 }).toBuffer())
  const normalized = await base.toBuffer({ resolveWithObject: true })
  const { width, height } = normalized.info

  for (const w of WIDTHS) {
    const target = Math.min(w, width)
    await sharp(normalized.data)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5, smartSubsample: true })
      .toFile(path.join(outDir, `${slug}-${w}.webp`))
  }

  const blurBuf = await sharp(normalized.data).resize(16).webp({ quality: 40 }).toBuffer()
  const { dominant } = await sharp(normalized.data).stats()
  const hex = (n) => n.toString(16).padStart(2, '0')

  return {
    id,
    category: slugify(category),
    file,
    path: `/photos/${slugify(category)}/${slug}`,
    width,
    height,
    blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
    color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`,
    exif: pickExif(meta.exif),
    sourceMtime: mtime,
  }
}

async function main() {
  if (!fs.existsSync(SOURCE)) throw new Error(`Photo source not found: ${SOURCE}`)
  const previous = new Map(
    fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).map((p) => [p.id, p]) : [],
  )

  const categories = fs
    .readdirSync(SOURCE, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)

  const results = []
  for (const category of categories) {
    const files = fs
      .readdirSync(path.join(SOURCE, category))
      .filter((f) => /\.(jpe?g|png|tiff?|webp|heic)$/i.test(f))
      .sort()
    for (const file of files) {
      const r = await processPhoto(category, file, previous)
      console.log(`${r.skipped ? '·' : '✓'} ${category}/${file}`)
      delete r.skipped
      results.push(r)
    }
  }

  // Social share image (1200×630) from the hero photo
  const og = results.find((p) => p.id === 'nature-img-1991') ?? results[0]
  if (og) {
    await sharp(path.join(SOURCE, og.file && categories.find((c) => slugify(c) === og.category), og.file))
      .rotate()
      .resize(1200, 630, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(ROOT, 'public/og-image.jpg'))
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(results, null, 2) + '\n')
  console.log(`\n${results.length} photos → ${path.relative(ROOT, OUT_DIR)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
