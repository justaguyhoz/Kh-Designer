import { useMemo, useState } from 'react'
import { clients, disciplines, portfolioProjects, videoTitle, type PortfolioMedia, type PortfolioProject } from './data/projects'

type BrowseMode = 'all' | 'client' | 'discipline'

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
      <h1>Portfolio work, composed with the same care as the campaigns.</h1>
      <div className="hero-note">
        <p>Selected Works</p>
        <a href="#work">Explore by client or discipline <Arrow /></a>
      </div>
    </div>
  </section>
}

function FilterButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return <button className={active ? 'filter-chip active' : 'filter-chip'} onClick={onClick} aria-pressed={active}>{children}</button>
}

function PortfolioExplorer() {
  const [mode, setMode] = useState<BrowseMode>('client')
  const [selectedClient, setSelectedClient] = useState('Charlii')
  const [selectedDiscipline, setSelectedDiscipline] = useState('Social')

  const visibleProjects = useMemo(() => {
    if (mode === 'client') return portfolioProjects.filter((project) => project.client === selectedClient)
    if (mode === 'discipline') return portfolioProjects.filter((project) => project.disciplines.includes(selectedDiscipline))
    return portfolioProjects
  }, [mode, selectedClient, selectedDiscipline])

  const charliiProject = portfolioProjects.find((project) => project.displayTheme === 'charlii')
  const benchmarkProject = visibleProjects.find((project) => project.displayTheme === 'charlii') ?? charliiProject

  return <section className="work section" id="work">
    <div className="work-intro">
      <p className="eyebrow">Selected Works</p>
      <div>
        <h2>Browse the same work two ways.</h2>
        <p>Client view shows the range for one brand. Discipline view gathers the same project data by format.</p>
      </div>
    </div>

    <div className="portfolio-controls" aria-label="Portfolio browsing controls">
      <div className="mode-switch" role="group" aria-label="Browse mode">
        <FilterButton active={mode === 'all'} onClick={() => setMode('all')}>All work</FilterButton>
        <FilterButton active={mode === 'client'} onClick={() => setMode('client')}>By client</FilterButton>
        <FilterButton active={mode === 'discipline'} onClick={() => setMode('discipline')}>By discipline</FilterButton>
      </div>
      <div className="filter-row" aria-label={mode === 'discipline' ? 'Disciplines' : 'Clients'}>
        {mode === 'discipline'
          ? disciplines.map((discipline) => <FilterButton key={discipline} active={selectedDiscipline === discipline} onClick={() => setSelectedDiscipline(discipline)}>{discipline}</FilterButton>)
          : clients.map((client) => <FilterButton key={client} active={selectedClient === client} onClick={() => setSelectedClient(client)}>{client}</FilterButton>)}
      </div>
    </div>

    {benchmarkProject?.displayTheme === 'charlii'
      ? <CharliiShowcase project={benchmarkProject} />
      : <ReviewPlaceholder projects={visibleProjects} />}
  </section>
}

function selectMedia(project: PortfolioProject, match: string) {
  return project.media.find((media) => media.filename.includes(match))
}

function MediaFrame({ media, className = '', priority = false }: { media?: PortfolioMedia; className?: string; priority?: boolean }) {
  if (!media) return null
  if (media.type === 'video') {
    return <figure className={`media-frame ${className}`}>
      <video src={media.src} poster={media.poster} autoPlay muted loop playsInline preload="metadata" aria-label={media.alt} />
    </figure>
  }

  return <figure className={`media-frame ${className}`}>
    <img src={media.src} width={media.width} height={media.height} alt={media.alt} loading={priority ? 'eager' : 'lazy'} />
  </figure>
}

function StageLabel({ number, title, note }: { number: string; title: string; note: string }) {
  return <div className="stage-label">
    <span>{number}</span>
    <div><strong>{title}</strong><small>{note}</small></div>
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

  return <article className="charlii-showcase" aria-labelledby="charlii-title">
    <div className="charlii-hero">
      <div className="charlii-title">
        <p className="eyebrow">Social Media Video Campaigns</p>
        <h2 id="charlii-title">{project.title}</h2>
        <p className="subtitle">Full funnel social media campaign</p>
        <div className="discipline-tags">
          {project.disciplines.map((discipline) => <span key={discipline}>{discipline}</span>)}
        </div>
      </div>
      <div className="hero-composition">
        <MediaFrame media={hero} className="hero-card" priority />
        <div className="quote-card">
          <span aria-hidden="true">“</span>
          <p>Salon Results<br />at home</p>
          <small>Charlii Hair Rollers</small>
        </div>
      </div>
    </div>

    <div className="funnel-strip" aria-label="Campaign structure">
      <StageLabel number="1" title="TOF · Awareness" note="Introduce, inspire, build interest" />
      <StageLabel number="2" title="MOF · Sales" note="Educate, showcase, drive consideration" />
      <StageLabel number="3" title="BOF · Remarketing" note="Re-engage, reinforce, convert" />
    </div>

    <section className="stage-composition stage-one" aria-labelledby="tof-title">
      <aside>
        <span>1</span>
        <h3 id="tof-title">TOF · Awareness</h3>
        <p>Introduce. Inspire. Build interest.</p>
      </aside>
      <MediaFrame media={tofSquare} className="span-2 lift-a" />
      <MediaFrame media={tofDetail} className="lift-b" />
      <MediaFrame media={tofPortrait} className="portrait-card lift-c" />
    </section>

    <section className="stage-composition stage-two" aria-labelledby="mof-title">
      <aside>
        <span>2</span>
        <h3 id="mof-title">MOF · Sales</h3>
        <p>Educate. Showcase. Drive consideration.</p>
      </aside>
      <MediaFrame media={mofWide} className="span-2 dark-card lift-b" />
      <MediaFrame media={mofSquare} className="lift-c" />
      <MediaFrame media={mofPortrait} className="portrait-card lift-a" />
    </section>

    <section className="stage-composition stage-three" aria-labelledby="bof-title">
      <aside>
        <span>3</span>
        <h3 id="bof-title">BOF · Remarketing</h3>
        <p>Re-engage. Reinforce. Convert.</p>
      </aside>
      <MediaFrame media={bofWide} className="span-2 lift-a" />
      <MediaFrame media={bofSquare} className="lift-b" />
      <MediaFrame media={bofPortrait} className="portrait-card lift-c" />
    </section>

    <section className="motion-strip" aria-labelledby="motion-title">
      <div>
        <p className="eyebrow">Motion</p>
        <h3 id="motion-title">Video variants sit inside the campaign system.</h3>
      </div>
      <div className="video-rail">
        {videos.map((video) => <figure className="video-card" key={video.src}>
          <video src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-label={video.alt} />
          <figcaption>{videoTitle(video.filename, video.label)}</figcaption>
        </figure>)}
      </div>
    </section>
  </article>
}

function ReviewPlaceholder({ projects }: { projects: PortfolioProject[] }) {
  return <div className="review-placeholder">
    <p className="eyebrow">Review gate</p>
    <h2>{projects.length} project{projects.length === 1 ? '' : 's'} match this view.</h2>
    <p>These clients are connected to the new manifest and filters. Their art-directed sections will be built after the Charlii direction is approved.</p>
    <div>
      {projects.map((project) => <span key={project.id}>{project.client}</span>)}
    </div>
  </div>
}

function About() {
  return <section className="about section" id="about">
    <p className="eyebrow">About</p>
    <div className="about-layout">
      <h2>I build visual systems for brand, campaign, digital, print and social work.</h2>
      <p>Copy here is intentionally restrained until project text is verified from the existing portfolio source.</p>
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
