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
  'Australis Music Group': { client: 'Australis', title: 'Orange Amplifiers brand guide and TAC event', order: 2 },
  'Charlie Hair rollers': { client: 'Charlii', title: 'Charlii Hair Rollers', order: 3 },
  'Elemental Studio': { client: 'Elemental', title: 'Elemental Studio logo and business cards', order: 4 },
  'FaceitGraphix': { client: 'Faceit', title: 'Faceit Graphix branding and wrap', order: 5 },
  'Hardtuned': { client: 'Hardtuned', title: 'Fashion EDM', order: 6 },
  'Kean Construction group': { client: 'Kean', title: 'Organic social posts', order: 7 },
  'Powertec': { client: 'Powertec', title: 'Magazine, social and packaging designs', order: 8 },
  'Real Estate': { client: 'Real Estate', title: 'Brochure designs', order: 9 },
  'Spinal life': { client: 'Spinal', title: 'Organic social', order: 10 },
  'The Brooklyn_Wine & Tapas Bar': { client: 'Brooklyn', title: 'Organic social', order: 11 },
  'The Sycamore school': { client: 'Sycamore', title: 'Social ads', order: 12 },
  'UN': { client: 'UN', title: 'United Nations Covid-19 Campaign', order: 13 },
  'Vetner': { client: 'Vetner', title: 'Social ads', order: 14 },
  'All Day Workwear': { client: 'All Day Workwear', title: 'Campaign banners', order: 15 },
}

export const categoryFilters = ['Projects', 'Social Ads', 'Organic Social', 'Magazine Ads', 'Branding', 'Video'] as const

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
): PortfolioCreativeSet | undefined {
  const groups = mediaGroups.filter(Boolean) as PortfolioMediaGroup[]
  if (!groups.length) return undefined
  return {
    id,
    title,
    disciplines: Array.from(new Set(groups.map((group) => group.discipline))),
    creativeDirection,
    mediaGroups: groups,
  }
}

function buildCharlii(media: PortfolioMedia[]) {
  const pink = byName(media, [/TOF_ad/i, /BOF_ad/i, /MOF_ad-2/i, /TOF_video/i, /MOF_video_2/i, /BOF_vid/i])
  const brown = byName(media, [/MOF_ad-1/i, /MOF_Mega Marylin Set/i])
  return [
    makeSet('pink-campaign', 'Pink Campaign', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', pink.filter((item) => item.type === 'image')),
      makeGroup('videos', 'VIDEOS', 'video', pink.filter((item) => item.type === 'video')),
    ], {
      colors: ['#f7dada', '#d27b88', '#fff3ef', '#ffffff', '#2a1716'],
      typography: 'High-contrast serif with compact social ad support text',
      visualStyle: 'Soft blush beauty scenes, salon-at-home messaging and product-led social placements.',
      messaging: ['Salon Results at home', 'No heat damage'],
    }),
    makeSet('brown-campaign', 'Brown Campaign', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', brown.filter((item) => item.type === 'image')),
      makeGroup('videos', 'VIDEOS', 'video', brown.filter((item) => item.type === 'video')),
    ], {
      colors: ['#2a1716', '#7a4b2d', '#b88a58', '#f2d3ad', '#ffffff'],
      typography: 'Premium serif display with product-set support text',
      visualStyle: 'Brown-and-gold Mega Marilyn visuals with pearls, telephone styling and darker product scenes.',
      messaging: ['Mega Marilyn Stylist Set'],
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
    ], {
      colors: ['#06090d', '#004b8d', '#f4b000', '#ffffff'],
      typography: 'Industrial product-campaign sans serif',
      visualStyle: 'Wide magazine campaign board for R41 product advertising.',
      messaging: ['Powertec R41'],
    }),
    makeSet('powertec-packaging', 'Powertec Packaging', [
      makeGroup('packaging', 'PACKAGING', 'packaging', packaging, { presentation: 'full-artwork' }),
    ], {
      colors: ['#071120', '#005aa6', '#f4b000', '#ffffff'],
      typography: 'Technical packaging sans serif',
      visualStyle: 'Wide packaging boards with product pack variations and technical hierarchy.',
      messaging: ['Powertec packaging'],
    }),
    makeSet('watchai-branding-packaging', 'WatchAI Branding and Packaging', [
      makeGroup('branding', 'BRANDING / PACKAGING', 'branding', watchAiPackaging, { presentation: 'full-artwork' }),
      makeGroup('videos', 'VIDEOS', 'video', watchAiVideos),
    ], {
      colors: ['#101820', '#00a3c7', '#ffffff', '#94a3ad'],
      typography: 'Clean technology product sans serif',
      visualStyle: 'WatchAI product packaging and wholesaler campaign video assets.',
      messaging: ['WatchAi'],
    }),
    makeSet('outback-marine-campaign', 'Outback Marine Campaign', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', staticSocial, { presentation: 'full-artwork' }),
      makeGroup('videos', 'VIDEOS', 'video', outbackVideos),
    ], {
      colors: ['#0d1f32', '#f4b000', '#ffffff', '#477b9a'],
      typography: 'Bold campaign sans serif over marine imagery',
      visualStyle: 'Marine campaign creative across static social and video placements.',
      messaging: ['Outback Marine'],
    }),
    makeSet('powertec-video-campaigns', 'Powertec Video Campaigns', [
      makeGroup('videos', 'VIDEOS', 'video', powertecVideos),
    ], {
      colors: ['#101820', '#005aa6', '#f4b000', '#ffffff'],
      typography: 'Product campaign sans serif captions and overlays',
      visualStyle: 'Powertec awareness, traffic and sales video campaign files.',
      messaging: ['Powertec traffic campaign', 'Powertec awareness campaign', 'Powertec sales campaign'],
    }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildAustralis(media: PortfolioMedia[]) {
  const orange = byName(media, [/Australis Music Group \([1-3]\)\.jpg/i])
  const eventIdentity = byName(media, [/Australis Music Group \(4\)\.jpg/i, /Australis Music Group\.jpg/i])
  return [
    makeSet('orange-amplifiers-brand-guide', 'Orange Amplifiers Brand Guide', [
      makeGroup('branding', 'BRANDING', 'branding', orange, { presentation: 'full-artwork' }),
    ], {
      colors: ['#f36f21', '#ffffff', '#171313', '#f6f0e7'],
      typography: 'Editorial serif paired with product-table typography',
      visualStyle: 'Orange Amplifiers guide layouts and product information spreads.',
      messaging: ['Orange Amplifiers'],
    }),
    makeSet('tac-event-identity', 'TAC / Artist Centre Event Identity', [
      makeGroup('branding', 'BRANDING', 'branding', eventIdentity, { presentation: 'full-artwork' }),
    ], {
      colors: ['#15110f', '#c69a52', '#ffffff', '#f0e6d7'],
      typography: 'Event identity typography with premium contrast',
      visualStyle: 'Event-led identity boards separated from the Orange Amplifiers system.',
      messaging: ['TAC event'],
    }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildUN(media: PortfolioMedia[]) {
  return media.map((item, index) => makeSet(`ad-concept-${index + 1}`, `Ad Concept ${String(index + 1).padStart(2, '0')}`, [
    makeGroup('magazine-ads', 'MAGAZINE ADS', 'magazine-ads', [item], { presentation: 'portrait' }),
  ], {
    typography: 'Clear public-information sans serif',
    visualStyle: index === 0
      ? 'COVID-19 title treatment with a graphic hand symbol.'
      : index === 1
        ? 'Institutional poster layout with a strong central message.'
        : 'Portrait public-health campaign artwork with direct typographic hierarchy.',
    messaging: ['United Nations Covid-19 Campaign'],
  })).filter(Boolean) as PortfolioCreativeSet[]
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
  const colors: Record<string, string[]> = {
    AUDI: ['#0b0b0b', '#6d7070', '#cfd4d2', '#ffffff', '#e43d64'],
    Hardtuned: ['#0f0f0f', '#f7f7f7', '#d9d0c8', '#8a817d'],
    'Elemental Studio': ['#111111', '#f5f0e8', '#d4c3aa', '#ffffff'],
    FaceitGraphix: ['#101010', '#f1f1f1', '#c9c9c9', '#e53c34'],
    'Real Estate': ['#101010', '#ffffff', '#d8d2c7', '#8f8174'],
  }
  const visual: Record<string, string> = {
    AUDI: 'Monochrome automotive poster treatment with a focused product reveal.',
    Hardtuned: 'Wide EDM artwork with fashion product imagery and editorial layout structure.',
    'Elemental Studio': 'Quiet identity system with logo and business-card presentation.',
    FaceitGraphix: 'Branding system applied across vehicle-wrap artwork.',
    'Real Estate': 'Landscape property brochure layouts with image-led spreads.',
  }
  return [
    makeSet(slug(title), title, [
      makeGroup(slug(label[discipline]), label[discipline], discipline, images, {
        presentation: fullArtworkFolders.includes(folder) ? 'full-artwork' : undefined,
      }),
      makeGroup('videos', 'VIDEOS', 'video', videos),
    ], {
      colors: colors[folder],
      typography: discipline === 'branding' ? 'Identity-focused type treatment' : discipline === 'organic-social' ? 'Social post sans serif typography' : undefined,
      visualStyle: visual[folder],
      messaging: [title],
    }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildSycamore(media: PortfolioMedia[]) {
  const organic = byName(media, [/Organic_April/i])
  const videos = media.filter((item) => item.type === 'video')
  const socialAds = media.filter((item) => item.type === 'image' && !organic.includes(item))
  return [
    makeSet('sycamore-social-ads', 'Sycamore Social Ads', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', socialAds),
    ], {
      colors: ['#502c83', '#f7b733', '#ffffff', '#58a6d6'],
      typography: 'Friendly sans serif campaign typography',
      visualStyle: 'School campaign sets across square, portrait and landscape ad ratios.',
      messaging: ['This is Sycamore'],
    }),
    makeSet('sycamore-organic-social', 'Sycamore Organic Social', [
      makeGroup('organic-social', 'ORGANIC SOCIAL', 'organic-social', organic),
    ]),
    makeSet('sycamore-video', 'Sycamore Video', [
      makeGroup('videos', 'VIDEOS', 'video', videos),
    ], {
      messaging: ['This is Sycamore'],
    }),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildVetner(media: PortfolioMedia[]) {
  const organic = byName(media, [/organic-posts/i])
  const socialAds = media.filter((item) => !organic.includes(item))
  return [
    makeSet('vetner-social-ads', 'Vetner Social Ads', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', socialAds),
    ], {
      colors: ['#0f1b25', '#f4a52c', '#ffffff', '#b9c5cf'],
      typography: 'Bold utility-focused sans serif social typography',
      visualStyle: 'Product and trade campaign assets across landscape, square and portrait ratios.',
      messaging: ['Social ads'],
    }),
    makeSet('vetner-organic-social', 'Vetner Organic Social', [
      makeGroup('organic-social', 'ORGANIC SOCIAL', 'organic-social', organic),
    ]),
  ].filter(Boolean) as PortfolioCreativeSet[]
}

function buildSpinal(media: PortfolioMedia[]) {
  const organic = byName(media, [/TOF_back2work/i])
  const socialAds = media.filter((item) => !organic.includes(item))
  return [
    makeSet('spinal-social-ads', 'Spinal Social Ads', [
      makeGroup('social-ads', 'SOCIAL ADS', 'social-ads', socialAds),
    ], {
      colors: ['#18365f', '#f05a28', '#ffffff', '#dce6ee'],
      typography: 'Accessible sans serif campaign typography',
      visualStyle: 'Social campaign assets across square, portrait and landscape placements.',
      messaging: ['Personal Support', 'Back2Work'],
    }),
    makeSet('spinal-organic-social', 'Spinal Organic Social', [
      makeGroup('organic-social', 'ORGANIC SOCIAL', 'organic-social', organic),
    ]),
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
