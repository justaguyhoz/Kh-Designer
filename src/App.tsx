import { useEffect, useMemo, useRef, useState } from 'react'
import { projects, videoPoster, videoTitle, type Project } from './data/projects'
import type { MediaItem } from './data/mediaManifest.generated'

type DisplayMedia = MediaItem & { kind: 'image' | 'video'; poster?: string; displayTitle?: string }

const Arrow = ({ back = false }: { back?: boolean }) => <span aria-hidden="true">{back ? '←' : '→'}</span>

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="site-header">
    <a className="logo" href="#top" aria-label="Katty Hozavsky home">KH.</a>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav">{menuOpen ? 'Close' : 'Menu'}</button>
    <nav id="main-nav" className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
      {['Projects', 'About', 'Contact'].map((label) => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <div><p className="kicker">Senior Graphic Designer &amp; Social Media Creator</p><h1>I create clear, confident design built to connect.</h1></div>
    <div className="hero-bottom"><p>I work across brand, campaign, digital, social, packaging, print, EDMs and motion.</p><a className="text-link" href="#projects">Selected projects <Arrow /></a></div>
  </section>
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const cover = project.images[0]
  return <button className={`project-card card-${cover?.aspect ?? 'square'}`} onClick={onOpen} aria-label={`Open ${project.title} project`}>
    <span className="card-media">
      <img src={project.cover} width={cover?.width || undefined} height={cover?.height || undefined} alt={`${project.title} project preview`} loading="lazy" />
      {project.videos.length > 0 && <span className="motion-badge">Motion</span>}
    </span>
    <span className="card-copy"><strong>{project.title}</strong><small>{project.category}</small></span>
  </button>
}

function Projects({ onOpen }: { onOpen: (index: number) => void }) {
  return <section className="projects section" id="projects">
    <div className="section-heading"><p className="kicker">Selected projects</p><p>Brand, campaign, digital, packaging, print and social design.</p></div>
    <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} onOpen={() => onOpen(index)} />)}</div>
  </section>
}

function orderedMedia(project: Project): DisplayMedia[] {
  const images = project.images.map((image) => ({ ...image, kind: 'image' as const }))
  const videos = project.videos.map((video, index) => ({
    ...video,
    kind: 'video' as const,
    poster: videoPoster(project.id, index),
    displayTitle: videoTitle(video.filename, video.label),
  }))
  if (!videos.length) return images
  return [...images.slice(0, 2), videos[0], ...images.slice(2), ...videos.slice(1)]
}

function MediaBlock({ media, project }: { media: DisplayMedia; project: Project }) {
  if (media.kind === 'video') return <figure className="detail-media media-video">
    <video src={media.src} poster={media.poster} controls playsInline preload="metadata" aria-label={`${project.title}: ${media.displayTitle} video`} />
  </figure>
  return <figure className={`detail-media media-${media.aspect ?? 'square'}`}>
    <img src={media.src} width={media.width || undefined} height={media.height || undefined} alt={`${project.title}: ${media.label}`} loading="lazy" />
  </figure>
}

function ProjectOverlay({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (index: number) => void }) {
  const project = projects[index]
  const media = useMemo(() => orderedMedia(project), [project])
  const [showMore, setShowMore] = useState(false)
  const [showFloatingClose, setShowFloatingClose] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const visibleMedia = showMore ? media : media.slice(0, 5)
  const changeProject = (nextIndex: number) => {
    setShowMore(false)
    setShowFloatingClose(false)
    if (backdropRef.current) backdropRef.current.scrollTop = 0
    onChange(nextIndex)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') changeProject((index - 1 + projects.length) % projects.length)
      if (event.key === 'ArrowRight') changeProject((index + 1) % projects.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [index, onChange, onClose])

  return <>
    <div ref={backdropRef} className="overlay-backdrop" onScroll={(event) => setShowFloatingClose(event.currentTarget.scrollTop > 140)} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="project-overlay" role="dialog" aria-modal="true" aria-labelledby="project-title">
        <div className="overlay-toolbar"><span>KH.</span><button ref={closeRef} onClick={onClose}>Close <span aria-hidden="true">×</span></button></div>
        <header className="overlay-header"><div><p className="kicker">{project.category}</p><h2 id="project-title">{project.title}</h2></div><p>{project.description}</p></header>
        <div className="detail-gallery">{visibleMedia.map((item) => <MediaBlock key={item.src} media={item} project={project} />)}</div>
        {!showMore && media.length > 5 && <button className="show-more" onClick={() => setShowMore(true)}>Show more work <Arrow /></button>}
        <nav className="overlay-pager" aria-label="Project navigation">
          <button onClick={() => changeProject((index - 1 + projects.length) % projects.length)}><Arrow back /> Previous project</button>
          <button onClick={() => changeProject((index + 1) % projects.length)}>Next project <Arrow /></button>
        </nav>
      </article>
    </div>
    {showFloatingClose && <button className="floating-close" onClick={onClose} aria-label="Close project"><span aria-hidden="true">×</span></button>}
  </>
}

function About() {
  return <section className="about section" id="about"><p className="kicker">About</p><div className="about-layout"><h2>I turn ideas into visual systems that work.</h2><div><p>I am a senior graphic designer and social media creator working across brand identity, campaign creative, digital design, print, packaging, EDMs and motion.</p><p>I bring visual instinct and practical thinking together to make work that communicates clearly and stays consistent across formats.</p></div></div></section>
}

function Contact() {
  return <section className="contact section" id="contact"><p className="kicker">Contact</p><div className="contact-layout"><h2>Let’s work together.</h2><div><p>For freelance, contract and in-house senior design opportunities.</p><a href="mailto:justakatty@gmail.com">justakatty@gmail.com <span>↗</span></a></div></div></section>
}

function App() {
  const [selected, setSelected] = useState<number | null>(null)
  return <><Header /><main><Hero /><Projects onOpen={setSelected} /><About /><Contact /></main><footer><a className="logo" href="#top">KH.</a><p>© 2026 Katty Hozavsky. All rights reserved.</p><a href="#top">Back to top ↑</a></footer>{selected !== null && <ProjectOverlay index={selected} onClose={() => setSelected(null)} onChange={setSelected} />}</>
}

export default App
