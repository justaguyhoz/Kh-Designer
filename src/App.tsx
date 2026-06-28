import { useEffect, useRef, useState } from 'react'
import { projects, videoProjects, type Project } from './data/projects'

const Arrow = ({ direction = 'right' }: { direction?: 'left' | 'right' }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={direction === 'left' ? 'flip' : ''}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header">
    <a className="wordmark" href="#top" aria-label="Katty Hozavsky, home">KH<span>.</span></a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="navigation">{open ? 'Close' : 'Menu'}</button>
    <nav id="navigation" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {['Work', 'Video', 'About', 'Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>)}
    </nav>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-copy reveal">
      <p className="eyebrow">Independent creative · Brisbane, Australia</p>
      <h1>Visual ideas,<br/><em>made to move.</em></h1>
      <p className="hero-intro">Katty Hozavsky is a Senior Graphic Designer &amp; Social Media Creator shaping brands, campaigns and digital stories.</p>
      <div className="hero-actions">
        <a className="button dark" href="#work">View selected work <Arrow /></a>
        <a className="text-link" href="mailto:justakatty@gmail.com">Contact Katty <span>↗</span></a>
      </div>
    </div>
    <div className="hero-art reveal" aria-label="A selection of Katty's design work">
      <div className="hero-card card-a"><img src="/projects/UN/United Nations_Covid19 Campaign.jpg" alt="United Nations Covid-19 campaign artwork" /></div>
      <div className="hero-card card-b"><img src="/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-1_long.jpg" alt="Charlii hair rollers social campaign" /></div>
      <div className="hero-card card-c"><img src="/projects/Spinal life/TOF_back2work/26016 Back2Work_v3_square.jpg" alt="Spinal Life campaign artwork" /></div>
      <span className="orbit orbit-one" /><span className="orbit orbit-two" />
    </div>
    <a className="scroll-note" href="#work">Scroll to explore <span>↓</span></a>
  </section>
}

function ProjectCard({ project, index, onOpen }: { project: Project, index: number, onOpen: () => void }) {
  return <button className={`project-card project-${(index % 4) + 1}`} onClick={onOpen} aria-label={`View ${project.title} project`}>
    <span className="project-image">
      <img src={project.images[0]} alt={`${project.title} — ${project.category}`} loading="lazy" />
      <span className="view-mark">View project <Arrow /></span>
    </span>
    <span className="project-meta">
      <span><strong>{project.title}</strong><small>{project.category}</small></span>
      <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
    </span>
  </button>
}

function ProjectGrid({ onOpen }: { onOpen: (index: number) => void }) {
  return <section className="section work" id="work">
    <div className="section-heading">
      <div><p className="eyebrow">01 / Selected work</p><h2>Ideas with<br/><em>staying power.</em></h2></div>
      <p>A considered selection of brand, campaign, packaging and digital work—each built for its own audience and moment.</p>
    </div>
    <div className="project-grid">
      {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => onOpen(index)} />)}
    </div>
  </section>
}

function ProjectModal({ index, onClose, onChange }: { index: number, onClose: () => void, onChange: (index: number) => void }) {
  const project = projects[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onChange((index + 1) % projects.length)
      if (event.key === 'ArrowLeft') onChange((index - 1 + projects.length) % projects.length)
    }
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', key) }
  }, [index, onChange, onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-top">
        <span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <button ref={closeRef} className="close" onClick={onClose}>Close <span>×</span></button>
      </div>
      <div className="modal-intro">
        <div><p className="eyebrow">{project.category}</p><h2 id="modal-title">{project.title}</h2></div>
        <div><p>{project.description}</p><ul>{project.tags?.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
      </div>
      <div className="modal-gallery">
        {project.images.map((image, imageIndex) => <img key={image} src={image} alt={`${project.title} project image ${imageIndex + 1}`} loading={imageIndex ? 'lazy' : 'eager'} />)}
      </div>
      <div className="modal-nav">
        <button onClick={() => onChange((index - 1 + projects.length) % projects.length)}><Arrow direction="left" /> Previous</button>
        <button onClick={() => onChange((index + 1) % projects.length)}>Next project <Arrow /></button>
      </div>
    </section>
  </div>
}

function VideoSection() {
  return <section className="section video-section" id="video">
    <div className="section-heading light-heading">
      <div><p className="eyebrow">02 / In motion</p><h2>Stories that<br/><em>don’t sit still.</em></h2></div>
      <p>Short-form campaign creative designed for attention, clarity and the rhythm of the scroll.</p>
    </div>
    <div className="video-grid">
      {videoProjects.map((video, index) => <article className="video-card" key={video.src}>
        <div className="video-frame">
          <video src={video.src} poster={video.poster} muted loop playsInline autoPlay preload={index < 2 ? 'metadata' : 'none'} aria-label={`${video.title} video`} />
          <span className="sound-note">Muted · Loop</span>
        </div>
        <div><h3>{video.title}</h3><p>{video.category}</p></div>
      </article>)}
    </div>
  </section>
}

function About() {
  return <section className="section about" id="about">
    <p className="eyebrow">03 / About</p>
    <div className="about-grid">
      <h2>Design with clarity.<br/>Creative with <em>character.</em></h2>
      <div className="about-copy">
        <p>Katty Hozavsky is a senior graphic designer and social media creator working across brand identity, campaign creative, digital design, print, packaging, EDMs and social content.</p>
        <p>Her approach balances visual instinct with practical thinking—making work that feels considered, communicates quickly and stays true to the brand behind it.</p>
        <div className="services">
          <span>Brand identity</span><span>Campaign creative</span><span>Packaging</span><span>Social content</span><span>Digital &amp; EDM</span><span>Print design</span>
        </div>
      </div>
    </div>
  </section>
}

function Contact() {
  return <section className="contact" id="contact">
    <p className="eyebrow">04 / Get in touch</p>
    <div className="contact-main">
      <h2>Have something<br/>good in mind?</h2>
      <a href="mailto:justakatty@gmail.com" aria-label="Email Katty at justakatty@gmail.com">Let’s talk <span>↗</span></a>
    </div>
    <div className="contact-bottom">
      <p>For freelance, contract, campaign and brand design enquiries.</p>
      <a href="mailto:justakatty@gmail.com">justakatty@gmail.com</a>
    </div>
  </section>
}

function App() {
  const [selected, setSelected] = useState<number | null>(null)
  const close = () => setSelected(null)
  return <>
    <Header />
    <main><Hero /><ProjectGrid onOpen={setSelected} /><VideoSection /><About /><Contact /></main>
    <footer><a href="#top">KH<span>.</span></a><p>© 2026 Katty Hozavsky. All rights reserved.</p><a href="#top">Back to top ↑</a></footer>
    {selected !== null && <ProjectModal index={selected} onClose={close} onChange={setSelected} />}
  </>
}

export default App
