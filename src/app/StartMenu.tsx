import type { ComponentType } from 'react'
import { AVATAR_ICON_URL, startMenuThemeOptions, type ThemeName } from './constants'
import {
  AboutIcon,
  BlogsIcon,
  ContactIcon,
  GalleryIcon,
  JobsIcon,
  MoonIcon,
  ProjectsIcon,
  RestartIcon,
  ResumeIcon,
  SettingsIcon,
  ShutdownIcon,
  SleepIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
  SunIcon,
  TerminalIcon,
  TimelineIcon,
} from './icons'
import type { AppId } from './types'

export type StartMenuOption = {
  key: string
  label: string
  description: string
  type: 'app' | 'resume' | 'theme' | 'sound'
  appId?: AppId
}

type SocialLink = {
  key: string
  label: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

type StartMenuProps = {
  startOpen: boolean
  startQuery: string
  setStartQuery: (query: string) => void
  filteredPinnedApps: Array<{ id: AppId; label: string }>
  filteredAllOptions: StartMenuOption[]
  openApp: (id: AppId) => void
  openStartOption: (option: StartMenuOption) => void
  socialLinks: SocialLink[]
  theme: ThemeName
  applyTheme: (theme: ThemeName) => void
  muted: boolean
  userName: string
  runPowerAction: (action: 'restart' | 'sleep' | 'shutdown') => void
}

export function StartMenu({
  startOpen,
  startQuery,
  setStartQuery,
  filteredPinnedApps,
  filteredAllOptions,
  openApp,
  openStartOption,
  socialLinks,
  theme,
  applyTheme,
  muted,
  userName,
  runPowerAction,
}: StartMenuProps) {
  if (!startOpen) return null

  return (
    <div className="start" onMouseDown={(e) => e.stopPropagation()}>
      <div className="start-top">
        <div className="start-search-wrap">
          <span className="search-icon" aria-hidden="true" />
          <input
            className="start-search-input"
            value={startQuery}
            onChange={(e) => setStartQuery(e.target.value)}
            placeholder="Search for apps, files, and settings"
            aria-label="Start menu search"
          />
        </div>
      </div>

      <div className="start-headline-row">
        <div className="start-title">Pinned</div>
        <div className="start-title subtle">All options</div>
      </div>

      <div className="start-grid">
        {filteredPinnedApps.map((a) => (
          <button key={a.id} className="start-item" type="button" onClick={() => openApp(a.id)}>
            <span
              className={
                a.id === 'about'
                  ? 'app-icon about'
                  : a.id === 'projects'
                    ? 'app-icon projects'
                    : a.id === 'terminal'
                      ? 'app-icon terminal'
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
            <span className="start-label">{a.label}</span>
          </button>
        ))}
        {filteredPinnedApps.length === 0 && <div className="start-empty">No pinned apps found.</div>}
      </div>

      <div className="start-all-options">
        {filteredAllOptions.map((option) => (
          <button key={option.key} className="start-option" type="button" onClick={() => openStartOption(option)}>
            <span
              className={
                option.key === 'about'
                  ? 'app-icon small about'
                  : option.key === 'projects'
                    ? 'app-icon small projects'
                    : option.key === 'gallery'
                      ? 'app-icon small gallery'
                      : option.key === 'blogs'
                        ? 'app-icon small blogs'
                        : option.key === 'jobs'
                          ? 'app-icon small projects'
                          : option.key === 'timeline'
                            ? 'app-icon small timeline'
                            : option.key === 'contact'
                              ? 'app-icon small contact'
                              : option.key === 'settings'
                                ? 'app-icon small settings'
                                : option.key === 'terminal'
                                  ? 'app-icon small terminal'
                                  : 'app-icon small about'
              }
              aria-hidden="true"
            >
              {option.key === 'about' ? (
                <AboutIcon className="icon" />
              ) : option.key === 'projects' ? (
                <ProjectsIcon className="icon" />
              ) : option.key === 'gallery' ? (
                <GalleryIcon className="icon" />
              ) : option.key === 'blogs' ? (
                <BlogsIcon className="icon" />
              ) : option.key === 'jobs' ? (
                <JobsIcon className="icon" />
              ) : option.key === 'timeline' ? (
                <TimelineIcon className="icon" />
              ) : option.key === 'contact' ? (
                <ContactIcon className="icon" />
              ) : option.key === 'settings' ? (
                <SettingsIcon className="icon" />
              ) : option.key === 'terminal' ? (
                <TerminalIcon className="icon" />
              ) : option.key === 'theme' ? (
                theme === 'light' ? <SunIcon className="icon" /> : <MoonIcon className="icon" />
              ) : option.key === 'resume' ? (
                <ResumeIcon className="icon" />
              ) : muted ? (
                <SpeakerOffIcon className="icon" />
              ) : (
                <SpeakerOnIcon className="icon" />
              )}
            </span>
            <span className="start-option-copy">
              <span className="start-option-label">{option.label}</span>
              <span className="start-option-desc">{option.description}</span>
            </span>
          </button>
        ))}
        {filteredAllOptions.length === 0 && <div className="start-empty">No options found.</div>}
      </div>

      <div className="start-social" aria-label="Social links">
        {socialLinks.map(({ key, label, href, Icon }) => (
          <a key={key} className="start-social-link" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            <Icon className="start-social-icon" />
          </a>
        ))}
      </div>

      <div className="start-theme" aria-label="Theme switcher">
        {startMenuThemeOptions.map((themeOption) => (
          <button
            key={themeOption.id}
            className={theme === themeOption.id ? `start-theme-btn active theme-${themeOption.id}` : `start-theme-btn theme-${themeOption.id}`}
            type="button"
            onClick={() => applyTheme(themeOption.id)}
            aria-pressed={theme === themeOption.id}
          >
            {themeOption.id === 'dark' ? <MoonIcon className="start-theme-icon" /> : <span className="start-theme-swatch" aria-hidden="true" />}
            {themeOption.label}
          </button>
        ))}
      </div>

      <div className="start-userbar">
        <div className="start-user">
          <span className="start-avatar" aria-hidden="true">
            <img className="start-avatar-img" src={AVATAR_ICON_URL} alt="" />
          </span>
          <div className="start-user-meta">
            <div className="start-username">{userName}</div>
            <div className="start-user-role">Data Scientist</div>
          </div>
        </div>
        <div className="start-user-actions">
          <div className="start-power-row" aria-label="Power actions">
            <button className="start-power-item" type="button" aria-label="Restart" title="Restart" onClick={() => runPowerAction('restart')}>
              <RestartIcon className="start-power-item-icon" />
            </button>
            <button className="start-power-item" type="button" aria-label="Sleep" title="Sleep" onClick={() => runPowerAction('sleep')}>
              <SleepIcon className="start-power-item-icon" />
            </button>
            <button className="start-power-item shutdown" type="button" aria-label="Shutdown" title="Shutdown" onClick={() => runPowerAction('shutdown')}>
              <ShutdownIcon className="start-power-item-icon shutdown-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
