import { mediaAudit, mediaManifest, type MediaItem } from './mediaManifest.generated'

export type PortfolioDiscipline = 'social-ads' | 'organic-social' | 'magazine-ads' | 'branding' | 'video' | 'packaging' | 'edm' | 'brochure'
export type MediaPresentation = 'wide' | 'square' | 'portrait' | 'full-artwork'

export type PortfolioMedia = MediaItem & {
  id: string
  type: 'image' | 'video'
  alt: string
  poster?: string
  presentation?: MediaPresentation
  caption?: string
  isDuplicateOf?: string
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
  discipline: PortfolioDiscipline
  initialVisibleCount?: number
  media: PortfolioMedia[]
}

export type PortfolioCreativeSet = {
  id: string
  title: string
  description?: string
  contextLabel?: string
  context?: string[]
  disciplines: PortfolioDiscipline[]
  creativeDirection?: CreativeDirection
  mediaGroups: PortfolioMediaGroup[]
}

export type PortfolioProject = {
  id: string
  folder: string
  client: string
  title: string
  introduction?: string
  creativeSets: PortfolioCreativeSet[]
  media: PortfolioMedia[]
}

type ProjectMeta = {
  client: string
  title: string
  order: number
}

const projectMeta: Record<string, ProjectMeta> = {
  'AUDI': { client: 'Audi', title: 'Audi Q7', order: 1 },
  'Australis Music Group': { client: 'Australis', title: 'Brand identity and campaign work', order: 2 },
  'Charlie Hair rollers': { client: 'Charlii', title: 'Charlii Hair Rollers', order: 3 },
  'Elemental Studio': { client: 'Elemental', title: 'Elemental Studio logo and business cards', order: 4 },
  'FaceitGraphix': { client: 'Faceit Graphix', title: 'Brand identity and vehicle wrap', order: 5 },
  'Hardtuned': { client: 'Hardtuned', title: 'Fashion EDM', order: 6 },
  'Kean Construction group': { client: 'Kean', title: 'Organic social posts', order: 7 },
  'Powertec': { client: 'Powertec', title: 'Magazine, social and packaging designs', order: 8 },
  'Real Estate': { client: 'Real Estate', title: 'Brochure designs', order: 9 },
  'Spinal life': { client: 'Spinal Life Australia', title: 'Organic Social', order: 10 },
  'The Brooklyn_Wine & Tapas Bar': { client: 'The Brooklyn', title: 'Organic Social', order: 11 },
  'The Sycamore school': { client: 'The Sycamore School', title: 'Organic Social', order: 12 },
  'UN': { client: 'United Nations', title: 'COVID-19 Campaign', order: 13 },
  'Vetner': { client: 'Vetner', title: 'Organic Social', order: 14 },
  'All Day Workwear': { client: 'All Day Workwear', title: 'Campaign banners', order: 15 },
}

export const portfolioConfig = {
  showProjectsNavigation: false,
} as const

export const allCategoryFilters = ['Projects', 'Social Ads', 'Organic Social', 'Magazine Ads', 'Branding', 'Video'] as const
export type CategoryFilter = typeof allCategoryFilters[number]
export const categoryFilters = allCategoryFilters.filter((category) => portfolioConfig.showProjectsNavigation || category !== 'Projects')

export const filterDisciplines: Record<string, PortfolioDiscipline | undefined> = {
  'Social Ads': 'social-ads',
  'Organic Social': 'organic-social',
  'Magazine Ads': 'magazine-ads',
  'Branding': 'branding',
  'Video': 'video',
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const videoTitles: Record<string, string> = {
  'Charlie Hair rollers/BOF_ads + vid/BOF_vid 1.mp4': 'BOF remarketing video 01',
  'Charlie Hair rollers/BOF_ads + vid/BOF_vid 2.mp4': 'BOF remarketing video 02',
  'Charlie Hair rollers/MOF_ads + vid/MOF_Mega Marylin Set.mp4': 'Mega Marilyn stylist set video',
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

const defaultPresentation = (media: MediaItem): MediaPresentation => {
  if (media.aspect === 'portrait') return 'portrait'
  if (media.aspect === 'square') return 'square'
  return 'wide'
}

const byName = (media: PortfolioMedia[], patterns: Array<string | RegExp>) => media.filter((item) =>
  patterns.some((pattern) => typeof pattern === 'string' ? item.filename.includes(pattern) : pattern.test(item.filename)))

const withPresentation = (media: PortfolioMedia[], presentation?: MediaPresentation) =>
  media.map((item) => ({ ...item, presentation: presentation ?? item.presentation ?? defaultPresentation(item) }))

const unique = (media: PortfolioMedia[]) => {
  const seen = new Set<string>()
  return media.filter((item) => {
    const key = item.isDuplicateOf ?? item.filename
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function makeGroup(
  id: string,
  title: string,
  discipline: PortfolioDiscipline,
  media: PortfolioMedia[],
  options: { presentation?: MediaPresentation; initialVisibleCount?: number } = {},
): PortfolioMediaGroup | undefined {
  const groupMedia = unique(withPresentation(media, options.presentation))
  if (!groupMedia.length) return undefined
  return {
    id,
    title,
    discipline,
    initialVisibleCount: options.initialVisibleCount ?? 4,
    media: groupMedia,
  }
}

function makeSet(
  id: string,
  title: string,
  mediaGroups: Array<PortfolioMediaGroup | undefined>,
  creativeDirection?: CreativeDirection,
  details: Pick<PortfolioCreativeSet, 'description' | 'contextLabel' | 'context'> = {},
): PortfolioCreativeSet | undefined {
  const groups = mediaGroups.filter(Boolean) as PortfolioMediaGroup[]
  if (!groups.length) return undefined
  return {
    id,
    title,
    ...details,
    disciplines: Array.from(new Set(groups.map((group) => group.discipline))),
    creativeDirection,
    mediaGroups: groups,
  }
}

function buildCharlii(media: PortfolioMedia[]) {
  const pink = byName(media, [/TOF_ad/i, /BOF_ad/i, /MOF_ad-2/i, /TOF_video/i, /MOF_video_2/i, /BOF_vid/i])
  const brown = byName(media, [/MOF_ad-1/i, /MOF_Mega Marylin Set/i])
  return [
    makeSet('salon-results-at-home', 'Charlii Hair Rollers', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', pink.filter((item) => item.type === 'image')),
      makeGroup('videos', 'VIDEOS', 'video', pink.filter((item) => item.type === 'video')),
    ], {
      messaging: ['Salon Results at home', 'No heat damage'],
    }, {
      description: 'Full funnel social media campaign',
      contextLabel: 'Campaign idea',
      context: ['Salon Results at home', 'No heat damage'],
    }),
    makeSet('mega-marilyn-stylist-set', 'Mega Marilyn Stylist Set', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', brown.filter((item) => item.type === 'image')),
      makeGroup('videos', 'VIDEOS', 'video', brown.filter((item) => item.type === 'video')),
    ], {
      messaging: ['Mega Marilyn Stylist Set'],
    }, {
      description: 'Product-led social campaign',
      contextLabel: 'Key line',
      context: ['Mega Marilyn Stylist Set'],
    }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildPowertec(media: PortfolioMedia[]) {
  const magazine = byName(media, ['Magazine ads.jpg'])
  const packaging = byName(media, ['Powertec/packaging (1).jpg', 'Powertec/packaging.jpg'])
  const watchAiPackaging = byName(media, ['WatchAi packaging.jpg'])
  const staticSocial = byName(media, ['socials.jpg'])
  const outbackVideos = byName(media, [/Outback Marine_Facebook Sales Campaign/i])
  const watchAiVideos = byName(media, [/WatchAi_Wholesaler Campaign/i, /watchai-wholesaler-campaign/i])
  const powertecVideos = byName(media, [/Powertec_Traffic/i, /powertec-awarness/i, /powertec-sales/i])

  return [
    makeSet('r41-magazine-campaign', 'Powertec R41 Magazine Campaign', [
      makeGroup('magazine-ads', 'MAGAZINE ADS', 'magazine-ads', magazine, { presentation: 'full-artwork' }),
    ], undefined, { description: 'Magazine ads' }),
    makeSet('powertec-packaging', 'Powertec Packaging', [
      makeGroup('packaging', 'PACKAGING', 'packaging', packaging, { presentation: 'full-artwork' }),
    ], undefined, { description: 'Packaging' }),
    makeSet('watchai-branding-packaging', 'WatchAI', [
      makeGroup('branding', 'BRANDING / PACKAGING', 'branding', watchAiPackaging, { presentation: 'full-artwork' }),
      makeGroup('videos', 'VIDEOS', 'video', watchAiVideos),
    ], undefined, { description: 'Branding and packaging' }),
    makeSet('outback-marine-campaign', 'Outback Marine', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', staticSocial, { presentation: 'full-artwork' }),
      makeGroup('videos', 'VIDEOS', 'video', outbackVideos),
    ], undefined, { description: 'Social and video campaign' }),
    makeSet('powertec-video-campaigns', 'Powertec Video Campaigns', [
      makeGroup('videos', 'VIDEOS', 'video', powertecVideos),
    ], undefined, { description: 'Video' }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildAustralis(media: PortfolioMedia[]) {
  const orange = byName(media, [/Australis Music Group \([1-3]\)\.jpg/i])
  const eventIdentity = byName(media, [/Australis Music Group \(4\)\.jpg/i, /Australis Music Group\.jpg/i])
  return [
    makeSet('orange-amplifiers-brand-guide', 'Orange Amplifiers', [
      makeGroup('branding', 'BRANDING', 'branding', orange, { presentation: 'full-artwork' }),
    ], undefined, { description: 'Brand guide' }),
    makeSet('tac-event-identity', 'TAC', [
      makeGroup('branding', 'BRANDING', 'branding', eventIdentity, { presentation: 'full-artwork' }),
    ], undefined, { description: 'Event identity' }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildUN(media: PortfolioMedia[]) {
  const conceptFor = (item: PortfolioMedia) => {
    if (item.filename.includes('(1)')) return { title: 'We Can Beat This', message: 'We can beat this' }
    if (item.filename.includes('(2)')) return { title: 'Clean Water / Frontline Workers', message: 'May good hygiene protect you' }
    return { title: 'Masked Warrior', message: 'COVID-19. It’s everyone’s fight.' }
  }

  return media.map((item) => {
    const concept = conceptFor(item)
    return makeSet(slug(concept.title), concept.title, [
      makeGroup('magazine-ads', 'MAGAZINE ADS', 'magazine-ads', [item], { presentation: 'portrait' }),
    ], undefined, {
      description: 'COVID-19 Campaign',
      contextLabel: 'Message',
      context: [concept.message],
    })
  }).filter(Boolean) as PortfolioCreativeSet[]
}

function buildGeneric(projectId: string, folder: string, title: string, media: PortfolioMedia[]) {
  const images = media.filter((item) => item.type === 'image')
  const videos = media.filter((item) => item.type === 'video')
  const fullArtworkFolders = ['AUDI', 'Hardtuned', 'Real Estate']
  const discipline: PortfolioDiscipline =
    folder === 'AUDI' ? 'magazine-ads'
      : folder === 'Hardtuned' ? 'edm'
        : folder === 'Real Estate' ? 'brochure'
          : folder === 'Elemental Studio' || folder === 'FaceitGraphix' ? 'branding'
            : folder === 'Kean Construction group' || folder === 'The Brooklyn_Wine & Tapas Bar' ? 'organic-social'
              : 'social-ads'
  const label: Record<PortfolioDiscipline, string> = {
    'social-ads': 'SOCIAL ADS',
    'organic-social': 'ORGANIC SOCIAL',
    'magazine-ads': 'MAGAZINE ADS',
    branding: 'BRANDING',
    video: 'VIDEOS',
    packaging: 'PACKAGING',
    edm: 'EDM',
    brochure: 'BROCHURES',
  }
  const setTitles: Record<string, string> = {
    FaceitGraphix: 'Faceit Graphix',
    'Elemental Studio': 'Elemental Studio',
    'Kean Construction group': 'Kean',
    'The Brooklyn_Wine & Tapas Bar': 'The Brooklyn',
    'All Day Workwear': 'All Day Workwear',
  }
  const descriptions: Record<string, string> = {
    AUDI: 'Magazine ad',
    Hardtuned: 'EDM',
    'Elemental Studio': 'Logo and business cards',
    FaceitGraphix: 'Brand identity and vehicle wrap',
    'Real Estate': 'Brochure design',
    'Kean Construction group': 'Organic Social',
    'The Brooklyn_Wine & Tapas Bar': 'Organic Social',
    'All Day Workwear': 'Campaign banners',
  }
  const setTitle = setTitles[folder] ?? title

  return [
    makeSet(slug(setTitle), setTitle, [
      makeGroup(slug(label[discipline]), label[discipline], discipline, images, {
        presentation: fullArtworkFolders.includes(folder) ? 'full-artwork' : undefined,
      }),
      makeGroup('videos', 'VIDEOS', 'video', videos),
    ], undefined, { description: descriptions[folder] }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildSycamore(media: PortfolioMedia[]) {
  const organic = media.filter((item) => item.type === 'image')
  const videos = media.filter((item) => item.type === 'video')
  return [
    makeSet('sycamore-organic-social', 'The Sycamore School', [
      makeGroup('organic-social', 'ORGANIC SOCIAL', 'organic-social', organic),
    ], undefined, { description: 'Organic Social' }),
    makeSet('sycamore-video', 'The Sycamore School', [
      makeGroup('videos', 'VIDEOS', 'video', videos),
    ], { messaging: ['This is Sycamore'] }, {
      description: 'Video',
      contextLabel: 'Campaign line',
      context: ['This is Sycamore'],
    }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildVetner(media: PortfolioMedia[]) {
  return [
    makeSet('vetner-organic-social', 'Vetner', [
      makeGroup('organic-social', 'ORGANIC SOCIAL', 'organic-social', media.filter((item) => item.type === 'image')),
    ], undefined, { description: 'Organic Social' }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildSpinal(media: PortfolioMedia[]) {
  return [
    makeSet('spinal-organic-social', 'Spinal Life Australia', [
      makeGroup('organic-social', 'ORGANIC SOCIAL', 'organic-social', media.filter((item) => item.type === 'image')),
    ], undefined, { description: 'Organic Social' }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildCreativeSets(projectId: string, folder: string, title: string, media: PortfolioMedia[]) {
  if (projectId === 'charlie-hair-rollers') return buildCharlii(media)
  if (projectId === 'powertec') return buildPowertec(media)
  if (folder === 'Australis Music Group') return buildAustralis(media)
  if (folder === 'UN') return buildUN(media)
  if (folder === 'The Sycamore school') return buildSycamore(media)
  if (folder === 'Vetner') return buildVetner(media)
  if (folder === 'Spinal life') return buildSpinal(media)
  return buildGeneric(projectId, folder, title, media)
}

export const portfolioProjects: PortfolioProject[] = mediaManifest
  .map((group) => {
    const meta = projectMeta[group.folder] ?? { client: group.folder, title: group.folder, order: 999 }
    const id = slug(group.folder)
    const images: PortfolioMedia[] = group.images.map((image) => ({
      ...image,
      id: slug(image.filename),
      type: 'image',
      alt: altFrom(meta.title, image.label),
      presentation: defaultPresentation(image),
    }))
    const videos: PortfolioMedia[] = group.videos.map((video, index) => ({
      ...video,
      id: slug(video.filename),
      type: 'video',
      alt: `${meta.title} portfolio video: ${videoTitle(video.filename, video.label)}`,
      poster: videoPoster(id, index),
      presentation: 'wide',
    }))
    const media = [...images, ...videos]
    return {
      id,
      folder: group.folder,
      client: meta.client,
      title: meta.title,
      media,
      creativeSets: buildCreativeSets(id, group.folder, meta.title, media),
      order: meta.order,
    }
  })
  .sort((a, b) => a.order - b.order)
  .map(({ order: _order, ...project }) => project)

export const clients = portfolioProjects.map((project) => project.client)
export const findProject = (id: string) => portfolioProjects.find((project) => project.id === id)
export const allVideos = portfolioProjects.flatMap((project) => project.media
  .filter((media) => media.type === 'video')
  .map((video) => ({ ...video, displayTitle: videoTitle(video.filename, video.label), projectTitle: project.title })))

export { mediaAudit }
