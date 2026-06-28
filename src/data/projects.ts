export type Project = {
  id: string
  title: string
  category: string
  description: string
  images: string[]
  videos: string[]
  featured: boolean
  tags?: string[]
  tone?: 'light' | 'dark'
}

const p = (path: string) => `/projects/${path}`

export const projects: Project[] = [
  {
    id: 'un-covid19',
    title: 'United Nations — Covid-19',
    category: 'Campaign creative',
    description: 'A dramatic visual campaign communicating a shared global fight against Covid-19.',
    images: [
      p('UN/United Nations_Covid19 Campaign.jpg'),
      p('UN/United Nations_Covid19 Campaign (1).jpg'),
      p('UN/United Nations_Covid19 Campaign (2).jpg'),
    ],
    videos: [], featured: true, tags: ['Campaign', 'Art direction'], tone: 'dark',
  },
  {
    id: 'charlii',
    title: 'Charlii Hair Rollers',
    category: 'Social campaign',
    description: 'A multi-format paid social campaign spanning awareness, consideration and conversion creative.',
    images: [
      p('Charlie Hair rollers/BOF_ads + vid/BOF_ad-1.jpg'),
      p('Charlie Hair rollers/MOF_ads + vid/MOF_ad-1_long.jpg'),
      p('Charlie Hair rollers/TOF_ads + vid/TOF_ad_1_landscape.jpg'),
      p('Charlie Hair rollers/BOF_ads + vid/BOF_ad-2_long.jpg'),
    ],
    videos: [p('Charlie Hair rollers/BOF_ads + vid/BOF_vid 1.mov')], featured: true, tags: ['Paid social', 'Digital'],
  },
  {
    id: 'powertec-packaging',
    title: 'Powertec — Brand in Market',
    category: 'Packaging, print & social',
    description: 'A connected suite of packaging, advertising and social creative across Powertec product families.',
    images: [
      p('Powertec/packaging.jpg'), p('Powertec/packaging (1).jpg'), p('Powertec/WatchAi packaging.jpg'), p('Powertec/Magazine ads.jpg'), p('Powertec/socials.jpg'),
    ],
    videos: [], featured: true, tags: ['Packaging', 'Print', 'Social media'], tone: 'dark',
  },
  {
    id: 'spinal-life',
    title: 'Spinal Life Australia',
    category: 'Digital campaign',
    description: 'Accessible, people-first campaign creative adapted across social formats and audiences.',
    images: [
      p('Spinal life/TOF_back2work/26016 Back2Work_v2_square.jpg'),
      p('Spinal life/TOF_back2work/26016-Back2Work_v2_landscape.jpg'),
      p('Spinal life/BOF-Leads_WA_Personal-Support-2.2.26_1-remarketing-ad-set.jpg'),
      p('Spinal life/TOF_back2work/back2work_v1_long.jpg'),
    ],
    videos: [], featured: true, tags: ['Campaign', 'Social media'],
  },
  {
    id: 'audi',
    title: 'Audi Q7',
    category: 'Advertising',
    description: 'Advertising and billboard concept for the Audi Q7 launch in Israel.',
    images: [p('AUDI/AUDI.jpg')], videos: [], featured: true, tags: ['Advertising', 'Outdoor'], tone: 'dark',
  },
  {
    id: 'sycamore',
    title: 'The Sycamore School',
    category: 'Campaign system',
    description: 'A flexible suite of campaign and organic social assets built for varied formats and messages.',
    images: [
      p('The Sycamore school/campaign-1_this-is-Sycamore_1.jpg'),
      p('The Sycamore school/ages-3-4_campaign-refresh_1.jpg'),
      p('The Sycamore school/Organic_April/Sycamore_organic_April_2.jpg'),
      p('The Sycamore school/allied-health_long.jpg'),
    ],
    videos: [p('The Sycamore school/Campaign 1_this is Sycamore.mov')], featured: true, tags: ['Education', 'Digital'],
  },
  {
    id: 'real-estate',
    title: 'Regalia & Arcadia',
    category: 'Real estate marketing',
    description: 'Property marketing presentations for two distinctive residential developments.',
    images: [p('Real Estate/Real Estate_REGALIA_Project.jpg'), p('Real Estate/Real Estate_ARCADIA Project.jpg')],
    videos: [], featured: true, tags: ['Property', 'Editorial'],
  },
  {
    id: 'elemental',
    title: 'Elemental Studio',
    category: 'Brand identity',
    description: 'A composed identity and stationery system for an architecture studio.',
    images: [p('Elemental Studio/Elemental Studio_Logo+Business Cards.jpg')], videos: [], featured: true, tags: ['Identity', 'Print'], tone: 'dark',
  },
  {
    id: 'australis',
    title: 'Australis Music Group',
    category: 'Social & event collateral',
    description: 'Energetic social, event and merchandise creative for a music industry audience.',
    images: [
      p('Australis Music Group/Australis Music Group.jpg'),
      p('Australis Music Group/Australis Music Group (1).jpg'),
      p('Australis Music Group/Australis Music Group (2).jpg'),
      p('Australis Music Group/Australis Music Group (4).jpg'),
    ],
    videos: [], featured: true, tags: ['Social media', 'Events'], tone: 'dark',
  },
  {
    id: 'all-day-workwear',
    title: 'All Day Workwear',
    category: 'Campaign banners',
    description: 'Product-led retail campaign creative designed for quick recognition and impact.',
    images: [p('All Day Workwear/All Day Workwear.jpg'), p('All Day Workwear/All Day Workwear (1).jpg')],
    videos: [], featured: true, tags: ['Retail', 'Digital campaign'],
  },
  {
    id: 'faceitgraphix',
    title: 'FaceitGraphix',
    category: 'Brand identity & vehicle wrap',
    description: 'A bold rebrand carried from identity through to large-format vehicle graphics.',
    images: [p('FaceitGraphix/FaceitGraphix_car wrap_new branding + wrap.jpg')], videos: [], featured: true, tags: ['Identity', 'Vehicle wrap'], tone: 'dark',
  },
  {
    id: 'hardtuned',
    title: 'Hardtuned Fashion',
    category: 'EDM design',
    description: 'Editorial email creative bringing fashion imagery and product storytelling together.',
    images: [p('Hardtuned/Fashion_EDM.jpg'), p('Hardtuned/Fashion_EDM (1).jpg'), p('Hardtuned/Fashion_EDM (2).jpg')],
    videos: [], featured: true, tags: ['EDM', 'Fashion'], tone: 'dark',
  },
  {
    id: 'brooklyn',
    title: 'The Brooklyn Wine & Tapas Bar',
    category: 'Social media design',
    description: 'Warm, characterful social content for a neighbourhood hospitality brand.',
    images: [p('The Brooklyn_Wine & Tapas Bar/The Brooklyn_Wine & Tapas Bar_Socials.jpg')],
    videos: [], featured: true, tags: ['Hospitality', 'Social media'], tone: 'dark',
  },
]

export const videoProjects = [
  { title: 'Powertec — Awareness', category: 'Social video', src: p('Powertec/powertec-awarness-facebook-campaign.mp4'), poster: p('Powertec/socials.jpg') },
  { title: 'Outback Marine — Sales', category: 'Social video', src: p('Powertec/Outback Marine_Facebook Sales Campaign.mp4'), poster: p('Powertec/packaging (1).jpg') },
  { title: 'Powertec — Traffic', category: 'Social video', src: p('Powertec/Powertec_Traffic Facebook Campaign.mp4'), poster: p('Powertec/Magazine ads.jpg') },
  { title: 'WatchAi — Wholesale', category: 'Product campaign', src: p('Powertec/WatchAi_Wholesaler Campaign.mp4'), poster: p('Powertec/WatchAi packaging.jpg') },
]
