import { useEffect, useMemo, useState } from 'react'
import { categoryFilters, portfolioProjects, videoTitle, type PortfolioMedia, type PortfolioProject } from './data/projects'

const Arrow = () => <span aria-hidden="true">→</span>

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const items = ['Work', 'About', 'Contact']

  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Katty Hozavsky home"><span>KH</span><small>Designer</small></a>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav">{menuOpen ? 'Close' : 'Menu'}</button>
    <nav id="main-nav" className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
      {items.map((label) => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <p className="eyebrow">Katty Hozavsky Senior Designer &amp; Social Media Creator</p>
    <div className="hero-grid">
      <h1>Selected Works</h1>
      <div className="hero-note">
        <a href="#work">View work <Arrow /></a>
      </div>
    </div>
  </section>
}

function CategoryButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return <button className={active ? 'category-tab active' : 'category-tab'} onClick={onClick} aria-pressed={active}>{children}</button>
}

function PortfolioExplorer() {
  const [activeFilter, setActiveFilter] = useState('All Work')

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'All Work') return portfolioProjects
    return portfolioProjects.filter((project) => project.categories.includes(activeFilter))
  }, [activeFilter])

  return <section className="work section" id="work">
    <nav className="portfolio-nav" aria-label="Portfolio categories">
      {categoryFilters.map((category) => <CategoryButton key={category} active={activeFilter === category} onClick={() => setActiveFilter(category)}>{category}</CategoryButton>)}
    </nav>

    <div className="portfolio-stack">
      {visibleProjects.map((project, index) => project.displayTheme === 'charlii'
        ? <CharliiShowcase key={project.id} project={project} />
        : <ProjectShowcase key={project.id} project={project} index={index} />)}
    </div>
  </section>
}

function selectMedia(project: PortfolioProject, match: string) {
  return project.media.find((media) => media.filename.includes(match))
}

function mediaKey(media: PortfolioMedia) {
  return media.filename
}

function mediaClasses(media: PortfolioMedia, className: string) {
  return ['media-frame', `media-${media.type}`, `media-${media.aspect ?? 'wide'}`, className].filter(Boolean).join(' ')
}

function MediaFrame({ media, className = '', priority = false, preview = false }: { media?: PortfolioMedia; className?: string; priority?: boolean; preview?: boolean }) {
  if (!media) return null
  if (media.type === 'video') {
    return <figure className={mediaClasses(media, className)}>
      <video
        src={media.src}
        poster={media.poster}
        autoPlay={preview}
        muted={preview}
        loop={preview}
        controls
        playsInline
        preload="metadata"
        aria-label={media.alt}
      />
      <figcaption>{videoTitle(media.filename, media.label)}</figcaption>
    </figure>
  }

  return <figure className={mediaClasses(media, className)}>
    <img src={media.src} width={media.width} height={media.height} alt={media.alt} loading={priority ? 'eager' : 'lazy'} />
  </figure>
}

function dedupeVisibleMedia(project: PortfolioProject, media: PortfolioMedia[]) {
  if (project.id === 'powertec') {
    const visibleVideos = [
      'Powertec_Traffic Facebook Campaign.mp4',
      'Outback Marine_Facebook Sales Campaign.mp4',
      'WatchAi_Wholesaler Campaign.mp4',
    ]
    return media.filter((item) => item.type === 'image' || visibleVideos.some((name) => item.filename.endsWith(name)))
  }

  return media
}

function ProjectMediaRun({ project, skip = [] }: { project: PortfolioProject; skip?: string[] }) {
  const skipSet = new Set(skip)
  const media = dedupeVisibleMedia(project, project.media.filter((item) => !skipSet.has(mediaKey(item))))
  if (!media.length) return null

  return <div className="media-run" aria-label={`${project.title} media`}>
    {media.map((item) => <MediaFrame key={item.src} media={item} className="run-item" />)}
  </div>
}

function featuredVideo(project: PortfolioProject) {
  if (project.id === 'powertec') {
    return project.media.find((media) => media.filename.endsWith('Powertec_Traffic Facebook Campaign.mp4'))
  }
  return project.media.find((media) => media.type === 'video')
}

function ProjectShowcase({ project, index }: { project: PortfolioProject; index: number }) {
  const wideImages = project.media.filter((media) => media.type === 'image' && media.aspect === 'wide')
  const hero = wideImages[0] ?? project.media.find((media) => media.type === 'image') ?? project.media[0]
  const support = project.media.find((media) => media !== hero && media.type === 'image' && media.aspect !== 'wide') ?? wideImages[1] ?? project.media.find((media) => media !== hero)
  const motion = featuredVideo(project)
  const skip = [hero, support, motion].filter(Boolean).map((media) => mediaKey(media as PortfolioMedia))
  const tone = `tone-${index % 4}`

  return <article id={project.id} className={`project-showcase ${tone}`} aria-labelledby={`${project.id}-title`}>
    <div className="project-hero">
      <div className="project-copy">
        <p className="eyebrow">{project.client}</p>
        <h2 id={`${project.id}-title`}>{project.title}</h2>
      </div>
      <div className="project-media-composition">
        <MediaFrame media={hero} className="project-primary" priority={index < 2} />
        <MediaFrame media={support} className="project-support" />
        {motion && <MediaFrame media={motion} className="project-motion" preview={project.id === 'powertec'} />}
      </div>
    </div>
    <ProjectMediaRun project={project} skip={skip} />
  </article>
}

function StageLabel({ number, title }: { number: string; title: string }) {
  return <div className="stage-label">
    <span>{number}</span>
    <strong>{title}</strong>
  </div>
}

function CharliiShowcase({ project }: { project: PortfolioProject }) {
  const hero = selectMedia(project, 'TOF_ad-2_landscape')
  const tofSquare = selectMedia(project, 'TOF_ad_2.jpg')
  const tofDetail = selectMedia(project, 'TOF_ad_3.jpg')
  const tofPortrait = selectMedia(project, 'TOF_ad-3_long')
  const mofWide = selectMedia(project, 'MOF_ad-1_landscape')
  const mofSquare = selectMedia(project, 'MOF_ad-2.jpg')
  const mofPortrait = selectMedia(project, 'MOF_ad-1_long')
  const bofWide = selectMedia(project, 'BOF_ad-1_landscape')
  const bofSquare = selectMedia(project, 'BOF_ad-2.jpg')
  const bofPortrait = selectMedia(project, 'BOF_ad-1_long')
  const videos = project.media.filter((media) => media.type === 'video')

  return <article id={project.id} className="charlii-showcase" aria-labelledby="charlii-title">
    <div className="charlii-hero">
      <div className="charlii-title">
        <p className="eyebrow">Social Media Video Campaigns</p>
        <h2 id="charlii-title">{project.title}</h2>
        <p className="subtitle">Full funnel social media campaign</p>
      </div>
      <div className="hero-composition">
        <MediaFrame media={hero} className="hero-card" priority />
      </div>
    </div>

    <div className="funnel-strip" aria-label="Campaign structure">
      <StageLabel number="1" title="TOF" />
      <StageLabel number="2" title="MOF" />
      <StageLabel number="3" title="BOF" />
    </div>

    <section className="stage-composition stage-one" aria-labelledby="tof-title">
      <aside>
        <span>1</span>
        <h3 id="tof-title">TOF</h3>
      </aside>
      <MediaFrame media={tofSquare} className="span-2" />
      <MediaFrame media={tofDetail} />
      <MediaFrame media={tofPortrait} className="portrait-card" />
    </section>

    <section className="stage-composition stage-two" aria-labelledby="mof-title">
      <aside>
        <span>2</span>
        <h3 id="mof-title">MOF</h3>
      </aside>
      <MediaFrame media={mofWide} className="span-2 dark-card" />
      <MediaFrame media={mofSquare} />
      <MediaFrame media={mofPortrait} className="portrait-card" />
    </section>

    <section className="stage-composition stage-three" aria-labelledby="bof-title">
      <aside>
        <span>3</span>
        <h3 id="bof-title">BOF</h3>
      </aside>
      <MediaFrame media={bofWide} className="span-2" />
      <MediaFrame media={bofSquare} />
      <MediaFrame media={bofPortrait} className="portrait-card" />
    </section>

    <section className="motion-strip" aria-labelledby="motion-title">
      <div>
        <p className="eyebrow">Video</p>
        <h3 id="motion-title">Campaign motion</h3>
      </div>
      <div className="video-rail">
        {videos.map((video) => <figure className="video-card" key={video.src}>
          <video src={video.src} poster={video.poster} controls playsInline preload="metadata" aria-label={video.alt} />
          <figcaption>{videoTitle(video.filename, video.label)}</figcaption>
        </figure>)}
      </div>
    </section>
    <ProjectMediaRun project={project} skip={[
      hero, tofSquare, tofDetail, tofPortrait, mofWide, mofSquare, mofPortrait, bofWide, bofSquare, bofPortrait, ...videos,
    ].filter(Boolean).map((media) => mediaKey(media as PortfolioMedia))} />
  </article>
}

function About() {
  return <section className="about section" id="about">
    <p className="eyebrow">About</p>
    <div className="about-layout">
      <h2>Brand, campaign, digital, print and social work.</h2>
    </div>
  </section>
}

function Contact() {
  return <section className="contact section" id="contact">
    <p className="eyebrow">Contact</p>
    <div className="contact-layout">
      <h2>Let’s work together.</h2>
      <a href="mailto:justakatty@gmail.com">justakatty@gmail.com <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}

function App() {
  useEffect(() => {
    if (!window.location.hash) return
    const scrollToHash = () => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    }
    window.requestAnimationFrame(scrollToHash)
    const timer = window.setTimeout(scrollToHash, 350)
    return () => window.clearTimeout(timer)
  }, [])

  return <>
    <Header />
    <main>
      <Hero />
      <PortfolioExplorer />
      <About />
      <Contact />
    </main>
    <footer>
      <a className="brand footer-brand" href="#top" aria-label="Back to top"><span>KH</span><small>Designer</small></a>
      <p>© 2026 Katty Hozavsky. All rights reserved.</p>
      <a href="#top">Back to top ↑</a>
    </footer>
  </>
}

export default App
