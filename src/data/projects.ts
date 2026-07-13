import { mediaAudit, mediaManifest, type MediaItem } from './mediaManifest.generated'

export type MediaPresentation = 'wide' | 'square' | 'portrait' | 'full-artwork'

export type PortfolioMedia = MediaItem & {
  type: 'image' | 'video'
  alt: string
  role?: 'hero' | 'supporting' | 'detail' | 'background'
  poster?: string
  presentation?: MediaPresentation
}

export type CreativeDirection = {
  colors?: string[]
  typography?: string
  visualStyle?: string
  messaging?: string[]
}

export type PortfolioMediaGroup = {
  id: string
  title?: string
  theme?: string
  initialVisibleCount?: number
  media: PortfolioMedia[]
}

export type PortfolioProject = {
  id: string
  folder: string
  client: string
  title: string
  disciplines: string[]
  categories: string[]
  creativeDirection?: CreativeDirection
  description?: string
  media: PortfolioMedia[]
  groups: PortfolioMediaGroup[]
  featured?: boolean
  displayTheme?: string
}

type ProjectMeta = {
  client: string
  title: string
  disciplines: string[]
  categories: string[]
  order: number
  creativeDirection?: CreativeDirection
  featured?: boolean
  displayTheme?: string
}

const projectMeta: Record<string, ProjectMeta> = {
  'AUDI': {
    client: 'Audi',
    title: 'Audi Q7',
    disciplines: ['Magazine ads'],
    categories: ['Magazine Ads'],
    order: 1,
    creativeDirection: {
      colors: ['#0b0b0b', '#6d7070', '#cfd4d2', '#ffffff', '#e43d64'],
      typography: 'Layered display type with compact sans serif support',
      visualStyle: 'Monochrome automotive poster treatment with a focused product reveal.',
      messaging: ['Audi Q7'],
    },
  },
  'Australis Music Group': {
    client: 'Australis',
    title: 'Orange Amplifiers brand guide and TAC event',
    disciplines: ['Branding', 'Events'],
    categories: ['Branding'],
    order: 2,
    creativeDirection: {
      colors: ['#f36f21', '#171313', '#f6f0e7', '#ffffff', '#8f6a4a'],
      typography: 'Editorial serif paired with practical product-table typography',
      visualStyle: 'Brand-guide layouts, event collateral and amplifier product detail.',
      messaging: ['Orange Amplifiers', 'TAC event'],
    },
  },
  'Charlie Hair rollers': {
    client: 'Charlii',
    title: 'Charlii Hair Rollers',
    disciplines: ['Social', 'Campaign', 'Motion'],
    categories: ['Social Ads', 'Video'],
    order: 3,
    featured: true,
    displayTheme: 'charlii',
    creativeDirection: {
      colors: ['#f7dada', '#d27b88', '#fff3ef', '#b88a58', '#2a1716', '#ffffff'],
      typography: 'High-contrast serif with compact social ad support text',
      visualStyle: 'Soft blush beauty imagery contrasted with darker brown-and-gold product scenes.',
      messaging: ['Salon Results at home', 'No heat damage', 'Mega Marilyn Stylist Set'],
    },
  },
  'Elemental Studio': {
    client: 'Elemental',
    title: 'Elemental Studio logo and business cards',
    disciplines: ['Branding', 'Business cards'],
    categories: ['Branding'],
    order: 4,
    creativeDirection: {
      colors: ['#111111', '#f5f0e8', '#d4c3aa', '#ffffff'],
      typography: 'Minimal serif identity type',
      visualStyle: 'Quiet identity system with logo and business-card presentation.',
      messaging: ['Elemental Studio'],
    },
  },
  'FaceitGraphix': {
    client: 'Faceit',
    title: 'Faceit Graphix branding and wrap',
    disciplines: ['Branding', 'Vehicle wraps'],
    categories: ['Branding'],
    order: 5,
    creativeDirection: {
      colors: ['#101010', '#f1f1f1', '#c9c9c9', '#e53c34'],
      typography: 'Bold sans serif identity type',
      visualStyle: 'Branding system applied across vehicle-wrap artwork.',
      messaging: ['Faceit Graphix'],
    },
  },
  'Hardtuned': {
    client: 'Hardtuned',
    title: 'Fashion EDM',
    disciplines: ['EDM', 'Editorial'],
    categories: ['Branding'],
    order: 6,
    creativeDirection: {
      colors: ['#0f0f0f', '#f7f7f7', '#d9d0c8', '#8a817d'],
      typography: 'Fashion editorial typography with restrained sans serif details',
      visualStyle: 'Wide and tall EDM artwork with monochrome fashion imagery.',
      messaging: ['Fashion EDM'],
    },
  },
  'Kean Construction group': {
    client: 'Kean',
    title: 'Organic social posts',
    disciplines: ['Social'],
    categories: ['Organic Social'],
    order: 7,
    creativeDirection: {
      colors: ['#113b64', '#f1c232', '#ffffff', '#d7e1ea'],
      typography: 'Geometric sans serif social post typography',
      visualStyle: 'Construction updates and project-led organic social tiles.',
      messaging: ['Organic social posts'],
    },
  },
  'Powertec': {
    client: 'Powertec',
    title: 'Magazine, social and packaging designs',
    disciplines: ['Magazine ads', 'Social', 'Packaging', 'Motion'],
    categories: ['Magazine Ads', 'Social Ads', 'Branding', 'Video'],
    order: 8,
    creativeDirection: {
      colors: ['#06090d', '#004b8d', '#f4b000', '#ffffff', '#8fa3b8'],
      typography: 'Industrial sans serif with product campaign display type',
      visualStyle: 'Technical product boards, packaging presentations and campaign video assets.',
      messaging: ['Powertec', 'WatchAi', 'Outback Marine'],
    },
  },
  'Real Estate': {
    client: 'Real Estate',
    title: 'Brochure designs',
    disciplines: ['Brochures', 'Editorial'],
    categories: ['Branding'],
    order: 9,
    creativeDirection: {
      colors: ['#101010', '#ffffff', '#d8d2c7', '#8f8174'],
      typography: 'Editorial serif and neutral brochure typography',
      visualStyle: 'Landscape property brochure layouts with image-led spreads.',
      messaging: ['Brochure designs'],
    },
  },
  'Spinal life': {
    client: 'Spinal',
    title: 'Organic social',
    disciplines: ['Social'],
    categories: ['Organic Social', 'Social Ads'],
    order: 10,
    creativeDirection: {
      colors: ['#18365f', '#f05a28', '#ffffff', '#dce6ee'],
      typography: 'Accessible sans serif social campaign typography',
      visualStyle: 'Social campaign assets across square, portrait and landscape placements.',
      messaging: ['Organic social'],
    },
  },
  'The Brooklyn_Wine & Tapas Bar': {
    client: 'Brooklyn',
    title: 'Organic social',
    disciplines: ['Social'],
    categories: ['Organic Social'],
    order: 11,
    creativeDirection: {
      colors: ['#14100d', '#c8a063', '#f7f0e6', '#ffffff'],
      typography: 'Hospitality editorial type with social layout structure',
      visualStyle: 'Tall organic social artwork for wine and tapas content.',
      messaging: ['Organic social'],
    },
  },
  'The Sycamore school': {
    client: 'Sycamore',
    title: 'Social ads',
    disciplines: ['Social', 'Campaign', 'Motion'],
    categories: ['Social Ads', 'Organic Social', 'Video'],
    order: 12,
    creativeDirection: {
      colors: ['#502c83', '#f7b733', '#ffffff', '#58a6d6'],
      typography: 'Friendly sans serif campaign typography',
      visualStyle: 'School campaign and organic social sets in multiple ad ratios.',
      messaging: ['This is Sycamore'],
    },
  },
  'UN': {
    client: 'UN',
    title: 'United Nations Covid-19 Campaign',
    disciplines: ['Magazine ads'],
    categories: ['Magazine Ads'],
    order: 13,
    creativeDirection: {
      colors: ['#5b92d0', '#ffffff', '#1f2e44', '#d9e8f6'],
      typography: 'Clear public-information sans serif typography',
      visualStyle: 'Portrait campaign posters with institutional blue-and-white hierarchy.',
      messaging: ['United Nations Covid-19 Campaign'],
    },
  },
  'Vetner': {
    client: 'Vetner',
    title: 'Social ads',
    disciplines: ['Social'],
    categories: ['Social Ads', 'Organic Social'],
    order: 14,
    creativeDirection: {
      colors: ['#0f1b25', '#f4a52c', '#ffffff', '#b9c5cf'],
      typography: 'Bold utility-focused sans serif social typography',
      visualStyle: 'Product and trade campaign assets across landscape, square and portrait ratios.',
      messaging: ['Social ads'],
    },
  },
  'All Day Workwear': {
    client: 'All Day Workwear',
    title: 'Campaign banners',
    disciplines: ['Social'],
    categories: ['Social Ads'],
    order: 15,
    creativeDirection: {
      colors: ['#101010', '#f2b233', '#ffffff', '#8f8f8f'],
      typography: 'Bold retail campaign sans serif',
      visualStyle: 'Square campaign banner artwork for workwear product promotion.',
      messaging: ['Campaign banners'],
    },
  },
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

const defaultPresentation = (media: PortfolioMedia): MediaPresentation => {
  if (media.aspect === 'portrait') return 'portrait'
  if (media.aspect === 'square') return 'square'
  return 'wide'
}

const withPresentation = (media: PortfolioMedia, presentation?: MediaPresentation): PortfolioMedia => ({
  ...media,
  presentation: presentation ?? media.presentation ?? defaultPresentation(media),
})

const makeGroup = (
  id: string,
  title: string,
  media: PortfolioMedia[],
  options: { theme?: string; initialVisibleCount?: number; presentation?: MediaPresentation } = {},
): PortfolioMediaGroup | undefined => {
  const groupMedia = media.map((item) => withPresentation(item, options.presentation))
  if (!groupMedia.length) return undefined
  return {
    id,
    title,
    theme: options.theme,
    initialVisibleCount: options.initialVisibleCount ?? 4,
    media: groupMedia,
  }
}

const byName = (media: PortfolioMedia[], patterns: Array<string | RegExp>) => media.filter((item) =>
  patterns.some((pattern) => typeof pattern === 'string' ? item.filename.includes(pattern) : pattern.test(item.filename)))

const notInGroups = (media: PortfolioMedia[], groups: Array<PortfolioMediaGroup | undefined>) => {
  const used = new Set(groups.flatMap((group) => group?.media.map((item) => item.filename) ?? []))
  return media.filter((item) => !used.has(item.filename))
}

const groupedByAspect = (media: PortfolioMedia[], title: string) => makeGroup(slug(title), title, media)

function buildCharliiGroups(media: PortfolioMedia[]): PortfolioMediaGroup[] {
  const pink = byName(media, [
    /TOF_ad/i,
    /BOF_ad/i,
    /MOF_ad-2/i,
    /TOF_video/i,
    /MOF_video_2/i,
    /BOF_vid/i,
  ])
  const brown = byName(media, [
    /MOF_ad-1/i,
    /MOF_Mega Marylin Set/i,
  ])
  return [
    makeGroup('pink-campaign', 'PINK CAMPAIGN', pink, { theme: 'pink' }),
    makeGroup('brown-campaign', 'BROWN CAMPAIGN', brown, { theme: 'brown' }),
  ].filter(Boolean) as PortfolioMediaGroup[]
}

function buildPowertecGroups(media: PortfolioMedia[]): PortfolioMediaGroup[] {
  const magazine = byName(media, ['Magazine ads.jpg'])
  const packaging = byName(media, [/packaging/i])
  const social = byName(media, ['socials.jpg'])
  const videos = media.filter((item) => item.type === 'video')
  return [
    makeGroup('magazine-ads', 'MAGAZINE ADS', magazine, { presentation: 'full-artwork' }),
    makeGroup('packaging', 'PACKAGING', packaging, { presentation: 'full-artwork' }),
    makeGroup('social-ads', 'SOCIAL ADS', social, { presentation: 'full-artwork' }),
    makeGroup('videos', 'VIDEOS', videos, { theme: 'videos' }),
  ].filter(Boolean) as PortfolioMediaGroup[]
}

function buildProjectGroups(projectId: string, folder: string, media: PortfolioMedia[]): PortfolioMediaGroup[] {
  if (projectId === 'charlie-hair-rollers') return buildCharliiGroups(media)
  if (projectId === 'powertec') return buildPowertecGroups(media)
  if (projectId === 'hardtuned') return [makeGroup('edm', 'EDM', media, { presentation: 'full-artwork' })].filter(Boolean) as PortfolioMediaGroup[]

  const videos = media.filter((item) => item.type === 'video')
  const images = media.filter((item) => item.type === 'image')
  const primaryGroupTitle =
    folder === 'AUDI' || folder === 'UN' ? 'MAGAZINE ADS'
      : folder === 'Real Estate' ? 'BROCHURES'
        : folder === 'Australis Music Group' ? 'BRANDING'
          : folder === 'Elemental Studio' || folder === 'FaceitGraphix' ? 'BRANDING'
            : folder === 'Kean Construction group' || folder === 'The Brooklyn_Wine & Tapas Bar' ? 'ORGANIC SOCIAL'
              : 'SOCIAL ADS'
  const primary = makeGroup(slug(primaryGroupTitle), primaryGroupTitle, images, {
    presentation: ['AUDI', 'UN', 'Real Estate', 'Australis Music Group'].includes(folder) ? 'full-artwork' : undefined,
  })
  const videoGroup = makeGroup('videos', 'VIDEOS', videos, { theme: 'videos' })
  const remaining = notInGroups(media, [primary, videoGroup])
  return [primary, videoGroup, groupedByAspect(remaining, 'MORE WORK')].filter(Boolean) as PortfolioMediaGroup[]
}

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
      presentation: defaultPresentation({ ...image, type: 'image', alt: '' }),
    }))
    const videos: PortfolioMedia[] = group.videos.map((video, index) => ({
      ...video,
      type: 'video',
      alt: `${meta.title} portfolio video: ${videoTitle(video.filename, video.label)}`,
      poster: videoPoster(id, index),
      role: 'detail',
      presentation: 'wide',
    }))
    const media = [...images, ...videos]

    return {
      id,
      folder: group.folder,
      client: meta.client,
      title: meta.title,
      disciplines: meta.disciplines,
      categories: meta.categories,
      creativeDirection: meta.creativeDirection,
      media,
      groups: buildProjectGroups(id, group.folder, media),
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
