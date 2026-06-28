import { useMemo, useState } from 'react'
import { allVideos, mediaAudit, projects, type Project } from './data/projects'

const Arrow = ({ back = false }: { back?: boolean }) => <span aria-hidden="true">{back ? '←' : '→'}</span>

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="site-header">
    <a className="logo" href="#top" aria-label="Katty Hozavsky home">KH.</a>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav">{menuOpen ? 'Close' : 'Menu'}</button>
    <nav id="main-nav" className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
      {[
        ['Work', '#top'], ['Projects', '#projects'], ['Motion / Video', '#motion'], ['About', '#about'], ['Contact', '#contact'],
      ].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <p className="kicker">Senior Graphic Designer &amp; Social Media Creator</p>
    <h1>I create clear,<br/><em>confident design</em><br/>built to connect.</h1>
    <div className="hero-bottom">
      <p>I work across brand, campaign, digital, social, packaging, print, EDMs and motion. This portfolio includes every supplied project asset.</p>
      <a className="circle-link" href="#projects">View all work <Arrow /></a>
    </div>
    <div className="hero-stats" aria-label="Portfolio media summary">
      <span><strong>{mediaAudit.projects}</strong> Projects</span>
      <span><strong>{mediaAudit.images}</strong> Images</span>
      <span><strong>{mediaAudit.videos}</strong> Videos</span>
    </div>
  </section>
}

function ProjectIndex({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const selectProject = (id: string) => {
    onSelect(id)
    requestAnimationFrame(() => document.getElementById('project-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return <section className="project-index section" id="projects">
    <div className="section-title-row">
      <div><p className="kicker">01 / Complete project index</p><h2>Every project.<br/>Every file.</h2></div>
      <p>Choose any project to open its complete image and video archive. Preview cards use one consistent format; project galleries keep the original proportions.</p>
    </div>
    <div className="card-grid">
      {projects.map((project, index) => <button className={project.id === activeId ? 'index-card active' : 'index-card'} key={project.id} onClick={() => selectProject(project.id)}>
        <span className="card-image"><img src={project.cover} alt={`${project.title} project preview`} loading="lazy" /></span>
        <span className="card-info"><span><strong>{project.title}</strong><small>{project.category}</small></span><span>{String(index + 1).padStart(2, '0')}</span></span>
      </button>)}
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
      <div><p className="kicker">Project {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p><h2>{project.title}</h2></div>
      <div className="detail-summary"><p className="detail-category">{project.category}</p><p>{project.description}</p><p className="media-count">{project.images.length} images{project.videos.length ? ` + ${project.videos.length} videos` : ''}</p></div>
    </header>
    {project.images.length > 0 && <div className="editorial-gallery">
      {project.images.map((image, imageIndex) => <figure key={image.src}>
        <img src={image.src} alt={`${project.title}: ${image.label}`} loading={imageIndex < 2 ? 'eager' : 'lazy'} />
        <figcaption>{image.label}</figcaption>
      </figure>)}
    </div>}
    {project.videos.length > 0 && <section className="project-motion" aria-labelledby={`${project.id}-motion`}>
      <h3 id={`${project.id}-motion`}>Motion</h3>
      <div className="project-video-grid">{project.videos.map((video) => <VideoPlayer key={video.src} src={video.src} title={video.label} poster={project.cover} />)}</div>
    </section>}
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
      <label htmlFor="project-select">Current project</label>
      <select id="project-select" value={activeId} onChange={(event) => onSelect(event.target.value)}>
        {projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}
      </select>
    </div>
    <aside className="project-sidebar" aria-label="Project list">
      <p className="kicker">Project list</p>
      <ol>{projects.map((project, index) => <li key={project.id}><button className={project.id === activeId ? 'active' : ''} onClick={() => onSelect(project.id)}><span>{String(index + 1).padStart(2, '0')}</span>{project.title}</button></li>)}</ol>
    </aside>
    <ProjectDetail project={activeProject} index={activeIndex} onSelect={onSelect} />
  </section>
}

function Motion() {
  return <section className="motion section" id="motion">
    <div className="section-title-row inverse">
      <div><p className="kicker">02 / Motion and video</p><h2>All motion,<br/>in one place.</h2></div>
      <p>Every supplied video is available here and inside its related project. Each player preserves the original aspect ratio and includes sound controls.</p>
    </div>
    <div className="motion-grid">{allVideos.map((video) => <article key={`${video.projectTitle}-${video.src}`}>
      <VideoPlayer src={video.src} title={video.label} poster={video.poster} />
      <p>{video.projectTitle}</p>
    </article>)}</div>
  </section>
}

function About() {
  return <section className="about section" id="about">
    <p className="kicker">03 / About</p>
    <div className="about-layout">
      <h2>I turn ideas into<br/><em>visual systems</em><br/>that work.</h2>
      <div><p>I am a senior graphic designer and social media creator working across brand identity, campaign creative, digital design, print, packaging, EDMs and motion.</p><p>I bring visual instinct and practical thinking together to make work that communicates clearly, feels considered and stays consistent across formats.</p><ul><li>Brand identity</li><li>Campaign creative</li><li>Social content</li><li>Packaging</li><li>Print and EDM</li><li>Motion design</li></ul></div>
    </div>
  </section>
}

function Contact() {
  return <section className="contact section" id="contact">
    <p className="kicker">04 / Contact</p>
    <h2>Let’s make<br/>something <em>strong.</em></h2>
    <div className="contact-row"><p>I am open to freelance, contract and in-house senior design opportunities.</p><a href="mailto:justakatty@gmail.com">justakatty@gmail.com <span>↗</span></a></div>
  </section>
}

function App() {
  const initialId = useMemo(() => projects[0]?.id ?? '', [])
  const [activeId, setActiveId] = useState(initialId)
  const selectProject = (id: string) => {
    setActiveId(id)
    window.history.replaceState(null, '', `#project-view`)
    requestAnimationFrame(() => document.getElementById('project-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return <>
    <Header />
    <main><Hero /><ProjectIndex activeId={activeId} onSelect={selectProject} /><ProjectBrowser activeId={activeId} onSelect={selectProject} /><Motion /><About /><Contact /></main>
    <footer><a className="logo" href="#top">KH.</a><p>© 2026 Katty Hozavsky. All rights reserved.</p><a href="#top">Back to top ↑</a></footer>
  </>
}

export default App
