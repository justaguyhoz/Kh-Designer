import { mediaAudit, mediaManifest, type MediaItem } from './mediaManifest.generated'

export type PortfolioMedia = MediaItem & {
  type: 'image' | 'video'
  alt: string
  role?: 'hero' | 'supporting' | 'detail' | 'background'
  poster?: string
}

export type PortfolioProject = {
  id: string
  folder: string
  client: string
  title: string
  disciplines: string[]
  categories: string[]
  description?: string
  media: PortfolioMedia[]
  featured?: boolean
  displayTheme?: string
}

type ProjectMeta = {
  client: string
  title: string
  disciplines: string[]
  categories: string[]
  order: number
  featured?: boolean
  displayTheme?: string
}

const projectMeta: Record<string, ProjectMeta> = {
  'AUDI': { client: 'Audi', title: 'Audi Q7', disciplines: ['Magazine ads'], categories: ['Magazine Ads'], order: 1 },
  'Australis Music Group': { client: 'Australis', title: 'Orange Amplifiers brand guide and TAC event', disciplines: ['Branding', 'Events'], categories: ['Branding'], order: 2 },
  'Charlie Hair rollers': { client: 'Charlii', title: 'Charlii Hair Rollers', disciplines: ['Social', 'Campaign', 'Motion'], categories: ['Social Ads', 'Video'], order: 3, featured: true, displayTheme: 'charlii' },
  'Elemental Studio': { client: 'Elemental', title: 'Elemental Studio logo and business cards', disciplines: ['Branding', 'Business cards'], categories: ['Branding'], order: 4 },
  'FaceitGraphix': { client: 'Faceit', title: 'Faceit Graphix branding and wrap', disciplines: ['Branding', 'Vehicle wraps'], categories: ['Branding'], order: 5 },
  'Hardtuned': { client: 'Hardtuned', title: 'Fashion EDM', disciplines: ['EDM', 'Editorial'], categories: ['Branding'], order: 6 },
  'Kean Construction group': { client: 'Kean', title: 'Organic social posts', disciplines: ['Social'], categories: ['Organic Social'], order: 7 },
  'Powertec': { client: 'Powertec', title: 'Magazine, social and packaging designs', disciplines: ['Magazine ads', 'Social', 'Packaging', 'Motion'], categories: ['Magazine Ads', 'Social Ads', 'Branding', 'Video'], order: 8 },
  'Real Estate': { client: 'Real Estate', title: 'Brochure designs', disciplines: ['Brochures', 'Editorial'], categories: ['Branding'], order: 9 },
  'Spinal life': { client: 'Spinal', title: 'Organic social', disciplines: ['Social'], categories: ['Organic Social', 'Social Ads'], order: 10 },
  'The Brooklyn_Wine & Tapas Bar': { client: 'Brooklyn', title: 'Organic social', disciplines: ['Social'], categories: ['Organic Social'], order: 11 },
  'The Sycamore school': { client: 'Sycamore', title: 'Social ads', disciplines: ['Social', 'Campaign', 'Motion'], categories: ['Social Ads', 'Organic Social', 'Video'], order: 12 },
  'UN': { client: 'UN', title: 'United Nations Covid-19 Campaign', disciplines: ['Magazine ads'], categories: ['Magazine Ads'], order: 13 },
  'Vetner': { client: 'Vetner', title: 'Social ads', disciplines: ['Social'], categories: ['Social Ads', 'Organic Social'], order: 14 },
  'All Day Workwear': { client: 'All Day Workwear', title: 'Campaign banners', disciplines: ['Social'], categories: ['Social Ads'], order: 15 },
}

export const categoryFilters = ['All Work', 'Social Ads', 'Organic Social', 'Magazine Ads', 'Branding', 'Video']

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const videoTitles: Record<string, string> = {
  'Charlie Hair rollers/BOF_ads + vid/BOF_vid 1.mp4': 'BOF remarketing video 01',
  'Charlie Hair rollers/BOF_ads + vid/BOF_vid 2.mp4': 'BOF remarketing video 02',
  'Charlie Hair rollers/MOF_ads + vid/MOF_Mega Marylin Set.mp4': 'Mega Marylin stylist set video',
  'Charlie Hair rollers/MOF_ads + vid/MOF_video_2.mp4': 'MOF sales video',
  'Charlie Hair rollers/TOF_ads + vid/TOF_video ad.mp4': 'TOF awareness video',
  'Powertec/Outback Marine_Facebook Sales Campaign (1).mp4': 'Outback Marine sales campaign 01',
  'Powertec/Outback Marine_Facebook Sales Campaign.mp4': 'Outback Marine sales campaign 02',
  'Powertec/Powertec_Traffic Facebook Campaign.mp4': 'Powertec traffic campaign',
  'Powertec/powertec-awarness-facebook-campaign.mp4': 'Powertec awareness campaign',
  'Powertec/powertec-sales-facebook-campaign.mp4': 'Powertec sales campaign',
  'Powertec/WatchAi_Wholesaler Campaign.mp4': 'WatchAi wholesaler campaign 01',
  'Powertec/watchai-wholesaler-campaign.mp4': 'WatchAi wholesaler campaign 02',
  'The Sycamore school/Campaign 1_this is Sycamore.mp4': 'This is Sycamore campaign',
}

const altFrom = (projectTitle: string, label: string) => `${projectTitle} portfolio media: ${label}`

export const videoPoster = (projectId: string, videoIndex: number) => `/video-posters/${projectId}-${String(videoIndex + 1).padStart(2, '0')}.jpg`
export const videoTitle = (filename: string, fallback: string) => videoTitles[filename] ?? fallback

export const portfolioProjects: PortfolioProject[] = mediaManifest
  .map((group) => {
    const meta = projectMeta[group.folder] ?? {
      client: group.folder,
      title: group.folder,
      disciplines: ['Additional work'],
      categories: ['Branding'],
      order: 999,
    }
    const id = slug(group.folder)
    const images: PortfolioMedia[] = group.images.map((image, index) => ({
      ...image,
      type: 'image',
      alt: altFrom(meta.title, image.label),
      role: index === 0 ? 'hero' : 'supporting',
    }))
    const videos: PortfolioMedia[] = group.videos.map((video, index) => ({
      ...video,
      type: 'video',
      alt: `${meta.title} portfolio video: ${videoTitle(video.filename, video.label)}`,
      poster: videoPoster(id, index),
      role: 'detail',
    }))

    return {
      id,
      folder: group.folder,
      client: meta.client,
      title: meta.title,
      disciplines: meta.disciplines,
      categories: meta.categories,
      media: [...images, ...videos],
      featured: meta.featured,
      displayTheme: meta.displayTheme,
      order: meta.order,
    }
  })
  .sort((a, b) => a.order - b.order)
  .map(({ order: _order, ...project }) => project)

export const clients = portfolioProjects.map((project) => project.client)
export const disciplines = Array.from(new Set(portfolioProjects.flatMap((project) => project.disciplines))).sort()

export const findProject = (id: string) => portfolioProjects.find((project) => project.id === id)

export const allVideos = portfolioProjects.flatMap((project) => project.media
  .filter((media) => media.type === 'video')
  .map((video) => ({
    ...video,
    displayTitle: videoTitle(video.filename, video.label),
    projectTitle: project.title,
  })))

export { mediaAudit }
