import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ComponentType, MutableRefObject } from 'react'
import {
  AboutIcon,
  BlogsIcon,
  ContactIcon,
  GalleryIcon,
  JobsIcon,
  ProjectsIcon,
  SettingsIcon,
  TerminalIcon,
  TimelineIcon,
} from './icons'
import type { ThemeName } from './constants'
import { WindowPanels } from './WindowPanels'
import type { AppId, AppWindow, DragState, GalleryPhoto, ResizeState, TerminalLine, WindowPos, WindowSize } from './types'
import type { PortfolioData } from '../data/portfolioData'

type SocialLink = {
  key: string
  label: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

type DesktopShortcut = {
  id: AppId
  label: string
  iconClass: string
  Icon: ComponentType<{ className?: string }>
}

type IconPosition = {
  x: number
  y: number
}

type DesktopWindowsProps = {
  windows: Record<AppId, AppWindow>
  activeId: AppId
  positions: Record<AppId, WindowPos>
  sizes: Record<AppId, WindowSize>
  closingWindows: Record<AppId, boolean>
  viewport: { width: number; height: number }
  taskbarReservedHeight: number
  windowInset: number
  forceFullscreenWindows: boolean
  windowRefs: MutableRefObject<Record<AppId, HTMLElement | null>>
  setActiveId: (id: AppId) => void
  setDrag: (drag: DragState | null) => void
  setResize: (resize: ResizeState | null) => void
  toggleMinimize: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  closeApp: (id: AppId) => void
  closeStartMenu: () => void
  openApp: (id: AppId) => void
  socialLinks: SocialLink[]
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
  normalizedQuery: string
  searchWindowStyle: CSSProperties
  query: string
  setQuery: (query: string) => void
  filteredProjectCards: PortfolioData['projects']
  filteredBlogPosts: PortfolioData['blogs']
  searchedJobs: PortfolioData['jobs']
  filteredFullTimeJobs: PortfolioData['jobs']
  filteredInternshipJobs: PortfolioData['jobs']
}

export function DesktopWindows(props: DesktopWindowsProps) {
  const {
    windows,
    activeId,
    positions,
    sizes,
    closingWindows,
    viewport,
    taskbarReservedHeight,
    windowInset,
    forceFullscreenWindows,
    windowRefs,
    setActiveId,
    setDrag,
    setResize,
    toggleMinimize,
    toggleMaximize,
    closeApp,
    closeStartMenu,
    openApp,
    socialLinks,
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
    normalizedQuery,
    searchWindowStyle,
    query,
    setQuery,
    filteredProjectCards,
    filteredBlogPosts,
    searchedJobs,
    filteredFullTimeJobs,
    filteredInternshipJobs,
  } = props

  const desktopShortcuts: DesktopShortcut[] = useMemo(
    () => [
      { id: 'about', label: 'About', iconClass: 'about', Icon: AboutIcon },
      { id: 'projects', label: 'Projects', iconClass: 'projects', Icon: ProjectsIcon },
      { id: 'gallery', label: 'Gallery', iconClass: 'gallery', Icon: GalleryIcon },
      { id: 'blogs', label: 'Blogs', iconClass: 'blogs', Icon: BlogsIcon },
      { id: 'jobs', label: 'Jobs', iconClass: 'projects', Icon: JobsIcon },
      { id: 'timeline', label: 'Timeline', iconClass: 'timeline', Icon: TimelineIcon },
      { id: 'contact', label: 'Contact', iconClass: 'contact', Icon: ContactIcon },
      { id: 'settings', label: 'Settings', iconClass: 'settings', Icon: SettingsIcon },
      { id: 'terminal', label: 'Terminal', iconClass: 'terminal', Icon: TerminalIcon },
    ],
    [],
  )

  const desktopIconsRef = useRef<HTMLDivElement | null>(null)

  const shortcutById = useMemo(
    () =>
      desktopShortcuts.reduce<Record<AppId, DesktopShortcut>>((acc, shortcut) => {
        acc[shortcut.id] = shortcut
        return acc
      }, {} as Record<AppId, DesktopShortcut>),
    [desktopShortcuts],
  )

  const iconSize = useMemo(() => ({ width: 92, height: 94 }), [])

  const [iconOrder] = useState<AppId[]>(() => {
    return desktopShortcuts.map((shortcut) => shortcut.id)
  })

  const [iconPositions, setIconPositions] = useState<Record<AppId, IconPosition>>(() => {
    const availableWidth = Math.max(220, viewport.width - 180)
    const availableHeight = Math.max(220, viewport.height - taskbarReservedHeight - 36)
    return desktopShortcuts.reduce<Record<AppId, IconPosition>>((acc, shortcut, index) => {
      const itemsPerColumn = Math.max(1, Math.floor(availableHeight / 108))
      const column = Math.floor(index / itemsPerColumn)
      const row = index % itemsPerColumn
      const x = Math.max(8, Math.min(availableWidth - iconSize.width, 14 + column * 106))
      const y = Math.max(8, Math.min(availableHeight - iconSize.height, 14 + row * 108))
      acc[shortcut.id] = { x, y }
      return acc
    }, {} as Record<AppId, IconPosition>)
  })

  const [draggedIconId, setDraggedIconId] = useState<AppId | null>(null)
  const dragStateRef = useRef<{ id: AppId; offsetX: number; offsetY: number; moved: boolean } | null>(null)
  const skipClickForIconRef = useRef<AppId | null>(null)

  useEffect(() => {
    if (!draggedIconId) return

    function onMouseMove(event: MouseEvent) {
      const dragState = dragStateRef.current
      const desktopEl = desktopIconsRef.current
      if (!dragState || !desktopEl) return

      const desktopRect = desktopEl.getBoundingClientRect()
      const availableWidth = Math.max(220, viewport.width - 180)
      const availableHeight = Math.max(220, viewport.height - taskbarReservedHeight - 36)
      const maxX = Math.max(8, Math.min(desktopRect.width - iconSize.width, availableWidth - iconSize.width))
      const maxY = Math.max(8, Math.min(desktopRect.height - iconSize.height, availableHeight - iconSize.height))
      const x = Math.max(8, Math.min(maxX, event.clientX - desktopRect.left - dragState.offsetX))
      const y = Math.max(8, Math.min(maxY, event.clientY - desktopRect.top - dragState.offsetY))

      dragState.moved = true
      setIconPositions((prev) => ({
        ...prev,
        [dragState.id]: { x, y },
      }))
    }

    function onMouseUp() {
      const dragState = dragStateRef.current
      if (dragState?.moved) {
        skipClickForIconRef.current = dragState.id
      }
      dragStateRef.current = null
      setDraggedIconId(null)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [draggedIconId, iconSize.height, iconSize.width, taskbarReservedHeight, viewport.height, viewport.width])

  useEffect(() => {
    setIconPositions((prev) => {
      const availableWidth = Math.max(220, viewport.width - 180)
      const availableHeight = Math.max(220, viewport.height - taskbarReservedHeight - 36)
      let changed = false
      const next = { ...prev }

      desktopShortcuts.forEach((shortcut, index) => {
        if (!next[shortcut.id]) {
          const itemsPerColumn = Math.max(1, Math.floor(availableHeight / 108))
          const column = Math.floor(index / itemsPerColumn)
          const row = index % itemsPerColumn
          next[shortcut.id] = {
            x: Math.max(8, Math.min(availableWidth - iconSize.width, 14 + column * 106)),
            y: Math.max(8, Math.min(availableHeight - iconSize.height, 14 + row * 108)),
          }
          changed = true
        }

        const clampedX = Math.max(8, Math.min(availableWidth - iconSize.width, next[shortcut.id].x))
        const clampedY = Math.max(8, Math.min(availableHeight - iconSize.height, next[shortcut.id].y))
        if (clampedX !== next[shortcut.id].x || clampedY !== next[shortcut.id].y) {
          next[shortcut.id] = { x: clampedX, y: clampedY }
          changed = true
        }
      })

      return changed ? next : prev
    })
  }, [desktopShortcuts, iconSize.height, iconSize.width, taskbarReservedHeight, viewport.height, viewport.width])

  return (
    <div className="desktop" onMouseDown={closeStartMenu}>
      <div className="desktop-icons" ref={desktopIconsRef}>
        {iconOrder.map((id) => {
          const shortcut = shortcutById[id]
          if (!shortcut) return null
          const iconPosition = iconPositions[shortcut.id]
          return (
            <button
              key={shortcut.id}
              className={`desktop-icon${draggedIconId === shortcut.id ? ' dragging' : ''}`}
              type="button"
              style={
                iconPosition
                  ? {
                    left: iconPosition.x,
                    top: iconPosition.y,
                  }
                  : undefined
              }
              onMouseDown={(event) => {
                if (event.button !== 0) return
                const buttonRect = event.currentTarget.getBoundingClientRect()
                setDraggedIconId(shortcut.id)
                dragStateRef.current = {
                  id: shortcut.id,
                  offsetX: event.clientX - buttonRect.left,
                  offsetY: event.clientY - buttonRect.top,
                  moved: false,
                }
              }}
              onClick={() => {
                if (skipClickForIconRef.current === shortcut.id) {
                  skipClickForIconRef.current = null
                  return
                }
                openApp(shortcut.id)
              }}
            >
              <span className={`app-icon ${shortcut.iconClass}`} aria-hidden="true">
                <shortcut.Icon className="icon" />
              </span>
              <span className="desktop-icon-label">{shortcut.label}</span>
            </button>
          )
        })}
      </div>

      <aside className="social-rail" aria-label="Social links" onMouseDown={(e) => e.stopPropagation()}>
        {socialLinks.map(({ key, label, href, Icon }) => (
          <a key={key} className="social-rail-link" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            <Icon className="social-rail-icon" />
          </a>
        ))}
      </aside>

      <div className="window-area">
        {(Object.keys(windows) as AppId[]).map((id) => {
          const w = windows[id]
          if (!w.isOpen || w.isMinimized) return null

          const isActive = activeId === id
          const zIndex = isActive ? 3 : 2
          const pos = positions[id]
          const size = sizes[id]
          const isMaximized = windows[id].isMaximized
          const windowClassName = ['window', isActive ? 'active' : '', isMaximized ? 'maximized' : '', closingWindows[id] ? 'window-exit' : 'window-enter']
            .filter(Boolean)
            .join(' ')
          const maximizedHeight = Math.max(220, viewport.height - taskbarReservedHeight)
          const fullscreenHeight = Math.max(220, viewport.height - taskbarReservedHeight - windowInset * 2)

          return (
            <section
              key={id}
              className={windowClassName}
              style={
                isMaximized
                  ? { zIndex, left: 0, top: 0, width: viewport.width, height: maximizedHeight }
                  : forceFullscreenWindows
                    ? {
                      zIndex,
                      left: windowInset,
                      top: windowInset,
                      width: Math.max(0, viewport.width - windowInset * 2),
                      height: fullscreenHeight,
                    }
                    : { zIndex, left: pos.x, top: pos.y, width: size.width, height: size.height }
              }
              ref={(el) => {
                windowRefs.current[id] = el
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                setActiveId(id)
              }}
            >
              <header
                className="window-titlebar"
                onPointerDown={(e) => {
                  if ((e.target as HTMLElement | null)?.closest('.window-controls')) return
                  if ((e.target as HTMLElement | null)?.closest('.window-resize-handle')) return
                  if (windows[id].isMaximized) return

                  e.stopPropagation()
                  setActiveId(id)

                  const start = positions[id]
                    ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
                  setDrag({
                    id,
                    pointerId: e.pointerId,
                    startClientX: e.clientX,
                    startClientY: e.clientY,
                    startX: start.x,
                    startY: start.y,
                  })
                }}
              >
                <div className="window-title">
                  <span
                    className={
                      id === 'about'
                        ? 'app-icon small about'
                        : id === 'projects'
                          ? 'app-icon small projects'
                          : id === 'gallery'
                            ? 'app-icon small gallery'
                            : id === 'blogs'
                              ? 'app-icon small blogs'
                              : id === 'jobs'
                                ? 'app-icon small projects'
                                : id === 'timeline'
                                  ? 'app-icon small timeline'
                                  : id === 'settings'
                                    ? 'app-icon small settings'
                                    : id === 'terminal'
                                      ? 'app-icon small terminal'
                                      : 'app-icon small contact'
                    }
                    aria-hidden="true"
                  >
                    {id === 'about' ? (
                      <AboutIcon className="icon" />
                    ) : id === 'projects' ? (
                      <ProjectsIcon className="icon" />
                    ) : id === 'gallery' ? (
                      <GalleryIcon className="icon" />
                    ) : id === 'blogs' ? (
                      <BlogsIcon className="icon" />
                    ) : id === 'jobs' ? (
                      <JobsIcon className="icon" />
                    ) : id === 'timeline' ? (
                      <TimelineIcon className="icon" />
                    ) : id === 'settings' ? (
                      <SettingsIcon className="icon" />
                    ) : id === 'terminal' ? (
                      <TerminalIcon className="icon" />
                    ) : (
                      <ContactIcon className="icon" />
                    )}
                  </span>
                  <span>{w.title}</span>
                </div>
                <div className="window-controls">
                  <button className="win-btn" type="button" aria-label="Minimize" onClick={() => toggleMinimize(id)}>
                    <span className="win-glyph">—</span>
                  </button>
                  <button
                    className="win-btn"
                    type="button"
                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                    onClick={() => toggleMaximize(id)}
                  >
                    <span className="win-glyph">{isMaximized ? '❐' : '□'}</span>
                  </button>
                  <button className="win-btn close" type="button" aria-label="Close" onClick={() => closeApp(id)}>
                    <span className="win-glyph">×</span>
                  </button>
                </div>
              </header>

              <div className="window-content">
                <WindowPanels
                  id={id}
                  about={about}
                  availability={availability}
                  technologyChips={technologyChips}
                  programmingChips={programmingChips}
                  timelineItems={timelineItems}
                  galleryPhotos={galleryPhotos}
                  activeGalleryPhoto={activeGalleryPhoto}
                  isGalleryLightboxOpen={isGalleryLightboxOpen}
                  setIsGalleryLightboxOpen={setIsGalleryLightboxOpen}
                  setActiveGalleryPhoto={setActiveGalleryPhoto}
                  blogPosts={blogPosts}
                  fullTimeJobs={fullTimeJobs}
                  internshipJobs={internshipJobs}
                  projectCards={projectCards}
                  certifications={certifications}
                  contact={contact}
                  theme={theme}
                  applyTheme={applyTheme}
                  muted={muted}
                  toggleSoundFromMenu={toggleSoundFromMenu}
                  audioError={audioError}
                  terminalLines={terminalLines}
                  terminalInput={terminalInput}
                  setTerminalInput={setTerminalInput}
                  runTerminalCommand={runTerminalCommand}
                  navigateTerminalHistory={navigateTerminalHistory}
                  autocompleteTerminalInput={autocompleteTerminalInput}
                />
              </div>

              {!isMaximized && (
                <div
                  className="window-resize-handle"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    setActiveId(id)
                      ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
                    setResize({
                      id,
                      pointerId: e.pointerId,
                      startClientX: e.clientX,
                      startClientY: e.clientY,
                      startWidth: sizes[id].width,
                      startHeight: sizes[id].height,
                    })
                  }}
                />
              )}
            </section>
          )
        })}

        {normalizedQuery && (
          <section className="window active search-results-window" style={searchWindowStyle} onMouseDown={(e) => e.stopPropagation()}>
            <header className="window-titlebar">
              <div className="window-title">
                <span className="app-icon small projects" aria-hidden="true">
                  <ProjectsIcon className="icon" />
                </span>
                <span>Search Results</span>
              </div>
              <div className="window-controls">
                <button className="win-btn close" type="button" aria-label="Close search" onClick={() => setQuery('')}>
                  <span className="win-glyph">×</span>
                </button>
              </div>
            </header>

            <div className="window-content">
              <div className="panel cards-panel">
                <h2 className="section-heading">Results for "{query}"</h2>
                <p className="muted">
                  {filteredProjectCards.length} project matches · {filteredBlogPosts.length} blog matches · {searchedJobs.length} work matches
                </p>

                <h3 className="section-heading panel-block">Projects</h3>
                {filteredProjectCards.length > 0 ? (
                  <div className="cards">
                    {filteredProjectCards.map((project) => (
                      <article key={`search-${project.title}`} className="wcard">
                        <h3 className="wcard-title">{project.title}</h3>
                        <p className="muted">{project.subtitle}</p>
                        <p className="wcard-text">{project.description}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No matching projects.</p>
                )}

                <h3 className="section-heading panel-block">Blogs</h3>
                {filteredBlogPosts.length > 0 ? (
                  <div className="cards">
                    {filteredBlogPosts.map((post) => (
                      <article key={`search-blog-${post.link}`} className="wcard">
                        <h3 className="wcard-title">{post.title}</h3>
                        <p className="muted">{post.date}</p>
                        <p className="wcard-text">{post.summary}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No matching blogs.</p>
                )}

                <h3 className="section-heading panel-block">Work</h3>
                {searchedJobs.length > 0 ? (
                  <div className="jobs-list">
                    {filteredFullTimeJobs.length > 0 && <p className="muted">Full-time</p>}
                    {filteredFullTimeJobs.map((job) => (
                      <article key={`search-ft-${job.company}`} className="wcard job-card">
                        <h3 className="wcard-title">{job.company}</h3>
                        <p className="job-meta">
                          {job.role}
                          {job.period ? ` · ${job.period}` : ''}
                        </p>
                      </article>
                    ))}

                    {filteredInternshipJobs.length > 0 && <p className="muted">Internships</p>}
                    {filteredInternshipJobs.map((job) => (
                      <article key={`search-int-${job.company}`} className="wcard job-card">
                        <h3 className="wcard-title">{job.company}</h3>
                        <p className="job-meta">
                          {job.role}
                          {job.period ? ` · ${job.period}` : ''}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No matching work experience.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
