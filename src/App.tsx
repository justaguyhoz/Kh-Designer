import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  allCategoryFilters,
  categoryFilters,
  clients,
  filterDisciplines,
  portfolioConfig,
  portfolioProjects,
  videoTitle,
  type CategoryFilter,
  type CreativeDirection,
  type PortfolioCreativeSet,
  type PortfolioDiscipline,
  type PortfolioLayoutMode,
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
  const [motionReady, setMotionReady] = useState(false)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(categoryFilters[0] ?? 'Social Ads')

  const categorySections = useMemo(() => categoryFilters
    .map((category) => {
      const discipline = filterDisciplines[category]
      if (!discipline) return undefined
      const projects = portfolioProjects
        .map((project) => filterProjectByDiscipline(project, discipline))
        .filter((project): project is PortfolioProject => Boolean(project))
      const works = projects.flatMap((project) => project.creativeSets.map((set) => ({ project, set })))
      return { category, works }
    })
    .filter((section): section is { category: CategoryFilter; works: Array<{ project: PortfolioProject; set: PortfolioCreativeSet }> } => Boolean(section?.works.length)), [])

  useEffect(() => {
    const items = document.querySelectorAll('.reveal-on-scroll')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('is-visible'))
      setMotionReady(false)
      return
    }

    setMotionReady(true)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [categorySections])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let frame = 0
    const clamp = (value: number) => Math.max(0, Math.min(1, value))
    const update = () => {
      frame = 0
      const viewportHeight = window.innerHeight || 1
      const anchor = viewportHeight * 0.42
      const paper = document.querySelector<HTMLElement>('.paper-opening')
      if (paper) {
        const rect = paper.getBoundingClientRect()
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height * 0.35))
        paper.style.setProperty('--paper-progress', progress.toFixed(3))
      }

      let current = activeCategory
      document.querySelectorAll<HTMLElement>('.category-stage').forEach((stage) => {
        const rect = stage.getBoundingClientRect()
        const range = Math.max(1, rect.height - viewportHeight)
        const progress = clamp((viewportHeight * 0.12 - rect.top) / range)
        const stepCount = Number(stage.dataset.steps ?? 1)
        const activeStep = Math.min(stepCount - 1, Math.max(0, Math.round(progress * Math.max(0, stepCount - 1))))
        stage.style.setProperty('--stage-progress', progress.toFixed(4))
        stage.style.setProperty('--track-shift', `${(progress * Math.max(0, stepCount - 1) * -100).toFixed(3)}%`)
        stage.dataset.activeStep = String(activeStep + 1)
        const counter = stage.querySelector<HTMLElement>('.stage-count span')
        if (counter) counter.textContent = String(activeStep + 1).padStart(2, '0')
        if (rect.top <= anchor && rect.bottom >= anchor) current = stage.dataset.category as CategoryFilter
      })

      setActiveCategory((value) => value === current ? value : current)
    }
    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [activeCategory, categorySections])

  return <section className={motionReady ? 'work section scroll-work motion-ready' : 'work section scroll-work'} id="work">
    <div className="scroll-experience">
      <aside className="scroll-menu" aria-label="Scroll categories">
        <p>Scroll Menu</p>
        <nav>
          {categorySections.map(({ category }) => <a
            key={category}
            className={activeCategory === category ? 'active' : undefined}
            href={`#stage-${slugLabel(category)}`}
            aria-current={activeCategory === category ? 'location' : undefined}
          ><span>{category}</span></a>)}
        </nav>
      </aside>
      <div className="experience-flow">
        <section className="paper-opening reveal-on-scroll" aria-label="Portfolio opening concept">
          <div className="folded-paper" aria-hidden="true">
            <span className="paper-plane paper-plane-one">KH</span>
            <span className="paper-plane paper-plane-two" />
            <span className="paper-plane paper-plane-three" />
            <span className="paper-plane paper-plane-four" />
          </div>
          <div>
            <p className="eyebrow">From concept to channel</p>
            <h2>Selected Work</h2>
            <p>Brand, campaign and motion work.</p>
          </div>
        </section>
        {categorySections.map(({ category, works }, index) => <CategoryStageScroll
          key={category}
          category={category}
          works={works}
          nextCategory={categorySections[index + 1]?.category}
        />)}
      </div>
    </div>
  </section>
}

function categoryStageCopy(category: CategoryFilter) {
  const copy: Record<string, { title: string; description: string }> = {
    'Social Ads': {
      title: 'Phone-first campaign moments',
      description: 'Paid social work sits inside device-led frames, giving campaign assets the context they were designed for.',
    },
    'Organic Social': {
      title: 'Organic social systems',
      description: 'Feed work is treated as a social environment rather than isolated thumbnails.',
    },
    'Magazine Ads': {
      title: 'Paper opened flat',
      description: 'Print campaigns live on a creased editorial sheet with room to move through each ad.',
    },
    Branding: {
      title: 'Brand systems and surfaces',
      description: 'Identity work stays clean and tactile, like boards laid out on a studio table.',
    },
    Video: {
      title: 'Motion on screen',
      description: 'Video work moves into a darker player space with controls kept visible and usable.',
    },
  }

  return copy[category] ?? { title: category, description: '' }
}

function CategoryStageScroll({ category, works, nextCategory }: { category: CategoryFilter; works: Array<{ project: PortfolioProject; set: PortfolioCreativeSet }>; nextCategory?: CategoryFilter }) {
  const stage = categoryStageCopy(category)
  const slug = slugLabel(category)
  const stepCount = works.length

  return <section
    id={`stage-${slug}`}
    className={`category-stage stage-${slug}`}
    aria-labelledby={`stage-${slug}-title`}
    data-category={category}
    data-steps={stepCount}
    style={{ '--steps': stepCount } as CSSProperties}
  >
    <div className="category-scroll-spacer">
      <div className="stage-sticky">
        <div className="stage-intro reveal-on-scroll">
          <p className="eyebrow">{category}</p>
          <h2 id={`stage-${slug}-title`}>{stage.title}</h2>
          <p>{stage.description}</p>
        </div>
        <div className="stage-surface">
          <div className="stage-progress" aria-hidden="true"><span /></div>
          <p className="stage-count"><span>01</span> / {String(stepCount).padStart(2, '0')}</p>
          <div className="sequence-track">
            {works.map(({ project, set }, index) => <div
              className="sequence-step"
              key={`${category}-${project.id}-${set.id}`}
              style={{ '--step-index': index } as CSSProperties}
            >
              <WorkShowcase project={project} set={set} />
            </div>)}
          </div>
        </div>
        {nextCategory && <a className="stage-next" href={`#stage-${slugLabel(nextCategory)}`}>Next: {nextCategory} &rarr;</a>}
      </div>
    </div>
  </section>
}

function CategoryStage({ category, works, nextCategory }: { category: CategoryFilter; works: Array<{ project: PortfolioProject; set: PortfolioCreativeSet }>; nextCategory?: CategoryFilter }) {
  const stage = categoryStageCopy(category)
  const slug = slugLabel(category)
  return <section id={`stage-${slug}`} className={`category-stage stage-${slug}`} aria-labelledby={`stage-${slug}-title`}>
    <div className="stage-intro reveal-on-scroll">
      <p className="eyebrow">{category}</p>
      <h2 id={`stage-${slug}-title`}>{stage.title}</h2>
      <p>{stage.description}</p>
    </div>
    <div className="stage-surface">
      <div className="portfolio-stack">
        {works.map(({ project, set }) => <WorkShowcase key={`${category}-${project.id}-${set.id}`} project={project} set={set} />)}
      </div>
      {nextCategory && <a className="stage-next" href={`#stage-${slugLabel(nextCategory)}`}>Next: {nextCategory} →</a>}
    </div>
  </section>
}

function filterFromHash(hash: string): CategoryFilter {
  const availableMatch = categoryFilters.find((category) => slugLabel(category) === hash)
  if (availableMatch) return availableMatch
  const projectMatch = allCategoryFilters.find((category) => category === 'Projects' && slugLabel(category) === hash)
  if (projectMatch && portfolioConfig.showProjectsNavigation) return projectMatch
  return categoryFilters[0] ?? 'Social Ads'
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

function filterProjectByDiscipline(project: PortfolioProject, discipline: PortfolioDiscipline): PortfolioProject | undefined {
  const creativeSets = project.creativeSets
    .map((set) => ({
      ...set,
      layoutMode: discipline === 'video' ? 'video' as const : set.layoutMode,
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

function WorkContext({ label, items, fallback }: { label?: string; items?: string[]; fallback?: CreativeDirection }) {
  const messages = items?.length ? items : fallback?.messaging
  if (!messages?.length) return null

  return <aside className="work-context" aria-label={label ?? 'Campaign message'}>
    <p>{label ?? 'Campaign message'}</p>
    <ul>{messages.map((item) => <li key={item}>{item}</li>)}</ul>
  </aside>
}

function MediaGroup({ projectId, setId, group, layoutMode = 'campaign', showTitle = false }: { projectId: string; setId: string; group: PortfolioMediaGroup; layoutMode?: PortfolioLayoutMode; showTitle?: boolean }) {
  const groupAnchor = `${projectId}-${setId}-${group.id}`
  const [expanded, setExpanded] = useState(() => typeof window !== 'undefined' && window.location.hash.slice(1) === `${groupAnchor}-expanded`)
  const initialCount = group.initialVisibleCount ?? 4
  const canExpand = group.media.length > initialCount
  const visibleMedia = expanded || !canExpand ? group.media : group.media.slice(0, initialCount)

  return <section id={groupAnchor} className={`media-group discipline-${group.discipline} layout-${layoutMode}`} aria-labelledby={`${groupAnchor}-title`}>
    {showTitle && group.title && <h4 className="group-title" id={`${groupAnchor}-title`}>{group.title}</h4>}
    <div className="media-grid">
      {visibleMedia.map((item) => <MediaFrame key={item.id} media={item} className={`outlet-${group.discipline}`} />)}
    </div>
    {canExpand && <button className="view-more" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
      {expanded ? 'View Less' : 'View More'}
    </button>}
  </section>
}

function CreativeSetSection({ projectId, set }: { projectId: string; set: PortfolioCreativeSet }) {
  const showTitle = set.title !== 'Projects'
  return <section className="creative-set" id={`${projectId}-${set.id}`} aria-labelledby={`${projectId}-${set.id}-title`}>
    <div className="creative-set-intro">
      {showTitle && <div>
        <h3 id={`${projectId}-${set.id}-title`}>{set.title}</h3>
        {set.description && <p className="set-description">{set.description}</p>}
      </div>}
      <WorkContext label={set.contextLabel} items={set.context} fallback={set.creativeDirection} />
    </div>
    <div className="set-groups">
      {set.mediaGroups.map((group) => <MediaGroup key={group.id} projectId={projectId} setId={set.id} group={group} layoutMode={set.layoutMode} showTitle />)}
    </div>
  </section>
}

function WorkShowcase({ project, set }: { project: PortfolioProject; set: PortfolioCreativeSet }) {
  const showEyebrow = project.client !== set.title
  const descriptor = set.description ?? (project.title !== set.title ? project.title : undefined)

  const layoutMode = set.layoutMode ?? 'campaign'

  return <article id={`${project.id}-${set.id}`} className={`project-showcase work-card layout-${layoutMode} reveal-on-scroll`} aria-labelledby={`${project.id}-${set.id}-title`}>
    <div className="work-card-header">
      {showEyebrow && <p className="eyebrow">{project.client}</p>}
      <h2 id={`${project.id}-${set.id}-title`}>{set.title}</h2>
      {descriptor && <p className="work-description">{descriptor}</p>}
      <WorkContext label={set.contextLabel} items={set.context} fallback={set.creativeDirection} />
    </div>
    <div className="set-groups">
      {set.mediaGroups.map((group) => <MediaGroup key={group.id} projectId={project.id} setId={set.id} group={group} layoutMode={layoutMode} />)}
    </div>
  </article>
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
      <h2>Senior Graphic Designer and Creative Marketing Manager.</h2>
      <p>I’m a Senior Graphic Designer and Creative Marketing Manager with over a decade of experience creating visually compelling campaigns across Australia and internationally. I combine design expertise with hands-on social media and digital marketing experience, leading projects from concept to execution across creative direction, content creation, video production, packaging design and major campaigns.</p>
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

function AboutExperience() {
  return <section className="about section" id="about">
    <p className="eyebrow">About</p>
    <div className="about-layout">
      <h2>Senior Graphic Designer and Creative Marketing Manager.</h2>
      <p>I'm a Senior Graphic Designer and Creative Marketing Manager with over a decade of experience creating visually compelling campaigns across Australia and internationally. I combine design expertise with hands-on social media and digital marketing experience, leading projects from concept to execution across creative direction, content creation, video production, packaging design and major campaigns.</p>
    </div>
  </section>
}

function ContactExperience() {
  return <section className="contact section" id="contact">
    <p className="eyebrow">Contact</p>
    <div className="contact-layout">
      <h2>Let's work together.</h2>
      <a href="mailto:justakatty@gmail.com">justakatty@gmail.com <span aria-hidden="true">&nearr;</span></a>
    </div>
  </section>
}

function FooterExperience() {
  return <footer>
    <a className="brand footer-brand" href="#top" aria-label="Back to top"><span>KH</span><small>Designer</small></a>
    <p>&copy; 2026 Katty Hozavsky. All rights reserved.</p>
    <a href="#top">Back to top &uarr;</a>
  </footer>
}

function App() {
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
      <AboutExperience />
      <ContactExperience />
    </main>
    <FooterExperience />
    <footer hidden>
      <a className="brand footer-brand" href="#top" aria-label="Back to top"><span>KH</span><small>Designer</small></a>
      <p>© 2026 Katty Hozavsky. All rights reserved.</p>
      <a href="#top">Back to top ↑</a>
    </footer>
  </>
}

export default App
