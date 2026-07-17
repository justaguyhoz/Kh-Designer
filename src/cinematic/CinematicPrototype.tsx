import { useEffect, useState } from 'react'
import './cinematic.css'

const charliiGallery = [
  {
    src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2_landscape.jpg',
    alt: 'Charlii Mega Marilyn Stylist Set landscape social campaign creative',
  },
  {
    src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2.jpg',
    alt: 'Charlii Mega Marilyn Stylist Set square social campaign creative',
  },
  {
    src: '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_ad-2_long.jpg',
    alt: 'Charlii Mega Marilyn Stylist Set portrait social campaign creative',
  },
]

const charliiVideo = '/projects/Charlie Hair rollers/MOF_ads + vid/MOF_Mega Marylin Set.mp4'

function CinematicHeader({ openProject }: { openProject: () => void }) {
  return <header className="cinematic-header" aria-label="Cinematic portfolio navigation">
    <a className="brand cinematic-brand" href="/" aria-label="Katty Hozavsky cinematic prototype"><span>KH</span><small>Designer</small></a>
    <nav aria-label="Prototype navigation">
      <button type="button" onClick={openProject}>Explore</button>
      <a href="/classic">View classic portfolio</a>
      <a href="#cinematic-about">About</a>
      <a href="#cinematic-contact">Contact</a>
    </nav>
  </header>
}

function CityScene({ isApproaching, openProject }: { isApproaching: boolean; openProject: () => void }) {
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
    <button className="digital-station" type="button" onClick={openProject} aria-label="Open Charlii project station">
      <span className="station-kicker">Now showing</span>
      <span className="station-screen">
        <img src={charliiGallery[0].src} alt="Charlii Mega Marilyn Stylist Set shown on a city digital display" />
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

function ProjectLayer({ open, closeProject }: { open: boolean; closeProject: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProject()
      if (event.key === 'ArrowRight') setActiveIndex((index) => Math.min(charliiGallery.length - 1, index + 1))
      if (event.key === 'ArrowLeft') setActiveIndex((index) => Math.max(0, index - 1))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeProject, open])

  return <section className={open ? 'project-layer open' : 'project-layer'} aria-hidden={!open} aria-labelledby="charlii-layer-title">
    <div className="project-panel" role="dialog" aria-modal="true" aria-label="Charlii project preview">
      <button className="project-close" type="button" onClick={closeProject} aria-label="Close Charlii project">Close</button>
      <div className="project-summary">
        <p className="eyebrow">Charlii</p>
        <h2 id="charlii-layer-title">Mega Marilyn Stylist Set</h2>
        <p>Social campaign</p>
        <dl>
          <div>
            <dt>Selected palette</dt>
            <dd className="cinematic-swatches" aria-label="Selected palette">
              <i style={{ background: '#f0b6bd' }} />
              <i style={{ background: '#f7ded8' }} />
              <i style={{ background: '#7b2e35' }} />
              <i style={{ background: '#2b090c' }} />
            </dd>
          </div>
          <div>
            <dt>Gallery</dt>
            <dd>{activeIndex + 1} / {charliiGallery.length}</dd>
          </div>
        </dl>
      </div>
      <div className="project-media-stage">
        <button type="button" onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0} aria-label="Previous Charlii asset">‹</button>
        <img src={charliiGallery[activeIndex].src} alt={charliiGallery[activeIndex].alt} />
        <button type="button" onClick={() => setActiveIndex((index) => Math.min(charliiGallery.length - 1, index + 1))} disabled={activeIndex === charliiGallery.length - 1} aria-label="Next Charlii asset">›</button>
      </div>
      <div className="project-video">
        <p>Video support</p>
        <video src={charliiVideo} controls playsInline preload="metadata" />
      </div>
    </div>
  </section>
}

export function CinematicPrototype() {
  const [projectOpen, setProjectOpen] = useState(false)
  const [approaching, setApproaching] = useState(false)

  const openProject = () => {
    setApproaching(true)
    window.setTimeout(() => setProjectOpen(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 520)
  }

  const closeProject = () => {
    setProjectOpen(false)
    window.setTimeout(() => setApproaching(false), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220)
  }

  return <main className={projectOpen ? 'cinematic-root project-is-open' : 'cinematic-root'} id="top">
    <CinematicHeader openProject={openProject} />
    <CityScene isApproaching={approaching} openProject={openProject} />
    <ProjectLayer open={projectOpen} closeProject={closeProject} />
    <aside className="cinematic-info" aria-label="Prototype information">
      <section id="cinematic-about">
        <p>About</p>
        <span>Senior Designer &amp; Social Media Creator.</span>
      </section>
      <section id="cinematic-contact">
        <p>Contact</p>
        <a href="mailto:justakatty@gmail.com">justakatty@gmail.com</a>
      </section>
    </aside>
  </main>
}
