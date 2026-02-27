import { isExternalLink, themeOptions, type ThemeName } from './constants'
import { CodeChipIcon, TechChipIcon } from './icons'
import type { AppId, GalleryPhoto, TerminalLine } from './types'
import type { PortfolioData } from '../data/portfolioData'

type WindowPanelsProps = {
  id: AppId
  about: PortfolioData['about']
  availability: PortfolioData['contact']['availability']
  technologyChips: string[]
  programmingChips: string[]
  timelineItems: PortfolioData['timeline']
  galleryPhotos: GalleryPhoto[]
  activeGalleryPhoto: GalleryPhoto | null
  isGalleryLightboxOpen: boolean
  setIsGalleryLightboxOpen: (open: boolean) => void
  setActiveGalleryPhoto: (photo: GalleryPhoto | null) => void
  blogPosts: PortfolioData['blogs']
  fullTimeJobs: PortfolioData['jobs']
  internshipJobs: PortfolioData['jobs']
  projectCards: PortfolioData['projects']
  certifications: PortfolioData['certifications']
  contact: PortfolioData['contact']
  theme: ThemeName
  applyTheme: (theme: ThemeName) => void
  muted: boolean
  toggleSoundFromMenu: () => void
  audioError: boolean
  terminalLines: TerminalLine[]
  terminalInput: string
  setTerminalInput: (value: string) => void
  runTerminalCommand: (command: string) => void
  navigateTerminalHistory: (direction: 'up' | 'down') => void
  autocompleteTerminalInput: () => void
}

export function WindowPanels({
  id,
  about,
  availability,
  technologyChips,
  programmingChips,
  timelineItems,
  galleryPhotos,
  activeGalleryPhoto,
  isGalleryLightboxOpen,
  setIsGalleryLightboxOpen,
  setActiveGalleryPhoto,
  blogPosts,
  fullTimeJobs,
  internshipJobs,
  projectCards,
  certifications,
  contact,
  theme,
  applyTheme,
  muted,
  toggleSoundFromMenu,
  audioError,
  terminalLines,
  terminalInput,
  setTerminalInput,
  runTerminalCommand,
  navigateTerminalHistory,
  autocompleteTerminalInput,
}: WindowPanelsProps) {
  return (
    <>
      {id === 'about' && (
        <div className="panel full-panel">
          <h1 className="big-title">{about.name}</h1>
          <p className="muted">{about.rolesLine}</p>
          <p className="muted">{about.location}</p>
          <p className="muted">
            {availability.status} · {availability.from}
          </p>
          {about.summaryParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="chips">
            {technologyChips.map((technology) => (
              <span className="chip" key={technology}>
                <TechChipIcon className="chip-icon" />
                {technology}
              </span>
            ))}
          </div>

          <h2 className="section-heading panel-block">Programming</h2>
          <div className="chips">
            {programmingChips.map((language) => (
              <span className="chip" key={language}>
                <CodeChipIcon className="chip-icon" />
                {language}
              </span>
            ))}
          </div>

          <h2 className="section-heading panel-block">Education</h2>
          <ul className="list-plain">
            {about.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="section-heading panel-block">Interests</h2>
          <div className="chips">
            {about.interests.map((interest) => (
              <span className="chip" key={interest}>
                {interest}
              </span>
            ))}
          </div>

          <h2 className="section-heading panel-block">Achievements</h2>
          <ul className="list-plain">
            {about.achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}

      {id === 'timeline' && (
        <div className="panel full-panel">
          <h2 className="section-heading">Timeline</h2>
          <p className="muted">A dated snapshot of my career and learning journey.</p>
          <div className="timeline-list timeline-rich">
            {timelineItems.map((item) => (
              <article key={`${item.date}-${item.title}`} className="timeline-item">
                <p className="timeline-date">{item.date}</p>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {id === 'gallery' && (
        <div className="panel cards-panel">
          <h2 className="section-heading">Gallery</h2>
          <p className="muted">Take a peek into my life, one chaotic screenshot at a time.</p>
          {galleryPhotos.length > 0 ? (
            <div className="gallery-grid">
              {galleryPhotos.map((photo) => (
                <figure key={photo.src} className="gallery-item">
                  <button
                    className="gallery-thumb gallery-thumb-icon"
                    type="button"
                    onClick={() => {
                      setIsGalleryLightboxOpen(false)
                      setActiveGalleryPhoto(photo)
                    }}
                    aria-label={`Open ${photo.displayName}`}
                    title={photo.displayName}
                  >
                    <img className="gallery-image gallery-image-icon" src={photo.src} alt={photo.displayName} loading="lazy" />
                  </button>
                </figure>
              ))}
            </div>
          ) : (
            <p className="muted">No photos found yet in /public/gallery.</p>
          )}

          {activeGalleryPhoto && (
            <div
              className={`gallery-lightbox ${isGalleryLightboxOpen ? 'is-open' : 'is-closing'}`}
              role="dialog"
              aria-modal="true"
              onClick={() => setIsGalleryLightboxOpen(false)}
            >
              <div className="gallery-lightbox-card" onClick={(e) => e.stopPropagation()}>
                <div className="gallery-lightbox-header">
                  <button
                    className="gallery-lightbox-close-floating"
                    type="button"
                    aria-label="Close image"
                    onClick={() => setIsGalleryLightboxOpen(false)}
                  >
                    <span className="gallery-lightbox-close-glyph" aria-hidden="true">
                      ×
                    </span>
                  </button>
                  <div className="gallery-lightbox-meta">
                    <span className="gallery-lightbox-label">Image Preview</span>
                    <span className="gallery-lightbox-name" title={activeGalleryPhoto.displayName}>
                      {activeGalleryPhoto.displayName}
                    </span>
                  </div>
                </div>
                <div className="gallery-lightbox-body">
                  <div className="gallery-lightbox-stage">
                    <img className="gallery-lightbox-image" src={activeGalleryPhoto.src} alt={activeGalleryPhoto.displayName} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {id === 'blogs' && (
        <div className="panel cards-panel">
          <h2 className="section-heading">Blogs</h2>
          <p className="muted">Latest writing from kaus98.github.io</p>
          <div className="cards">
            {blogPosts.map((post) => (
              <article key={post.link} className="wcard">
                <h3 className="wcard-title">{post.title}</h3>
                <p className="muted">{post.date}</p>
                <p className="wcard-text">{post.summary}</p>
                <div className="wcard-actions">
                  <a className="wlink" href={post.link} target="_blank" rel="noreferrer">
                    Read
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {id === 'jobs' && (
        <div className="panel full-panel">
          <h2 className="section-heading">Jobs</h2>
          <p className="muted">Experience split by full-time and internships</p>
          <div className="jobs-list">
            <h3 className="section-heading">Full-time</h3>
            {fullTimeJobs.map((job) => (
              <article key={job.company} className="wcard job-card">
                <h3 className="wcard-title">{job.company}</h3>
                <p className="job-meta">
                  {job.role}
                  {job.period ? ` · ${job.period}` : ''}
                </p>
                <ul className="list-plain job-points">
                  {job.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}

            <h3 className="section-heading panel-block">Internships</h3>
            {internshipJobs.map((job) => (
              <article key={job.company} className="wcard job-card">
                <h3 className="wcard-title">{job.company}</h3>
                <p className="job-meta">
                  {job.role}
                  {job.period ? ` · ${job.period}` : ''}
                </p>
                <ul className="list-plain job-points">
                  {job.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      )}

      {id === 'projects' && (
        <div className="panel cards-panel">
          <h2 className="section-heading">Projects</h2>
          <div className="cards">
            {projectCards.map((project) => (
              <article key={project.title} className="wcard">
                <h3 className="wcard-title">{project.title}</h3>
                <p className="muted">{project.subtitle}</p>
                <p className="wcard-text">{project.description}</p>
                <div className="wcard-actions">
                  {project.website && (
                    <a className="wlink" href={project.website} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                  {project.github && (
                    <a className="wlink" href={project.github} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <h2 className="section-heading panel-block">Certifications</h2>
          <ul className="list-plain">
            {certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {id === 'contact' && (
        <div className="panel full-panel">
          <h2 className="section-heading">Contact</h2>
          <div className="availability-card">
            <h3 className="availability-title">Availability</h3>
            <p className="availability-status">{availability.status}</p>
            <p className="availability-meta">
              {availability.from} · {availability.timezone}
            </p>
            <p className="availability-meta">Updated: {availability.updated}</p>
          </div>
          <p>
            Email:
            <span className="inline-space" />
            <a className="wlink" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
          <p>
            Phone:
            <span className="inline-space" />
            <a className="wlink" href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
              {contact.phone}
            </a>
          </p>
          <div className="chips">
            {contact.links.map((link) => (
              <a
                key={link.label}
                className="chip link"
                href={link.href}
                target={isExternalLink(link.href) ? '_blank' : undefined}
                rel={isExternalLink(link.href) ? 'noreferrer' : undefined}
                download={link.download ? true : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <h2 className="section-heading panel-block">Positions of Responsibility</h2>
          <ul className="list-plain">
            {contact.responsibilities.map((position) => (
              <li key={position}>{position}</li>
            ))}
          </ul>
        </div>
      )}

      {id === 'settings' && (
        <div className="panel cards-panel">
          <h2 className="section-heading">Settings</h2>
          <p className="muted">Control theme and sound.</p>

          <div className="panel-block">
            <h3 className="section-heading">Theme</h3>
            <label className="settings-label" htmlFor="settings-theme-select">
              Select theme
            </label>
            <select
              id="settings-theme-select"
              className="settings-select"
              value={theme}
              onChange={(e) => applyTheme(e.target.value as ThemeName)}
            >
              {themeOptions.map((themeOption) => (
                <option key={themeOption.id} value={themeOption.id}>
                  {themeOption.label}
                </option>
              ))}
            </select>
          </div>

          <div className="panel-block">
            <h3 className="section-heading">Sound</h3>
            <button
              className={muted ? 'settings-toggle' : 'settings-toggle active'}
              type="button"
              onClick={toggleSoundFromMenu}
              disabled={audioError}
              aria-pressed={!muted}
            >
              {audioError ? 'Audio file missing' : muted ? 'Muted' : 'Unmuted'}
            </button>
          </div>
        </div>
      )}

      {id === 'terminal' && (
        <div className="panel full-panel terminal-panel">
          <p className="terminal-session-label" title={`${about.name.toLowerCase().replace(/\s+/g, '')}@portfolio:~`}>
            {about.name.toLowerCase().replace(/\s+/g, '')}@portfolio:~
          </p>

          <div className="terminal-shell">
            <div className="terminal-console" role="log" aria-live="polite">
              {terminalLines.map((line) => (
                <div key={line.id} className={`terminal-line terminal-line-${line.tone}`}>
                  {line.text}
                </div>
              ))}
            </div>

            <form
              className="terminal-input-row"
              onSubmit={(e) => {
                e.preventDefault()
                runTerminalCommand(terminalInput)
              }}
            >
              <span className="terminal-prompt">$</span>
              <input
                className="terminal-input"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    navigateTerminalHistory('up')
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    navigateTerminalHistory('down')
                  } else if (e.key === 'Tab') {
                    e.preventDefault()
                    autocompleteTerminalInput()
                  }
                }}
                placeholder="Type a command and press Enter"
                aria-label="Terminal command"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
              <button className="terminal-run-btn" type="submit">
                Run
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
