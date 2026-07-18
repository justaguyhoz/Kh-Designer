import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  cinematicCategories,
  cinematicProjects,
  findProject,
  projectsByCategory,
  type CinematicCategory,
  type CinematicCategoryId,
  type CinematicMedia,
  type CinematicProject,
} from './cinematicProjects'
import './cinematic.css'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function projectPath(project: CinematicProject) {
  return `/project/${project.id}`
}

function mediaIsVideo(media: CinematicMedia) {
  return media.type === 'video'
}

function CinematicHeader({
  openIndex,
  exploreActiveCategory,
  focusAbout,
}: {
  openIndex: () => void
  exploreActiveCategory: () => void
  focusAbout: () => void
}) {
  return <header className="cinematic-header" aria-label="Cinematic portfolio navigation">
    <a className="brand cinematic-brand" href="/" aria-label="Katty Hozavsky cinematic portfolio"><span>KH</span><small>Designer</small></a>
    <nav aria-label="Cinematic navigation">
      <button type="button" onClick={openIndex}>Work</button>
      <button type="button" onClick={exploreActiveCategory}>Explore</button>
      <button type="button" onClick={focusAbout}>About</button>
      <a href="#cinematic-contact">Contact</a>
    </nav>
  </header>
}

function StationMedia({ project, eager = false, active = true }: { project: CinematicProject; eager?: boolean; active?: boolean }) {
  const featured = project.media[project.featuredMediaIndex ?? 0]
  if (!featured) return null

  if (mediaIsVideo(featured)) {
    return <video src={featured.src} muted playsInline preload="metadata" aria-label={featured.alt} />
  }

  return <img src={featured.src} alt={featured.alt} loading={eager && active ? 'eager' : 'lazy'} fetchPriority={eager && active ? 'high' : 'auto'} />
}

function CategoryIndex({ activeCategory }: { activeCategory: CinematicCategoryId }) {
  return <aside className="category-index" aria-label="Cinematic category index and information">
    <nav aria-label="Portfolio categories">
      <div className="index-line" aria-hidden="true" />
      {cinematicCategories.map((category) => <a key={category.id} href={`#zone-${category.id}`} className={activeCategory === category.id ? 'active' : undefined}>
        <span>{category.label}</span>
      </a>)}
    </nav>
    <div className="rail-info" id="cinematic-about">
      <p>About</p>
      <strong>Katty Hozavsky</strong>
      <span>Senior Designer &amp; Social Media Creator</span>
      <em>I’m a Senior Graphic Designer and Creative Marketing Manager with over a decade of experience crafting visually compelling campaigns across Australia and internationally. I combine strong design expertise with hands-on social media and digital marketing experience, leading projects from concept to execution that drive engagement and results. At Powertec Telecommunications and Outback Marine, I oversee creative direction, content creation, video production, packaging design, and major campaigns, connecting creativity with business goals. I’m passionate about turning ideas into impactful visuals and strategies that resonate with audiences.</em>
    </div>
    <div className="rail-info" id="cinematic-contact">
      <p>Contact</p>
      <a href="mailto:justakatty@gmail.com">justakatty@gmail.com</a>
    </div>
  </aside>
}

function FeaturedProjectControls({
  activeIndex,
  total,
  previousProject,
  nextProject,
}: {
  activeIndex: number
  total: number
  previousProject: () => void
  nextProject: () => void
}) {
  return <div className="featured-controls" aria-label="Featured project controls">
    <button type="button" onClick={previousProject} aria-label="Previous featured project">←</button>
    <span>{String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    <button type="button" onClick={nextProject} aria-label="Next featured project">→</button>
  </div>
}

function FeaturedProjectDisplay({
  project,
  openProject,
  approachingProjectId,
  activeIndex,
  total,
  previousProject,
  nextProject,
  onPointerMove,
}: {
  project: CinematicProject
  openProject: (project: CinematicProject) => void
  approachingProjectId: string | null
  activeIndex: number
  total: number
  previousProject: () => void
  nextProject: () => void
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
}) {
  return <div className={`featured-project station-${project.environment}${approachingProjectId === project.id ? ' approaching' : ''}`} onPointerMove={onPointerMove}>
    <button className="featured-screen" type="button" onClick={() => openProject(project)} aria-label={`Open ${project.client} ${project.title}`}>
      <span className="station-kicker">Now Showing</span>
      <span className="station-screen">
        <StationMedia project={project} eager={activeIndex === 0} />
      </span>
      <span className="station-label">View Project</span>
    </button>
    <div className="featured-caption">
      <p>{project.client}</p>
      <h3>{project.title}</h3>
      <span>{project.descriptor}</span>
    </div>
    <FeaturedProjectControls activeIndex={activeIndex} total={total} previousProject={previousProject} nextProject={nextProject} />
  </div>
}

function CinematicZone({
  category,
  openProject,
  approachingProjectId,
  activeIndex,
  setActiveIndex,
}: {
  category: CinematicCategory
  openProject: (project: CinematicProject) => void
  approachingProjectId: string | null
  activeIndex: number
  setActiveIndex: (index: number) => void
}) {
  const projects = projectsByCategory(category.id)
  const touchStartX = useRef<number | null>(null)
  const activeProject = projects[activeIndex] ?? projects[0]

  const previousProject = useCallback(() => {
    setActiveIndex(activeIndex === 0 ? projects.length - 1 : activeIndex - 1)
  }, [activeIndex, projects.length, setActiveIndex])

  const nextProject = useCallback(() => {
    setActiveIndex((activeIndex + 1) % projects.length)
  }, [activeIndex, projects.length, setActiveIndex])

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    event.currentTarget.style.setProperty('--pointer-x', `${x}`)
    event.currentTarget.style.setProperty('--pointer-y', `${y}`)
  }, [])

  return <section className={`cinematic-zone zone-${category.id}`} id={`zone-${category.id}`} aria-labelledby={`${category.id}-title`}>
    <div className="zone-atmosphere" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
    <div className="zone-copy">
      <h2 id={`${category.id}-title`}>{category.label}</h2>
    </div>
    <div
      className="featured-wrap"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') previousProject()
        if (event.key === 'ArrowRight') nextProject()
        if (event.key === 'Enter' && activeProject) openProject(activeProject)
      }}
      onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const delta = event.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(delta) < 42) return
        if (delta > 0) previousProject()
        if (delta < 0) nextProject()
      }}
      aria-label={`${category.label} featured project`}
    >
      {activeProject ? <FeaturedProjectDisplay
        key={activeProject.id}
        project={activeProject}
        openProject={openProject}
        approachingProjectId={approachingProjectId}
        activeIndex={activeIndex}
        total={projects.length}
        previousProject={previousProject}
        nextProject={nextProject}
        onPointerMove={onPointerMove}
      /> : null}
    </div>
  </section>
}

function WorkIndex({
  open,
  close,
  selectProject,
}: {
  open: boolean
  close: () => void
  selectProject: (project: CinematicProject) => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, open])

  return <section className={open ? 'work-index open' : 'work-index'} aria-hidden={!open} aria-labelledby="work-index-title">
    <div className="work-index-panel" role="dialog" aria-modal="true" aria-label="Project index">
      <div className="work-index-top">
        <p className="eyebrow">Work</p>
        <button type="button" onClick={close} aria-label="Close work index">Close</button>
      </div>
      <h2 id="work-index-title">Select Work</h2>
      <div className="work-index-grid">
        {cinematicCategories.map((category) => <div className="work-index-category" key={category.id}>
          <a href={`#zone-${category.id}`} onClick={close}>{category.label}</a>
          <div>
            {projectsByCategory(category.id).map((project) => <button key={project.id} type="button" onClick={() => {
              close()
              selectProject(project)
            }}>
              <span>{project.client}</span>
              <strong>{project.title}</strong>
            </button>)}
          </div>
        </div>)}
      </div>
    </div>
  </section>
}

function Palette({ colors }: { colors?: string[] }) {
  if (!colors?.length) return null
  return <dd className="cinematic-swatches" aria-label="Selected palette">
    {colors.slice(0, 4).map((color) => <i key={color} style={{ background: color }} />)}
  </dd>
}

function ProjectDetails({ project, mediaIndex }: { project: CinematicProject; mediaIndex: number }) {
  return <div className="project-summary">
    <p className="eyebrow">{project.client}</p>
    <h2 id="cinematic-layer-title">{project.title}</h2>
    <p>{project.descriptor}</p>
    <dl>
      <div>
        <dt>Client</dt>
        <dd>{project.client}</dd>
      </div>
      {project.fields.map((field) => <div key={`${field.label}-${field.value}`}>
        <dt>{field.label}</dt>
        <dd>{field.value}</dd>
      </div>)}
      {project.palette?.length ? <div>
        <dt>Selected palette</dt>
        <Palette colors={project.palette} />
      </div> : null}
      <div>
        <dt>Gallery</dt>
        <dd>{mediaIndex + 1} / {project.media.length}</dd>
      </div>
    </dl>
  </div>
}

function ProjectMedia({
  project,
  mediaIndex,
  setMediaIndex,
}: {
  project: CinematicProject
  mediaIndex: number
  setMediaIndex: (index: number | ((current: number) => number)) => void
}) {
  const media = project.media[mediaIndex]
  const touchStartX = useRef<number | null>(null)

  const previousMedia = () => setMediaIndex((index) => Math.max(0, index - 1))
  const nextMedia = () => setMediaIndex((index) => Math.min(project.media.length - 1, index + 1))

  useEffect(() => {
    const videos = document.querySelectorAll<HTMLVideoElement>('.project-layer video')
    videos.forEach((video) => {
      video.pause()
      video.currentTime = 0
    })
  }, [project.id, mediaIndex])

  return <div
    className={`project-media-stage media-${media.type}`}
    onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }}
    onTouchEnd={(event) => {
      if (touchStartX.current === null) return
      const delta = event.changedTouches[0].clientX - touchStartX.current
      touchStartX.current = null
      if (Math.abs(delta) < 42) return
      if (delta < 0) nextMedia()
      if (delta > 0) previousMedia()
    }}
  >
    {project.media.length > 1 ? <button className="media-arrow media-prev" type="button" onClick={previousMedia} disabled={mediaIndex === 0} aria-label="Previous media">‹</button> : null}
    {mediaIsVideo(media)
      ? <video src={media.src} controls playsInline preload="metadata" aria-label={media.alt} />
      : <img src={media.src} alt={media.alt} loading="lazy" />}
    {project.media.length > 1 ? <button className="media-arrow media-next" type="button" onClick={nextMedia} disabled={mediaIndex === project.media.length - 1} aria-label="Next media">›</button> : null}
    <span className="media-counter">{mediaIndex + 1} / {project.media.length}</span>
  </div>
}

function ProjectLayer({
  project,
  closeProject,
  setProject,
}: {
  project: CinematicProject | null
  closeProject: () => void
  setProject: (project: CinematicProject) => void
}) {
  const [mediaIndex, setMediaIndex] = useState(0)
  const open = Boolean(project)

  const projectIndex = useMemo(() => project ? cinematicProjects.findIndex((item) => item.id === project.id) : -1, [project])
  const previousProject = projectIndex > 0 ? cinematicProjects[projectIndex - 1] : null
  const nextProject = projectIndex >= 0 && projectIndex < cinematicProjects.length - 1 ? cinematicProjects[projectIndex + 1] : null

  useEffect(() => {
    setMediaIndex(0)
  }, [project?.id])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProject()
      if (event.key === 'ArrowRight') setMediaIndex((index) => Math.min((project?.media.length ?? 1) - 1, index + 1))
      if (event.key === 'ArrowLeft') setMediaIndex((index) => Math.max(0, index - 1))
      if (event.key === 'ArrowUp' && previousProject) setProject(previousProject)
      if (event.key === 'ArrowDown' && nextProject) setProject(nextProject)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeProject, nextProject, open, previousProject, project?.media.length, setProject])

  if (!project) return <section className="project-layer" aria-hidden="true" />

  return <section className="project-layer open" aria-labelledby="cinematic-layer-title">
    <div className="project-panel" role="dialog" aria-modal="true" aria-label={`${project.client} ${project.title} project preview`}>
      <div className="project-topbar">
        <button className="project-close" type="button" onClick={closeProject} aria-label="Close project">Close</button>
        <div className="project-neighbours" aria-label="Project navigation">
          <button type="button" onClick={() => previousProject && setProject(previousProject)} disabled={!previousProject} aria-label="Previous project">Previous project</button>
          <span>{projectIndex + 1} / {cinematicProjects.length}</span>
          <button type="button" onClick={() => nextProject && setProject(nextProject)} disabled={!nextProject} aria-label="Next project">Next project</button>
        </div>
      </div>
      <ProjectDetails project={project} mediaIndex={mediaIndex} />
      <ProjectMedia project={project} mediaIndex={mediaIndex} setMediaIndex={setMediaIndex} />
    </div>
  </section>
}

function Footer() {
  return <footer className="cinematic-footer">
    <a className="brand cinematic-brand" href="#top" aria-label="Back to top"><span>KH</span><small>Designer</small></a>
    <p>© 2026 Katty Hozavsky. All rights reserved.</p>
    <a href="#top">Back to top ↑</a>
  </footer>
}

export function CinematicPrototype() {
  const [activeProject, setActiveProjectState] = useState<CinematicProject | null>(null)
  const [approachingProjectId, setApproachingProjectId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<CinematicCategoryId>('social-ads')
  const [indexOpen, setIndexOpen] = useState(false)
  const [categoryIndexes, setCategoryIndexes] = useState<Record<CinematicCategoryId, number>>({
    'social-ads': 0,
    'organic-social': 0,
    'magazine-ads': 0,
    branding: 0,
    video: 0,
  })

  const selectFeaturedProject = useCallback((project: CinematicProject, shouldScroll = true) => {
    const categoryProjects = projectsByCategory(project.category)
    const nextIndex = Math.max(0, categoryProjects.findIndex((item) => item.id === project.id))
    setCategoryIndexes((current) => ({ ...current, [project.category]: nextIndex }))
    setActiveCategory(project.category)
    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        document.getElementById(`zone-${project.category}`)?.scrollIntoView({ block: 'start' })
      })
    }
  }, [])

  const setProject = useCallback((project: CinematicProject, updateHistory = true) => {
    selectFeaturedProject(project, false)
    setActiveProjectState(project)
    setApproachingProjectId(project.id)
    if (updateHistory && window.location.pathname !== projectPath(project)) {
      window.history.pushState({ projectId: project.id }, '', projectPath(project))
    }
  }, [selectFeaturedProject])

  const openProject = useCallback((project: CinematicProject) => {
    const reduceMotion = window.matchMedia(reducedMotionQuery).matches
    setApproachingProjectId(project.id)
    window.setTimeout(() => setProject(project), reduceMotion ? 0 : 380)
  }, [setProject])

  const closeProject = useCallback(() => {
    setActiveProjectState(null)
    window.setTimeout(() => setApproachingProjectId(null), window.matchMedia(reducedMotionQuery).matches ? 0 : 220)
    if (window.location.pathname.startsWith('/project/')) {
      window.history.pushState({}, '', '/')
    }
  }, [])

  useEffect(() => {
    const applyRoute = () => {
      const match = window.location.pathname.match(/^\/project\/([^/]+)/)
      if (!match) {
        setActiveProjectState(null)
        setApproachingProjectId(null)
        return
      }
      const routedProject = findProject(match[1])
      if (routedProject) {
        selectFeaturedProject(routedProject, false)
        setActiveProjectState(routedProject)
        setApproachingProjectId(routedProject.id)
      }
    }
    applyRoute()
    window.addEventListener('popstate', applyRoute)
    return () => window.removeEventListener('popstate', applyRoute)
  }, [selectFeaturedProject])

  useEffect(() => {
    const observers = cinematicCategories.map((category) => {
      const element = document.getElementById(`zone-${category.id}`)
      if (!element) return null
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveCategory(category.id)
      }, { rootMargin: '-35% 0px -45% 0px', threshold: 0.01 })
      observer.observe(element)
      return observer
    })
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [])

  return <main className={activeProject ? 'cinematic-root project-is-open' : 'cinematic-root'} id="top">
    <CinematicHeader
      openIndex={() => setIndexOpen(true)}
      exploreActiveCategory={() => document.getElementById(`zone-${activeCategory}`)?.scrollIntoView({ block: 'start' })}
      focusAbout={() => document.getElementById('cinematic-about')?.scrollIntoView({ block: 'center' })}
    />
    <CategoryIndex activeCategory={activeCategory} />
    <div id="cinematic-work">
      {cinematicCategories.map((category) => <CinematicZone
        key={category.id}
        category={category}
        openProject={openProject}
        approachingProjectId={approachingProjectId}
        activeIndex={categoryIndexes[category.id]}
        setActiveIndex={(index) => setCategoryIndexes((current) => ({ ...current, [category.id]: index }))}
      />)}
    </div>
    <Footer />
    <ProjectLayer project={activeProject} closeProject={closeProject} setProject={(project) => setProject(project)} />
    <WorkIndex open={indexOpen} close={() => setIndexOpen(false)} selectProject={(project) => selectFeaturedProject(project)} />
  </main>
}
