export type CinematicCategoryId = 'social-ads' | 'organic-social' | 'magazine-ads' | 'branding' | 'video'

export type CinematicMedia = {
  src: string
  type: 'image' | 'video'
  alt: string
}

export type CinematicField = {
  label: string
  value: string
}

export type CinematicProject = {
  id: string
  category: CinematicCategoryId
  client: string
  title: string
  descriptor: string
  stationLine: string
  environment: 'billboard' | 'phone' | 'editorial' | 'gallery' | 'screen'
  fields: CinematicField[]
  palette?: string[]
  media: CinematicMedia[]
  featuredMediaIndex?: number
}

export type CinematicCategory = {
  id: CinematicCategoryId
  label: string
  scene: string
  summary: string
}

export const cinematicCategories: CinematicCategory[] = [
  {
    id: 'social-ads',
    label: 'Social Ads',
    scene: 'street screens',
    summary: 'Campaign work staged as large-format digital surfaces and selective mobile placements.',
  },
  {
    id: 'organic-social',
    label: 'Organic Social',
    scene: 'feed arcade',
    summary: 'Social systems arranged like a live content corridor, with each brand held as one station.',
  },
  {
    id: 'magazine-ads',
    label: 'Magazine Ads',
    scene: 'editorial hall',
    summary: 'Print and magazine work shown on tactile editorial planes without distorting the artwork.',
  },
  {
    id: 'branding',
    label: 'Branding',
    scene: 'studio frontage',
    summary: 'Identity systems, guides and branded surfaces shown as gallery-scale presentation boards.',
  },
  {
    id: 'video',
    label: 'Video',
    scene: 'screen room',
    summary: 'Motion work presented one screen at a time with manual playback controls.',
  },
]

export const cinematicProjects: CinematicProject[] = [
  {
    id: 'charlii-mega-marilyn',
    category: 'social-ads',
    client: 'Charlii',
    title: 'Mega Marilyn Stylist Set',
    descriptor: 'Social campaign',
    stationLine: 'Salon-worthy hair at home.',
    environment: 'billboard',
    fields: [
      { label: 'Message', value: 'Mega Marilyn Stylist Set' },
      { label: 'Type of work', value: 'Social campaign' },
    ],
    palette: ['#e6a0a6', '#f5d6d3', '#bb6b62', '#2a080b'],
    media: [
      { src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2_landscape.jpg', type: 'image', alt: 'Charlii Mega Marilyn Stylist Set landscape social campaign creative' },
      { src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2.jpg', type: 'image', alt: 'Charlii Mega Marilyn Stylist Set square social creative' },
      { src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2_long.jpg', type: 'image', alt: 'Charlii Mega Marilyn Stylist Set portrait social creative' },
      { src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_Mega Marylin Set.mp4', type: 'video', alt: 'Charlii Mega Marilyn Stylist Set video' },
    ],
  },
  {
    id: 'charlii-no-heat-damage',
    category: 'social-ads',
    client: 'Charlii',
    title: 'No Heat Damage',
    descriptor: 'Social campaign',
    stationLine: 'No heat damage.',
    environment: 'phone',
    fields: [
      { label: 'Message', value: 'No heat damage' },
      { label: 'Type of work', value: 'Social campaign' },
    ],
    palette: ['#f3c8c5', '#f6e4dc', '#9c5552', '#2d0a0b'],
    featuredMediaIndex: 1,
    media: [
      { src: '/projects/Charlie Hair rollers/TOF_ads + vid/TOF_ad_2.jpg', type: 'image', alt: 'Charlii No Heat Damage social campaign creative' },
      { src: '/projects/Charlie Hair rollers/TOF_ads + vid/TOF_ad-2_landscape.jpg', type: 'image', alt: 'Charlii No Heat Damage landscape campaign creative' },
      { src: '/projects/Charlie Hair rollers/TOF_ads + vid/TOF_ad-2_long.jpg', type: 'image', alt: 'Charlii No Heat Damage portrait campaign creative' },
    ],
  },
  {
    id: 'outback-marine',
    category: 'social-ads',
    client: 'Powertec',
    title: 'Outback Marine',
    descriptor: 'Social and video campaign',
    stationLine: 'Managed social media campaigns for two Powertec-owned brands.',
    environment: 'billboard',
    fields: [
      { label: 'Client', value: 'Powertec' },
      { label: 'Type of work', value: 'Social and video campaign' },
    ],
    media: [
      { src: '/projects/Powertec/socials.jpg', type: 'image', alt: 'Outback Marine and Powertec social campaign board' },
      { src: '/projects/Powertec/Outback Marine_Facebook Sales Campaign.mp4', type: 'video', alt: 'Outback Marine Facebook sales campaign video' },
    ],
  },
  {
    id: 'all-day-workwear',
    category: 'social-ads',
    client: 'All Day Workwear',
    title: 'All Day Workwear',
    descriptor: 'Campaign banners',
    stationLine: 'Stay safe and comfortable 24/7.',
    environment: 'billboard',
    fields: [
      { label: 'Type of work', value: 'Campaign banners' },
      { label: 'Message', value: 'Stay safe and comfortable 24/7' },
    ],
    media: [
      { src: '/projects/All Day Workwear/All Day Workwear.jpg', type: 'image', alt: 'All Day Workwear campaign banner' },
      { src: '/projects/All Day Workwear/All Day Workwear (1).jpg', type: 'image', alt: 'All Day Workwear campaign banner variation' },
    ],
  },
  {
    id: 'kean-organic',
    category: 'organic-social',
    client: 'Kean',
    title: 'Kean',
    descriptor: 'Organic social',
    stationLine: 'Project delivery and construction updates.',
    environment: 'phone',
    fields: [
      { label: 'Content focus', value: 'Project delivery and construction updates' },
      { label: 'Type of work', value: 'Organic social' },
    ],
    media: [
      { src: '/projects/Kean Construction group/KEANE_Design-and-Construction.jpg', type: 'image', alt: 'Kean design and construction organic social post' },
      { src: '/projects/Kean Construction group/KEANE_project-highlights.jpg', type: 'image', alt: 'Kean project highlights organic social post' },
      { src: '/projects/Kean Construction group/KEANE_NEW-PROJECT-AWARDS.jpg', type: 'image', alt: 'Kean new project awards organic social post' },
      { src: '/projects/Kean Construction group/KEANE_organic-posts_June_1.jpg', type: 'image', alt: 'Kean June organic social post' },
    ],
  },
  {
    id: 'vetner-organic',
    category: 'organic-social',
    client: 'Vetner',
    title: 'Vetner',
    descriptor: 'Organic social',
    stationLine: 'Product-led organic content.',
    environment: 'phone',
    fields: [
      { label: 'Content focus', value: 'Product-led organic content' },
      { label: 'Type of work', value: 'Organic social' },
    ],
    media: [
      { src: '/projects/Vetner/Vetner_organic-posts_April_1.jpg', type: 'image', alt: 'Vetner organic social post April 1' },
      { src: '/projects/Vetner/Vetner_organic-posts_April_2.jpg', type: 'image', alt: 'Vetner organic social post April 2' },
      { src: '/projects/Vetner/Vetner_organic-posts_April_3.jpg', type: 'image', alt: 'Vetner organic social post April 3' },
      { src: '/projects/Vetner/Vetner_organic-posts_April_4.jpg', type: 'image', alt: 'Vetner organic social post April 4' },
      { src: '/projects/Vetner/Cargo-Nets_1.jpg', type: 'image', alt: 'Vetner cargo nets square social creative' },
      { src: '/projects/Vetner/Cargo-Nets_1_landscape.jpg', type: 'image', alt: 'Vetner cargo nets landscape social creative' },
      { src: '/projects/Vetner/Cargo-Nets_1_long.jpg', type: 'image', alt: 'Vetner cargo nets portrait social creative' },
      { src: '/projects/Vetner/Cargo-Nets_2.jpg', type: 'image', alt: 'Vetner cargo nets second square social creative' },
      { src: '/projects/Vetner/Cargo-Nets_2_landscape.jpg', type: 'image', alt: 'Vetner cargo nets second landscape social creative' },
      { src: '/projects/Vetner/Cargo-Nets_2_long.jpg', type: 'image', alt: 'Vetner cargo nets second portrait social creative' },
    ],
  },
  {
    id: 'sycamore-organic',
    category: 'organic-social',
    client: 'The Sycamore School',
    title: 'The Sycamore School',
    descriptor: 'Organic social',
    stationLine: 'School, allied health and open day content.',
    environment: 'phone',
    fields: [
      { label: 'Content focus', value: 'School, allied health and open day content' },
      { label: 'Type of work', value: 'Organic social' },
    ],
    media: [
      { src: '/projects/The Sycamore school/Organic_April/Sycamore_organic_April_1.jpg', type: 'image', alt: 'The Sycamore School organic social post' },
      { src: '/projects/The Sycamore school/Organic_April/Sycamore_organic_April_2.jpg', type: 'image', alt: 'The Sycamore School organic social post variation' },
      { src: '/projects/The Sycamore school/Campaign 1_this is Sycamore.mp4', type: 'video', alt: 'The Sycamore School campaign video' },
    ],
  },
  {
    id: 'brooklyn-organic',
    category: 'organic-social',
    client: 'The Brooklyn',
    title: 'The Brooklyn',
    descriptor: 'Organic social',
    stationLine: 'Wine and tapas social system.',
    environment: 'phone',
    fields: [
      { label: 'Content focus', value: 'Wine and tapas social system' },
      { label: 'Type of work', value: 'Organic social' },
    ],
    media: [
      { src: '/projects/The Brooklyn_Wine & Tapas Bar/The Brooklyn_Wine & Tapas Bar_Socials.jpg', type: 'image', alt: 'The Brooklyn Wine and Tapas Bar social content board' },
    ],
  },
  {
    id: 'audi-q7',
    category: 'magazine-ads',
    client: 'Audi',
    title: 'Q7',
    descriptor: 'Magazine campaign',
    stationLine: 'Vooow. The new Audi Q7.',
    environment: 'editorial',
    fields: [
      { label: 'Campaign', value: 'Q7' },
      { label: 'Format', value: 'Magazine campaign' },
    ],
    media: [
      { src: '/projects/AUDI/AUDI.jpg', type: 'image', alt: 'Audi Q7 magazine campaign artwork' },
    ],
  },
  {
    id: 'powertec-r41',
    category: 'magazine-ads',
    client: 'Powertec',
    title: 'R41',
    descriptor: 'Magazine campaign',
    stationLine: 'Cel-Fi Roam R41 magazine campaign.',
    environment: 'editorial',
    fields: [
      { label: 'Campaign', value: 'R41' },
      { label: 'Format', value: 'Magazine campaign' },
    ],
    media: [
      { src: '/projects/Powertec/Magazine ads.jpg', type: 'image', alt: 'Powertec R41 magazine campaign board' },
    ],
  },
  {
    id: 'un-covid',
    category: 'magazine-ads',
    client: 'United Nations',
    title: 'COVID-19 Campaign',
    descriptor: 'Print campaign',
    stationLine: 'We Can Beat This.',
    environment: 'editorial',
    fields: [
      { label: 'Campaign', value: 'COVID-19 Campaign' },
      { label: 'Format', value: 'Print campaign' },
    ],
    media: [
      { src: '/projects/UN/United Nations_Covid19 Campaign.jpg', type: 'image', alt: 'United Nations COVID-19 campaign poster We Can Beat This' },
      { src: '/projects/UN/United Nations_Covid19 Campaign (1).jpg', type: 'image', alt: 'United Nations COVID-19 campaign Clean Water and Frontline Workers poster' },
      { src: '/projects/UN/United Nations_Covid19 Campaign (2).jpg', type: 'image', alt: 'United Nations COVID-19 campaign Masked Warrior poster' },
    ],
  },
  {
    id: 'orange-amplifiers',
    category: 'branding',
    client: 'Australis',
    title: 'Orange Amplifiers',
    descriptor: 'Brand guide',
    stationLine: 'Brand guide and social system.',
    environment: 'gallery',
    fields: [
      { label: 'Deliverable', value: 'Brand guide and social system' },
      { label: 'Client', value: 'Australis' },
    ],
    palette: ['#f26a21', '#111111', '#f3f0e8', '#d8d2c4'],
    media: [
      { src: '/projects/Australis Music Group/Australis Music Group (1).jpg', type: 'image', alt: 'Orange Amplifiers brand guide artwork' },
      { src: '/projects/Australis Music Group/Australis Music Group (2).jpg', type: 'image', alt: 'Orange Amplifiers social system artwork' },
    ],
  },
  {
    id: 'elemental-studio',
    category: 'branding',
    client: 'Elemental Studio',
    title: 'Logo and Business Cards',
    descriptor: 'Brand identity',
    stationLine: 'Logo and business card identity.',
    environment: 'gallery',
    fields: [
      { label: 'Deliverable', value: 'Logo and business cards' },
      { label: 'Type of work', value: 'Brand identity' },
    ],
    media: [
      { src: '/projects/Elemental Studio/Elemental Studio_Logo+Business Cards.jpg', type: 'image', alt: 'Elemental Studio logo and business card identity' },
    ],
  },
  {
    id: 'faceit-graphix',
    category: 'branding',
    client: 'Faceit Graphix',
    title: 'Faceit Graphix',
    descriptor: 'Brand identity and vehicle wrap',
    stationLine: 'Brand identity and vehicle wrap.',
    environment: 'gallery',
    fields: [
      { label: 'Deliverable', value: 'Brand identity and vehicle wrap' },
      { label: 'Client', value: 'Faceit Graphix' },
    ],
    media: [
      { src: '/projects/FaceitGraphix/FaceitGraphix_car wrap_new branding + wrap.jpg', type: 'image', alt: 'Faceit Graphix branding and vehicle wrap presentation' },
    ],
  },
  {
    id: 'watchai',
    category: 'branding',
    client: 'Powertec',
    title: 'WatchAI',
    descriptor: 'Branding and packaging',
    stationLine: 'WatchAI branding and packaging.',
    environment: 'gallery',
    fields: [
      { label: 'Deliverable', value: 'Branding and packaging' },
      { label: 'Client', value: 'Powertec' },
    ],
    media: [
      { src: '/projects/Powertec/WatchAi packaging.jpg', type: 'image', alt: 'WatchAI packaging and branding artwork' },
      { src: '/projects/Powertec/watchai-wholesaler-campaign.mp4', type: 'video', alt: 'WatchAI wholesaler campaign video' },
    ],
  },
  {
    id: 'charlii-video',
    category: 'video',
    client: 'Charlii',
    title: 'Mega Marilyn Motion',
    descriptor: 'Video campaign',
    stationLine: 'Mega Marilyn Stylist Set motion creative.',
    environment: 'screen',
    fields: [
      { label: 'Format', value: 'Video campaign' },
      { label: 'Campaign', value: 'Mega Marilyn Stylist Set' },
    ],
    palette: ['#e6a0a6', '#f5d6d3', '#7b2e35'],
    media: [
      { src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2_landscape.jpg', type: 'image', alt: 'Charlii Mega Marilyn campaign poster frame' },
      { src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_Mega Marylin Set.mp4', type: 'video', alt: 'Charlii Mega Marilyn campaign video' },
      { src: '/projects/Charlie Hair rollers/TOF_ads + vid/TOF_video ad.mp4', type: 'video', alt: 'Charlii awareness campaign video' },
    ],
  },
  {
    id: 'powertec-video',
    category: 'video',
    client: 'Powertec',
    title: 'Powertec Campaign Videos',
    descriptor: 'Video campaign',
    stationLine: 'Traffic, awareness and sales campaign motion.',
    environment: 'screen',
    fields: [
      { label: 'Format', value: 'Video campaign' },
      { label: 'Campaign', value: 'Traffic, awareness and sales' },
    ],
    media: [
      { src: '/projects/Powertec/socials.jpg', type: 'image', alt: 'Powertec campaign poster frame' },
      { src: '/projects/Powertec/Powertec_Traffic Facebook Campaign.mp4', type: 'video', alt: 'Powertec traffic Facebook campaign video' },
      { src: '/projects/Powertec/powertec-awarness-facebook-campaign.mp4', type: 'video', alt: 'Powertec awareness Facebook campaign video' },
      { src: '/projects/Powertec/powertec-sales-facebook-campaign.mp4', type: 'video', alt: 'Powertec sales Facebook campaign video' },
    ],
  },
  {
    id: 'sycamore-video',
    category: 'video',
    client: 'The Sycamore School',
    title: 'This is Sycamore',
    descriptor: 'Video campaign',
    stationLine: 'This is Sycamore.',
    environment: 'screen',
    fields: [
      { label: 'Format', value: 'Video campaign' },
      { label: 'Campaign', value: 'This is Sycamore' },
    ],
    media: [
      { src: '/projects/The Sycamore school/campaign-1_this-is-Sycamore_1.jpg', type: 'image', alt: 'The Sycamore School campaign poster frame' },
      { src: '/projects/The Sycamore school/Campaign 1_this is Sycamore.mp4', type: 'video', alt: 'The Sycamore School campaign video' },
    ],
  },
]

export function projectsByCategory(categoryId: CinematicCategoryId) {
  return cinematicProjects.filter((project) => project.category === categoryId)
}

export function findProject(projectId: string) {
  return cinematicProjects.find((project) => project.id === projectId)
}
