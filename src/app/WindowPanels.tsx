import { useMemo, useState } from 'react'
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

type ProjectCard = PortfolioData['projects'][number]

type DetectionRule = {
  label: string
  keywords: string[]
}

const TECHNOLOGY_RULES: DetectionRule[] = [
  { label: 'NLP', keywords: ['nlp', 'lyrics', 'chatbot', 'sentiment'] },
  { label: 'Transformers', keywords: ['transformer', 'multi-head attention', 'bert'] },
  { label: 'PyTorch', keywords: ['pytorch'] },
  { label: 'Forecasting', keywords: ['forecast', 'sarimax', 'arima', 'prophet', 'theta', 'holts'] },
  { label: 'Recommendation Systems', keywords: ['recommendation'] },
  { label: 'Web Scraping', keywords: ['scraping', 'scraper', 'crawl'] },
  { label: 'Flask', keywords: ['flask'] },
  { label: 'Docker', keywords: ['docker'] },
  { label: 'Apache Spark', keywords: ['spark'] },
  { label: 'Data Visualization', keywords: ['visualization', 'graph', 'plot'] },
  { label: 'Kaggle', keywords: ['kaggle.com', 'kaggle'] },
]

const LANGUAGE_RULES: DetectionRule[] = [
  { label: 'Python', keywords: ['python', 'pytorch', 'flask'] },
  { label: 'TypeScript', keywords: ['typescript'] },
  { label: 'JavaScript', keywords: ['javascript', 'node.js', 'nodejs'] },
  { label: 'Scala', keywords: ['scala'] },
]

function detectLabels(project: ProjectCard, rules: DetectionRule[], explicitValues?: string[]): string[] {
  const normalizedHaystack = [
    project.title,
    project.subtitle,
    project.description,
    project.website ?? '',
    project.github ?? '',
    ...(explicitValues ?? []),
  ]
    .join(' ')
    .toLowerCase()

  return rules
    .filter((rule) => rule.keywords.some((keyword) => normalizedHaystack.includes(keyword)))
    .map((rule) => rule.label)
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
  const [projectFilterTab, setProjectFilterTab] = useState<'all' | 'pinned' | 'kaggle' | 'older'>('all')
  const [projectTechnologyFilter, setProjectTechnologyFilter] = useState('all')
  const [projectLanguageFilter, setProjectLanguageFilter] = useState('all')
  const [blogTab, setBlogTab] = useState<'all' | 'medium' | 'personal'>('all')

  const allProjectsSorted = useMemo(() => {
    return [...projectCards].sort((projectA, projectB) => {
      const ageA = projectA.ageYears ?? -1
      const ageB = projectB.ageYears ?? -1

      if (ageA !== ageB) {
        return ageA - ageB
      }

      if (projectA.pinned !== projectB.pinned) {
        return projectA.pinned ? -1 : 1
      }

      return projectA.title.localeCompare(projectB.title)
    })
  }, [projectCards])

  const kaggleProjects = useMemo(
    () =>
      allProjectsSorted.filter(
        (project) =>
          project.website?.includes('kaggle.com') || project.subtitle.toLowerCase().includes('kaggle'),
      ),
    [allProjectsSorted],
  )

  const projectsByTab = useMemo(() => {
    if (projectFilterTab === 'pinned') {
      return allProjectsSorted.filter((project) => project.pinned)
    }

    if (projectFilterTab === 'kaggle') {
      return kaggleProjects
    }

    if (projectFilterTab === 'older') {
      return allProjectsSorted.filter((project) => typeof project.ageYears === 'number' && project.ageYears >= 5)
    }

    const pinnedProjects = allProjectsSorted.filter((project) => project.pinned)
    const nonPinnedProjects = allProjectsSorted.filter((project) => !project.pinned)
    return [...pinnedProjects, ...nonPinnedProjects]
  }, [allProjectsSorted, kaggleProjects, projectFilterTab])

  const projectTechnologyOptions = useMemo(() => {
    const labels = new Set<string>()

    allProjectsSorted.forEach((project) => {
      detectLabels(project, TECHNOLOGY_RULES, project.technologies).forEach((label) => labels.add(label))
    })

    return [...labels].sort((labelA, labelB) => labelA.localeCompare(labelB))
  }, [allProjectsSorted])

  const projectLanguageOptions = useMemo(() => {
    const labels = new Set<string>()

    allProjectsSorted.forEach((project) => {
      detectLabels(project, LANGUAGE_RULES, project.languages).forEach((label) => labels.add(label))
    })

    return [...labels].sort((labelA, labelB) => labelA.localeCompare(labelB))
  }, [allProjectsSorted])

  const visibleProjects = useMemo(() => {
    return projectsByTab.filter((project) => {
      const technologyMatches =
        projectTechnologyFilter === 'all' ||
        detectLabels(project, TECHNOLOGY_RULES, project.technologies).includes(projectTechnologyFilter)

      const languageMatches =
        projectLanguageFilter === 'all' ||
        detectLabels(project, LANGUAGE_RULES, project.languages).includes(projectLanguageFilter)

      return technologyMatches && languageMatches
    })
  }, [projectLanguageFilter, projectTechnologyFilter, projectsByTab])

  const hasActiveProjectFilters =
    projectFilterTab !== 'all' || projectTechnologyFilter !== 'all' || projectLanguageFilter !== 'all'

  const projectsMissingAge = useMemo(
    () => allProjectsSorted.filter((project) => typeof project.ageYears !== 'number'),
    [allProjectsSorted],
  )

  const visibleBlogs = useMemo(() => {
    if (blogTab === 'medium') {
      return blogPosts.filter((post) => post.link.includes('medium.com'))
    }

    if (blogTab === 'personal') {
      return blogPosts.filter((post) => !post.link.includes('medium.com'))
    }

    return blogPosts
  }, [blogPosts, blogTab])

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
          <div className="project-tabs" role="tablist" aria-label="Blog categories">
            <button
              type="button"
              role="tab"
              aria-selected={blogTab === 'all'}
              className={`project-tab${blogTab === 'all' ? ' active' : ''}`}
              onClick={() => setBlogTab('all')}
            >
              All Blogs
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={blogTab === 'medium'}
              className={`project-tab${blogTab === 'medium' ? ' active' : ''}`}
              onClick={() => setBlogTab('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={blogTab === 'personal'}
              className={`project-tab${blogTab === 'personal' ? ' active' : ''}`}
              onClick={() => setBlogTab('personal')}
            >
              Personal
            </button>
          </div>
          <div className="cards">
            {visibleBlogs.map((post) => (
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
            {visibleBlogs.length === 0 && <p className="muted">No blogs in this tab yet.</p>}
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
          <div className="project-tabs" role="tablist" aria-label="Project categories">
            <button
              type="button"
              role="tab"
              aria-selected={projectFilterTab === 'all'}
              className={`project-tab${projectFilterTab === 'all' ? ' active' : ''}`}
              onClick={() => setProjectFilterTab('all')}
            >
              All Projects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={projectFilterTab === 'pinned'}
              className={`project-tab${projectFilterTab === 'pinned' ? ' active' : ''}`}
              onClick={() => setProjectFilterTab('pinned')}
            >
              Pinned Projects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={projectFilterTab === 'kaggle'}
              className={`project-tab${projectFilterTab === 'kaggle' ? ' active' : ''}`}
              onClick={() => setProjectFilterTab('kaggle')}
            >
              Kaggle Projects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={projectFilterTab === 'older'}
              className={`project-tab${projectFilterTab === 'older' ? ' active' : ''}`}
              onClick={() => setProjectFilterTab('older')}
            >
              Older Projects
            </button>
          </div>
          <div className="project-filter-controls">
            <div className="project-filter-group">
              <label className="project-filter-label" htmlFor="project-technology-filter">
                Technology
              </label>
              <select
                id="project-technology-filter"
                className="settings-select"
                value={projectTechnologyFilter}
                onChange={(event) => setProjectTechnologyFilter(event.target.value)}
              >
                <option value="all">All technologies</option>
                {projectTechnologyOptions.map((technology) => (
                  <option key={technology} value={technology}>
                    {technology}
                  </option>
                ))}
              </select>
            </div>

            <div className="project-filter-group">
              <label className="project-filter-label" htmlFor="project-language-filter">
                Language
              </label>
              <select
                id="project-language-filter"
                className="settings-select"
                value={projectLanguageFilter}
                onChange={(event) => setProjectLanguageFilter(event.target.value)}
              >
                <option value="all">All languages</option>
                {projectLanguageOptions.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="project-tab project-filter-clear"
              onClick={() => {
                setProjectFilterTab('all')
                setProjectTechnologyFilter('all')
                setProjectLanguageFilter('all')
              }}
              disabled={!hasActiveProjectFilters}
            >
              Clear filters
            </button>
          </div>
          {hasActiveProjectFilters && (
            <p className="muted">
              Active: {projectFilterTab !== 'all' ? `Tab: ${projectFilterTab}` : 'Tab: all'}
              {projectTechnologyFilter !== 'all' ? ` · Technology: ${projectTechnologyFilter}` : ''}
              {projectLanguageFilter !== 'all' ? ` · Language: ${projectLanguageFilter}` : ''}
            </p>
          )}
          <p className="muted">Sorted by age (oldest to newest) using project metadata.</p>
          {projectsMissingAge.length > 0 && (
            <p className="muted">
              Age missing for: {projectsMissingAge.map((project) => project.title).join(', ')}
            </p>
          )}
          <div className="cards">
            {visibleProjects.map((project) => (
              <article key={project.title} className="wcard">
                <h3 className="wcard-title project-title-row">
                  <span>{project.title}</span>
                  {project.pinned && (
                    <span className="project-pin" aria-label="Pinned project" title="Pinned project">
                      📌
                    </span>
                  )}
                </h3>
                <p className="muted">{project.subtitle}</p>
                {(typeof project.ageYears === 'number' || project.lastCommitAt || project.lastSuccessfulRunAt) && (
                  <p className="muted">
                    {typeof project.ageYears === 'number' ? `Age: ${project.ageYears} years` : 'Age: Not set'}
                    {project.lastCommitAt ? ` · Last commit: ${project.lastCommitAt}` : ''}
                    {project.lastSuccessfulRunAt ? ` · Last successful run: ${project.lastSuccessfulRunAt}` : ''}
                  </p>
                )}
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
            {visibleProjects.length === 0 && <p className="muted">No projects match the selected filters.</p>}
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
