import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  openProject,
}: {
  openProject: (project: CinematicProject) => void
}) {
  const firstProject = cinematicProjects[0]

  return <header className="cinematic-header" aria-label="Cinematic portfolio navigation">
    <a className="brand cinematic-brand" href="/" aria-label="Katty Hozavsky cinematic portfolio"><span>KH</span><small>Designer</small></a>
    <nav aria-label="Cinematic navigation">
      <a href="#cinematic-work">Work</a>
      <button type="button" onClick={() => openProject(firstProject)}>Explore</button>
      <a href="/classic">View classic portfolio</a>
      <a href="#cinematic-about">About</a>
      <a href="#cinematic-contact">Contact</a>
    </nav>
  </header>
}

function StationMedia({ project, eager = false }: { project: CinematicProject; eager?: boolean }) {
  const featured = project.media[project.featuredMediaIndex ?? 0]
  if (!featured) return null

  if (mediaIsVideo(featured)) {
    return <video src={featured.src} muted playsInline preload="metadata" aria-label={featured.alt} />
  }

  return <img src={featured.src} alt={featured.alt} loading={eager ? 'eager' : 'lazy'} />
}

function CityScene({
  approachingProjectId,
  openProject,
}: {
  approachingProjectId: string | null
  openProject: (project: CinematicProject) => void
}) {
  const heroProject = cinematicProjects[0]
  const isApproaching = approachingProjectId === heroProject.id

  return <section className={isApproaching ? 'cinematic-scene approaching' : 'cinematic-scene'} aria-labelledby="cinematic-title">
    <div className="skyline" aria-hidden="true">
      <i className="tower tower-one" />
      <i className="tower tower-two" />
      <i className="tower tower-three" />
      <i className="tower tower-four" />
    </div>
    <div className="street-glow" aria-hidden="true" />
    <div className="architecture" aria-hidden="true">
      <i className="column column-left" />
      <i className="column column-right" />
      <i className="awning" />
    </div>
    <div className="scene-copy">
      <p>Katty Hozavsky</p>
      <h1 id="cinematic-title">Senior Designer</h1>
      <span>Selected digital work, brought into view.</span>
    </div>
    <button className="digital-station hero-station" type="button" onClick={() => openProject(heroProject)} aria-label="Open Charlii project station">
      <span className="station-kicker">Now showing</span>
      <span className="station-screen">
        <StationMedia project={heroProject} eager />
      </span>
      <span className="station-label">Open Charlii</span>
    </button>
    <div className="foreground-figures" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  </section>
}

function CategoryIndex({ activeCategory }: { activeCategory: CinematicCategoryId }) {
  return <aside className="category-index" aria-label="Cinematic category index">
    <div className="index-line" aria-hidden="true" />
    {cinematicCategories.map((category) => <a key={category.id} href={`#zone-${category.id}`} className={activeCategory === category.id ? 'active' : undefined}>
      <span>{category.label}</span>
      <small>{category.scene}</small>
    </a>)}
  </aside>
}

function ZoneStation({
  project,
  category,
  openProject,
}: {
  project: CinematicProject
  category: CinematicCategory
  openProject: (project: CinematicProject) => void
}) {
  return <button
    className={`project-station station-${project.environment}`}
    type="button"
    onClick={() => openProject(project)}
    aria-label={`Open ${project.client} ${project.title}`}
  >
    <span className="station-frame">
      <StationMedia project={project} />
    </span>
    <span className="station-meta">
      <small>{category.label}</small>
      <strong>{project.title}</strong>
      <em>{project.stationLine}</em>
    </span>
  </button>
}

function CinematicZone({
  category,
  openProject,
}: {
  category: CinematicCategory
  openProject: (project: CinematicProject) => void
}) {
  const projects = projectsByCategory(category.id)

  return <section className={`cinematic-zone zone-${category.id}`} id={`zone-${category.id}`} aria-labelledby={`${category.id}-title`}>
    <div className="zone-atmosphere" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
    <div className="zone-copy">
      <p>{category.scene}</p>
      <h2 id={`${category.id}-title`}>{category.label}</h2>
      <span>{category.summary}</span>
    </div>
    <div className="station-grid">
      {projects.map((project) => <ZoneStation key={project.id} project={project} category={category} openProject={openProject} />)}
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

function AboutContact() {
  return <section className="cinematic-about-contact" id="cinematic-about" aria-labelledby="cinematic-about-title">
    <div>
      <p>About</p>
      <h2 id="cinematic-about-title">Brand, campaign, digital, print and social work.</h2>
      <span>Senior Designer &amp; Social Media Creator.</span>
    </div>
    <div id="cinematic-contact">
      <p>Contact</p>
      <a href="mailto:justakatty@gmail.com">justakatty@gmail.com</a>
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

  const setProject = useCallback((project: CinematicProject, updateHistory = true) => {
    setActiveProjectState(project)
    setApproachingProjectId(project.id)
    if (updateHistory && window.location.pathname !== projectPath(project)) {
      window.history.pushState({ projectId: project.id }, '', projectPath(project))
    }
  }, [])

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
        setActiveProjectState(routedProject)
        setApproachingProjectId(routedProject.id)
      }
    }
    applyRoute()
    window.addEventListener('popstate', applyRoute)
    return () => window.removeEventListener('popstate', applyRoute)
  }, [])

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
    <CinematicHeader openProject={openProject} />
    <CategoryIndex activeCategory={activeCategory} />
    <CityScene approachingProjectId={approachingProjectId} openProject={openProject} />
    <div id="cinematic-work">
      {cinematicCategories.map((category) => <CinematicZone key={category.id} category={category} openProject={openProject} />)}
    </div>
    <AboutContact />
    <Footer />
    <ProjectLayer project={activeProject} closeProject={closeProject} setProject={(project) => setProject(project)} />
  </main>
}
