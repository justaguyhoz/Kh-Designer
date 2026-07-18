import { useEffect, useMemo, useState } from 'react'
import {
  categoryFilters,
  clients,
  filterDisciplines,
  portfolioProjects,
  videoTitle,
  type CreativeDirection,
  type PortfolioCreativeSet,
  type PortfolioDiscipline,
  type PortfolioMedia,
  type PortfolioMediaGroup,
  type PortfolioProject,
} from './data/projects'
import { CinematicPrototype } from './cinematic/CinematicPrototype'

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
  const initialHash = typeof window === 'undefined' ? '' : window.location.hash.slice(1)
  const initialFilter = filterFromHash(initialHash)
  const initialClient = portfolioProjects.find((project) => project.id === initialHash)?.client ?? 'Charlii'
  const [activeFilter, setActiveFilter] = useState<(typeof categoryFilters)[number]>(initialFilter)
  const [selectedClient, setSelectedClient] = useState(initialClient)
  const [selectorOpen, setSelectorOpen] = useState(initialFilter === 'Projects' && initialClient === 'Charlii')

  const selectedProject = portfolioProjects.find((project) => project.client === selectedClient) ?? portfolioProjects[0]
  const activeDiscipline = filterDisciplines[activeFilter]

  const filteredProjects = useMemo(() => {
    if (!activeDiscipline) return selectedProject ? [selectedProject] : []
    return portfolioProjects
      .map((project) => filterProjectByDiscipline(project, activeDiscipline))
      .filter((project): project is PortfolioProject => Boolean(project))
  }, [activeDiscipline, selectedProject])

  return <section className="work section" id="work">
    <nav className="portfolio-nav" aria-label="Portfolio categories">
      {categoryFilters.map((category) => <CategoryButton
        key={category}
        active={activeFilter === category}
        onClick={() => {
          setActiveFilter(category)
          setSelectorOpen(category === 'Projects')
        }}
      >{category}</CategoryButton>)}
    </nav>

    {activeFilter === 'Projects' && <ClientSelector
      open={selectorOpen}
      selectedClient={selectedClient}
      onToggle={() => setSelectorOpen((value) => !value)}
      onSelect={(client) => {
        setSelectedClient(client)
        setSelectorOpen(false)
      }}
    />}

    <div className="portfolio-stack">
      {filteredProjects.map((project) => <ProjectShowcase key={`${activeFilter}-${project.id}`} project={project} mode={activeFilter === 'Projects' ? 'project' : 'category'} />)}
    </div>
  </section>
}

function filterFromHash(hash: string): (typeof categoryFilters)[number] {
  const match = categoryFilters.find((category) => slugLabel(category) === hash)
  return match ?? 'Projects'
}

function slugLabel(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ClientSelector({ open, selectedClient, onToggle, onSelect }: { open: boolean; selectedClient: string; onToggle: () => void; onSelect: (client: string) => void }) {
  return <div className={open ? 'client-selector open' : 'client-selector'}>
    <button className="client-selector-toggle" type="button" onClick={onToggle} aria-expanded={open}>
      <span>Projects</span>
      <strong>{selectedClient}</strong>
    </button>
    {open && <div className="client-index" role="listbox" aria-label="Client projects">
      {clients.map((client) => <button
        key={client}
        type="button"
        className={client === selectedClient ? 'client-index-item active' : 'client-index-item'}
        onClick={() => onSelect(client)}
        aria-selected={client === selectedClient}
      >{client}</button>)}
    </div>}
  </div>
}

function filterProjectByDiscipline(project: PortfolioProject, discipline: PortfolioDiscipline) {
  const creativeSets = project.creativeSets
    .map((set) => ({
      ...set,
      disciplines: set.disciplines.filter((item) => item === discipline),
      mediaGroups: set.mediaGroups.filter((group) => group.discipline === discipline),
    }))
    .filter((set) => set.mediaGroups.length)

  if (!creativeSets.length) return undefined
  return { ...project, creativeSets }
}

function mediaClasses(media: PortfolioMedia, className: string) {
  return ['media-frame', `media-${media.type}`, `media-${media.presentation ?? media.aspect ?? 'wide'}`, className].filter(Boolean).join(' ')
}

function MediaFrame({ media, className = '' }: { media: PortfolioMedia; className?: string }) {
  if (media.type === 'video') {
    return <figure className={mediaClasses(media, className)}>
      <video src={media.src} poster={media.poster} controls playsInline preload="metadata" aria-label={media.alt} />
      <figcaption>{media.caption ?? videoTitle(media.filename, media.label)}</figcaption>
    </figure>
  }

  return <figure className={mediaClasses(media, className)}>
    <img src={media.src} width={media.width} height={media.height} alt={media.alt} loading="lazy" />
    {media.caption && <figcaption>{media.caption}</figcaption>}
  </figure>
}

function CreativeDirectionPanel({ direction }: { direction?: CreativeDirection }) {
  if (!direction) return null
  const hasContent = direction.colors?.length || direction.typography || direction.visualStyle || direction.messaging?.length
  if (!hasContent) return null

  return <aside className="creative-panel" aria-label="Creative direction">
    <p className="eyebrow">Creative Direction</p>
    {direction.colors?.length && <div className="direction-block">
      <h4>Color palette</h4>
      <div className="swatches" aria-label="Project colour palette">
        {direction.colors.map((color) => <span key={color} style={{ background: color }} title={color} />)}
      </div>
    </div>}
    {direction.typography && <div className="direction-block">
      <h4>Typography</h4>
      <p>{direction.typography}</p>
    </div>}
    {direction.visualStyle && <div className="direction-block">
      <h4>Visual style</h4>
      <p>{direction.visualStyle}</p>
    </div>}
    {direction.messaging?.length && <div className="direction-block">
      <h4>Project / Messaging</h4>
      <ul>{direction.messaging.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>}
  </aside>
}

function MediaGroup({ projectId, setId, group }: { projectId: string; setId: string; group: PortfolioMediaGroup }) {
  const groupAnchor = `${projectId}-${setId}-${group.id}`
  const [expanded, setExpanded] = useState(() => typeof window !== 'undefined' && window.location.hash.slice(1) === `${groupAnchor}-expanded`)
  const initialCount = group.initialVisibleCount ?? 4
  const canExpand = group.media.length > initialCount
  const visibleMedia = expanded || !canExpand ? group.media : group.media.slice(0, initialCount)

  return <section id={groupAnchor} className={`media-group discipline-${group.discipline}`} aria-labelledby={`${groupAnchor}-title`}>
    {group.title && <h4 className="group-title" id={`${groupAnchor}-title`}>{group.title}</h4>}
    <div className="media-grid">
      {visibleMedia.map((item) => <MediaFrame key={item.id} media={item} />)}
    </div>
    {canExpand && <button className="view-more" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
      {expanded ? 'View Less' : 'View More'}
    </button>}
  </section>
}

function CreativeSetSection({ projectId, set }: { projectId: string; set: PortfolioCreativeSet }) {
  return <section className="creative-set" id={`${projectId}-${set.id}`} aria-labelledby={`${projectId}-${set.id}-title`}>
    <div className="creative-set-intro">
      <h3 id={`${projectId}-${set.id}-title`}>{set.title}</h3>
      <CreativeDirectionPanel direction={set.creativeDirection} />
    </div>
    <div className="set-groups">
      {set.mediaGroups.map((group) => <MediaGroup key={group.id} projectId={projectId} setId={set.id} group={group} />)}
    </div>
  </section>
}

function ProjectShowcase({ project, mode }: { project: PortfolioProject; mode: 'project' | 'category' }) {
  return <article id={project.id} className={`project-showcase mode-${mode}`} aria-labelledby={`${project.id}-title`}>
    <div className="project-intro">
      <p className="eyebrow">{project.client}</p>
      <h2 id={`${project.id}-title`}>{project.title}</h2>
      {project.introduction && <p className="project-introduction">{project.introduction}</p>}
    </div>
    <div className="creative-sets">
      {project.creativeSets.map((set) => <CreativeSetSection key={set.id} projectId={project.id} set={set} />)}
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

function ClassicPortfolio() {
  useEffect(() => {
    if (!window.location.hash) return
    const scrollToHash = () => document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
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

function App() {
  if (window.location.pathname === '/classic') return <ClassicPortfolio />
  return <CinematicPrototype />
}

export default App
