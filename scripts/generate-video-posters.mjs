import { spawnSync } from 'node:child_process'
import { mkdir, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const root = process.cwd()
const mediaRoot = join(root, 'public', 'projects')
const outputRoot = join(root, 'public', 'video-posters')
const ffmpeg = process.env.FFMPEG_PATH || process.argv[2] || 'ffmpeg'

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else if (entry.name.toLowerCase().endsWith('.mp4')) files.push(path)
  }
  return files
}

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const groups = new Map()
for (const video of (await walk(mediaRoot)).sort((a, b) => a.localeCompare(b))) {
  const folder = relative(mediaRoot, video).split(sep)[0]
  if (!groups.has(folder)) groups.set(folder, [])
  groups.get(folder).push(video)
}

await mkdir(outputRoot, { recursive: true })
for (const [folder, videos] of groups) {
  for (const [index, video] of videos.entries()) {
    const output = join(outputRoot, `${slug(folder)}-${String(index + 1).padStart(2, '0')}.jpg`)
    const result = spawnSync(ffmpeg, ['-loglevel', 'error', '-y', '-ss', '00:00:01', '-i', video, '-frames:v', '1', '-vf', 'scale=960:-2', '-q:v', '3', output], { stdio: 'inherit' })
    if (result.status !== 0) throw new Error(`Poster generation failed for ${video}`)
  }
}

console.log(`Generated posters for ${[...groups.values()].flat().length} videos`)
