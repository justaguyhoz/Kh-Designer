import { useMemo, useState } from 'react'
import { allVideos, projects, type Project } from './data/projects'

const Arrow = ({ back = false }: { back?: boolean }) => <span aria-hidden="true">{back ? '←' : '→'}</span>

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="site-header">
    <a className="logo" href="#top" aria-label="Katty Hozavsky home">KH.</a>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav">{menuOpen ? 'Close' : 'Menu'}</button>
    <nav id="main-nav" className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
      {[
        ['Work', '#top'], ['Projects', '#project-view'], ['Motion / Video', '#motion'], ['About', '#about'], ['Contact', '#contact'],
      ].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <p className="kicker">Senior Graphic Designer &amp; Social Media Creator</p>
    <h1>I create clear,<br/><em>confident design</em><br/>built to connect.</h1>
    <div className="hero-bottom">
      <p>I work across brand, campaign, digital, social, packaging, print, EDMs and motion.</p>
      <a className="text-link" href="#project-view">View projects <Arrow /></a>
    </div>
  </section>
}

function VideoPlayer({ src, title, poster }: { src: string; title: string; poster?: string }) {
  return <figure className="video-item">
    <video src={src} poster={poster} controls playsInline preload="metadata" aria-label={`${title} video`} />
    <figcaption>{title}</figcaption>
  </figure>
}

function ProjectDetail({ project, index, onSelect }: { project: Project; index: number; onSelect: (id: string) => void }) {
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  return <article className="project-detail" key={project.id}>
    <header className="detail-header">
      <div><p className="kicker">{project.category}</p><h2>{project.title}</h2></div>
      <p className="detail-description">{project.description}</p>
    </header>
    <div className="editorial-gallery">
      {project.images.map((image, imageIndex) => <figure className={`media-${image.aspect ?? 'square'}`} key={image.src}>
        <img src={image.src} width={image.width || undefined} height={image.height || undefined} alt={`${project.title}: ${image.label}`} loading={imageIndex < 2 ? 'eager' : 'lazy'} />
      </figure>)}
    </div>
    <nav className="project-pager" aria-label="Project navigation">
      <button onClick={() => onSelect(previous.id)}><Arrow back /> <span>Previous<br/><strong>{previous.title}</strong></span></button>
      <button onClick={() => onSelect(next.id)}><span>Next<br/><strong>{next.title}</strong></span> <Arrow /></button>
    </nav>
  </article>
}

function ProjectBrowser({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const activeIndex = Math.max(0, projects.findIndex((project) => project.id === activeId))
  const activeProject = projects[activeIndex]
  return <section className="project-browser section" id="project-view">
    <div className="project-selector-mobile">
      <label htmlFor="project-select">Project</label>
      <select id="project-select" value={activeId} onChange={(event) => onSelect(event.target.value)}>
        {projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}
      </select>
    </div>
    <aside className="project-sidebar" aria-label="Project list">
      <p className="kicker">Projects</p>
      <ol>{projects.map((project) => <li key={project.id}><button className={project.id === activeId ? 'active' : ''} onClick={() => onSelect(project.id)}>{project.title}</button></li>)}</ol>
    </aside>
    <ProjectDetail project={activeProject} index={activeIndex} onSelect={onSelect} />
  </section>
}

function Motion() {
  return <section className="motion section" id="motion">
    <div className="section-title-row">
      <div><p className="kicker">Motion and social content</p><h2>Selected video projects</h2></div>
      <p>Motion and social content created across campaign, brand and digital projects.</p>
    </div>
    <div className="motion-grid">{allVideos.map((video) => <article key={`${video.projectTitle}-${video.src}`}>
      <VideoPlayer src={video.src} title={video.displayTitle} poster={video.poster} />
      <p>{video.projectTitle}</p>
    </article>)}</div>
  </section>
}

function About() {
  return <section className="about section" id="about">
    <p className="kicker">About</p>
    <div className="about-layout">
      <h2>I turn ideas into<br/><em>visual systems</em><br/>that work.</h2>
      <div><p>I am a senior graphic designer and social media creator working across brand identity, campaign creative, digital design, print, packaging, EDMs and motion.</p><p>I bring visual instinct and practical thinking together to make work that communicates clearly, feels considered and stays consistent across formats.</p><ul><li>Brand identity</li><li>Campaign creative</li><li>Social content</li><li>Packaging</li><li>Print and EDM</li><li>Motion design</li></ul></div>
    </div>
  </section>
}

function Contact() {
  return <section className="contact section" id="contact">
    <p className="kicker">Contact</p>
    <h2>Let’s work together.</h2>
    <div className="contact-row"><p>For freelance, contract and in-house senior design opportunities.</p><a href="mailto:justakatty@gmail.com">justakatty@gmail.com <span>↗</span></a></div>
  </section>
}

function App() {
  const initialId = useMemo(() => projects[0]?.id ?? '', [])
  const [activeId, setActiveId] = useState(initialId)
  const selectProject = (id: string) => {
    setActiveId(id)
    window.history.replaceState(null, '', '#project-view')
    requestAnimationFrame(() => document.getElementById('project-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return <>
    <Header />
    <main><Hero /><ProjectBrowser activeId={activeId} onSelect={selectProject} /><Motion /><About /><Contact /></main>
    <footer><a className="logo" href="#top">KH.</a><p>© 2026 Katty Hozavsky. All rights reserved.</p><a href="#top">Back to top ↑</a></footer>
  </>
}

export default App
