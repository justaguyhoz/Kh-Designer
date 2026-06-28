import { mediaAudit, mediaManifest, type MediaItem } from './mediaManifest.generated'

export type Project = {
  id: string
  folder: string
  title: string
  category: string
  description: string
  images: MediaItem[]
  videos: MediaItem[]
  cover: string
}

const projectDetails: Record<string, { title: string; category: string; description: string; cover?: number; order: number }> = {
  'UN': { title: 'United Nations Covid-19 Campaign', category: 'Campaign creative', description: 'I developed a visual campaign built around a direct, shared message for the global response to Covid-19.', order: 1 },
  'Charlie Hair rollers': { title: 'Charlii Hair Rollers', category: 'Paid social and digital', description: 'I created a full-funnel social campaign across awareness, consideration and conversion, with assets adapted for every key format.', order: 2 },
  'Powertec': { title: 'Powertec', category: 'Packaging, print and motion', description: 'I worked across packaging, magazine advertising, social content and motion campaigns for Powertec and its product ranges.', order: 3 },
  'The Sycamore school': { title: 'The Sycamore School', category: 'Campaign and social', description: 'I built a flexible campaign system covering school programs, open days, allied health and ongoing social content.', order: 4 },
  'Spinal life': { title: 'Spinal Life Australia', category: 'Digital campaigns', description: 'I created accessible, people-focused campaign assets across multiple messages, audiences and digital formats.', order: 5 },
  'Vetner': { title: 'Vetner', category: 'Paid and organic social', description: 'I designed a broad library of product campaigns, remarketing creative, carousels and organic social content.', order: 6 },
  'Kean Construction group': { title: 'Keane Construction Group', category: 'Social content', description: 'I created a practical social design system for project updates, company news and construction milestones.', order: 7 },
  'Australis Music Group': { title: 'Australis Music Group', category: 'Social and event collateral', description: 'I designed social content, event invitations and merchandise creative for a music industry audience.', order: 8 },
  'Real Estate': { title: 'Regalia and Arcadia', category: 'Real estate marketing', description: 'I developed presentation-led property marketing for two distinct residential projects.', order: 9 },
  'Elemental Studio': { title: 'Elemental Studio', category: 'Brand identity', description: 'I created a restrained identity and stationery system for an architecture studio.', order: 10 },
  'FaceitGraphix': { title: 'FaceitGraphix', category: 'Brand identity and vehicle wrap', description: 'I carried a bold visual identity through to large-format vehicle graphics.', order: 11 },
  'Hardtuned': { title: 'Hardtuned Fashion', category: 'EDM design', description: 'I combined product, fashion and editorial imagery in a series of email campaign designs.', order: 12 },
  'The Brooklyn_Wine & Tapas Bar': { title: 'The Brooklyn Wine and Tapas Bar', category: 'Social media design', description: 'I created warm, character-led social content for a neighbourhood hospitality brand.', order: 13 },
  'All Day Workwear': { title: 'All Day Workwear', category: 'Digital campaign', description: 'I designed product-led campaign banners with a clear retail focus and strong visual hierarchy.', order: 14 },
  'AUDI': { title: 'Audi Q7', category: 'Advertising', description: 'I developed an advertising and billboard concept for the Audi Q7 launch in Israel.', order: 15 },
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const projects: Project[] = mediaManifest
  .map((group) => {
    const details = projectDetails[group.folder] ?? {
      title: group.folder,
      category: 'Additional work',
      description: 'I have included this work as part of the complete project archive.',
      order: 999,
    }
    return {
      id: slug(group.folder),
      folder: group.folder,
      title: details.title,
      category: details.category,
      description: details.description,
      images: group.images,
      videos: group.videos,
      cover: group.images[details.cover ?? 0]?.src ?? '',
      order: details.order,
    }
  })
  .sort((a, b) => a.order - b.order)
  .map(({ order: _order, ...project }) => project)

const videoTitles: Record<string, string> = {
  'Charlie Hair rollers/BOF_ads + vid/BOF_vid 1.mp4': 'Conversion campaign 01',
  'Charlie Hair rollers/BOF_ads + vid/BOF_vid 2.mp4': 'Conversion campaign 02',
  'Charlie Hair rollers/MOF_ads + vid/MOF_Mega Marylin Set.mp4': 'Mega Marilyn campaign',
  'Charlie Hair rollers/MOF_ads + vid/MOF_video_2.mp4': 'Consideration campaign',
  'Charlie Hair rollers/TOF_ads + vid/TOF_video ad.mp4': 'Awareness campaign',
  'Powertec/Outback Marine_Facebook Sales Campaign (1).mp4': 'Outback Marine campaign 01',
  'Powertec/Outback Marine_Facebook Sales Campaign.mp4': 'Outback Marine campaign 02',
  'Powertec/Powertec_Traffic Facebook Campaign.mp4': 'Powertec traffic campaign',
  'Powertec/powertec-awarness-facebook-campaign.mp4': 'Powertec awareness campaign',
  'Powertec/powertec-sales-facebook-campaign.mp4': 'Powertec sales campaign',
  'Powertec/WatchAi_Wholesaler Campaign.mp4': 'WatchAi wholesale campaign 01',
  'Powertec/watchai-wholesaler-campaign.mp4': 'WatchAi wholesale campaign 02',
  'The Sycamore school/Campaign 1_this is Sycamore.mp4': 'This is Sycamore campaign',
}

export const videoPoster = (projectId: string, videoIndex: number) => `/video-posters/${projectId}-${String(videoIndex + 1).padStart(2, '0')}.jpg`

export const allVideos = projects.flatMap((project) => project.videos.map((video, videoIndex) => ({
  ...video,
  displayTitle: videoTitles[video.filename] ?? video.label,
  projectTitle: project.title,
  poster: videoPoster(project.id, videoIndex),
})))

export const videoTitle = (filename: string, fallback: string) => videoTitles[filename] ?? fallback
export { mediaAudit }
