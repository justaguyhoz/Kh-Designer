import { useEffect, useMemo, useState } from 'react'
import {
  categoryFilters,
  portfolioProjects,
  videoTitle,
  type CreativeDirection,
  type PortfolioMedia,
  type PortfolioMediaGroup,
  type PortfolioProject,
} from './data/projects'

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
    <h1>Selected Works</h1>
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
  return ['media-frame', `media-${media.type}`, `media-${media.presentation ?? media.aspect ?? 'wide'}`, className].filter(Boolean).join(' ')
}

function MediaFrame({ media, className = '', priority = false }: { media?: PortfolioMedia; className?: string; priority?: boolean }) {
  if (!media) return null
  if (media.type === 'video') {
    return <figure className={mediaClasses(media, className)}>
      <video
        src={media.src}
        poster={media.poster}
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

function CreativeDirectionPanel({ direction }: { direction?: CreativeDirection }) {
  if (!direction) return null

  return <aside className="creative-panel" aria-label="Creative direction">
    <p className="eyebrow">Creative Direction</p>
    {direction.colors?.length && <div className="direction-block">
      <h3>Color palette</h3>
      <div className="swatches" aria-label="Project colour palette">
        {direction.colors.map((color) => <span key={color} style={{ background: color }} title={color} />)}
      </div>
    </div>}
    {direction.typography && <div className="direction-block">
      <h3>Typography</h3>
      <p>{direction.typography}</p>
    </div>}
    {direction.visualStyle && <div className="direction-block">
      <h3>Visual style</h3>
      <p>{direction.visualStyle}</p>
    </div>}
    {direction.messaging?.length && <div className="direction-block">
      <h3>Project / Messaging</h3>
      <ul>
        {direction.messaging.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>}
  </aside>
}

function MediaGroup({ projectId, group }: { projectId: string; group: PortfolioMediaGroup }) {
  const [expanded, setExpanded] = useState(false)
  const initialCount = group.initialVisibleCount ?? 4
  const canExpand = group.media.length > initialCount
  const visibleMedia = expanded || !canExpand ? group.media : group.media.slice(0, initialCount)

  return <section className={`media-group theme-${group.theme ?? 'default'}`} aria-labelledby={`${projectId}-${group.id}-title`}>
    {group.title && <h3 className="group-title" id={`${projectId}-${group.id}-title`}>{group.title}</h3>}
    <div className="media-grid">
      {visibleMedia.map((item) => <MediaFrame key={item.src} media={item} />)}
    </div>
    {canExpand && <button className="view-more" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
      {expanded ? 'View Less' : 'View More'}
    </button>}
  </section>
}

function firstHeroImage(project: PortfolioProject) {
  const firstGroupImage = project.groups.flatMap((group) => group.media).find((media) => media.type === 'image')
  return firstGroupImage ?? project.media.find((media) => media.type === 'image') ?? project.media[0]
}

function ProjectShowcase({ project, index }: { project: PortfolioProject; index: number }) {
  const hero = firstHeroImage(project)
  const tone = `tone-${index % 4}`

  return <article id={project.id} className={`project-showcase ${tone}`} aria-labelledby={`${project.id}-title`}>
    <div className="project-hero">
      <div className="project-copy">
        <p className="eyebrow">{project.client}</p>
        <h2 id={`${project.id}-title`}>{project.title}</h2>
        <CreativeDirectionPanel direction={project.creativeDirection} />
      </div>
      <div className="project-media-composition">
        <MediaFrame media={hero} className="project-primary" priority={index < 2} />
      </div>
    </div>
    <div className="project-groups">
      {project.groups.map((group) => <MediaGroup key={group.id} projectId={project.id} group={group} />)}
    </div>
  </article>
}

function StageLabel({ number, title, note }: { number: string; title: string; note: string }) {
  return <div className="stage-label">
    <span>{number}</span>
    <div>
      <strong>{title}</strong>
      <small>{note}</small>
    </div>
  </div>
}

function CharliiShowcase({ project }: { project: PortfolioProject }) {
  const hero = selectMedia(project, 'TOF_ad-2_landscape')
  const pink = project.groups.find((group) => group.id === 'pink-campaign')
  const brown = project.groups.find((group) => group.id === 'brown-campaign')

  return <article id={project.id} className="charlii-showcase" aria-labelledby="charlii-title">
    <div className="charlii-hero">
      <div className="charlii-title">
        <p className="eyebrow">Social Media Video Campaigns</p>
        <h2 id="charlii-title">{project.title}</h2>
        <p className="subtitle">Full funnel social media campaign</p>
        <CreativeDirectionPanel direction={project.creativeDirection} />
      </div>
      <div className="hero-composition">
        <MediaFrame media={hero} className="hero-card" priority />
      </div>
    </div>

    <div className="funnel-strip" aria-label="Campaign structure">
      <StageLabel number="1" title="TOF - Awareness" note="Introduce. Inspire. Build Interest." />
      <StageLabel number="2" title="MOF - Sales" note="Educate. Showcase. Drive Consideration." />
      <StageLabel number="3" title="BOF - Remarketing" note="Re-engage. Reinforce. Convert." />
    </div>

    <div className="project-groups">
      {pink && <MediaGroup projectId={project.id} group={pink} />}
      {brown && <MediaGroup projectId={project.id} group={brown} />}
    </div>
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
