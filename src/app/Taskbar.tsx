import { pinnedApps, type ThemeName } from './constants'
import {
  AboutIcon,
  JobsIcon,
  MoonIcon,
  ProjectsIcon,
  ResumeIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
  SunIcon,
  TerminalIcon,
  WindowsIcon,
} from './icons'
import type { AppId, AppWindow } from './types'

type TaskbarProps = {
  startOpen: boolean
  toggleStartMenu: () => void
  query: string
  setQuery: (query: string) => void
  windows: Record<AppId, AppWindow>
  activeId: AppId
  visibleWindowIds: AppId[]
  toggleMinimize: (id: AppId) => void
  setActiveId: (id: AppId) => void
  openApp: (id: AppId) => void
  toggleTheme: () => void
  theme: ThemeName
  muted: boolean
  audioError: boolean
  toggleSoundFromMenu: () => void
  timeText: string
  dateText: string
}

export function Taskbar({
  startOpen,
  toggleStartMenu,
  query,
  setQuery,
  windows,
  activeId,
  visibleWindowIds,
  toggleMinimize,
  setActiveId,
  openApp,
  toggleTheme,
  theme,
  muted,
  audioError,
  toggleSoundFromMenu,
  timeText,
  dateText,
}: TaskbarProps) {
  return (
    <footer className="taskbar" onMouseDown={(e) => e.stopPropagation()}>
      <div className="taskbar-inner">
        <div className="taskbar-center">
          <button className={startOpen ? 'tb-btn active' : 'tb-btn'} type="button" aria-label="Start" onClick={toggleStartMenu}>
            <span className="win-logo" aria-hidden="true">
              <WindowsIcon className="win-svg" />
            </span>
          </button>

          <div className="search">
            <span className="search-icon" aria-hidden="true" />
            <input
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search"
            />
          </div>

          <div className="pinned">
            {pinnedApps.map((a) => {
              const w = windows[a.id]
              const isRunning = w.isOpen
              const isActive = a.id === activeId && visibleWindowIds.includes(a.id)

              return (
                <button
                  key={a.id}
                  className={isActive ? 'tb-btn active' : isRunning ? 'tb-btn running' : 'tb-btn'}
                  type="button"
                  aria-label={a.label}
                  onClick={() => {
                    if (windows[a.id].isOpen && !windows[a.id].isMinimized && a.id === activeId) {
                      toggleMinimize(a.id)
                      return
                    }

                    if (windows[a.id].isOpen && windows[a.id].isMinimized) {
                      toggleMinimize(a.id)
                      setActiveId(a.id)
                      return
                    }

                    openApp(a.id)
                  }}
                >
                  <span
                    className={
                      a.id === 'about'
                        ? 'app-icon about'
                        : a.id === 'projects'
                          ? 'app-icon projects'
                          : a.id === 'terminal'
                            ? 'app-icon terminal'
                          : a.id === 'jobs'
                            ? 'app-icon projects'
                            : 'app-icon projects'
                    }
                    aria-hidden="true"
                  >
                    {a.id === 'about' ? (
                      <AboutIcon className="icon" />
                    ) : a.id === 'projects' ? (
                      <ProjectsIcon className="icon" />
                    ) : a.id === 'terminal' ? (
                      <TerminalIcon className="icon" />
                    ) : (
                      <JobsIcon className="icon" />
                    )}
                  </span>
                  <span className="running-dot" aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="taskbar-right">
          <div className="tray">
            <a className="tray-btn" href="./Kaustubh_Pathak_Resume.pdf" download aria-label="Download resume">
              <ResumeIcon className="tray-svg" />
            </a>
            <button className="tray-btn" type="button" aria-label="Switch theme" onClick={toggleTheme}>
              {theme === 'light' ? <SunIcon className="tray-svg" /> : <MoonIcon className="tray-svg" />}
            </button>
            <button
              className={muted ? 'tray-btn' : 'tray-btn active'}
              type="button"
              aria-label={audioError ? 'Audio file missing' : muted ? 'Unmute' : 'Mute'}
              disabled={audioError}
              onClick={() => toggleSoundFromMenu()}
            >
              {muted ? <SpeakerOffIcon className="tray-svg" /> : <SpeakerOnIcon className="tray-svg" />}
            </button>
          </div>
          <div className="clock" aria-label="Time and date">
            <div className="clock-time">{timeText}</div>
            <div className="clock-date">{dateText}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
