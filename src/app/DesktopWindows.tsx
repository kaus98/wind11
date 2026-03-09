import type { CSSProperties, MutableRefObject } from "react";
import { WindowPanels } from "./WindowPanels";
import { GithubProfileCard } from "./GithubWidgets";
import { ClockCalendarWidget } from "./ClockCalendarWidget";
import { DesktopIconGrid } from "./DesktopIconGrid";
import { SearchResultsWindow } from "./SearchResultsWindow";
import type {
  AppId,
  AppWindow,
  DragState,
  GalleryPhoto,
  ResizeState,
  TerminalLine,
  WindowPos,
  WindowSize,
} from "./types";
import type { PortfolioData } from "../data/portfolioData";
import type { ThemeName } from "./constants";
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
} from "./icons";

type SocialLink = {
  key: string;
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

type DesktopWindowsProps = {
  windows: Record<AppId, AppWindow>;
  activeId: AppId;
  positions: Record<AppId, WindowPos>;
  sizes: Record<AppId, WindowSize>;
  closingWindows: Record<AppId, boolean>;
  viewport: { width: number; height: number };
  taskbarReservedHeight: number;
  windowInset: number;
  forceFullscreenWindows: boolean;
  windowRefs: MutableRefObject<Record<AppId, HTMLElement | null>>;
  setActiveId: (id: AppId) => void;
  setDrag: (drag: DragState | null) => void;
  setResize: (resize: ResizeState | null) => void;
  toggleMinimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  closeStartMenu: () => void;
  openApp: (id: AppId) => void;
  socialLinks: SocialLink[];
  about: PortfolioData["about"];
  availability: PortfolioData["contact"]["availability"];
  technologyChips: string[];
  programmingChips: string[];
  timelineItems: PortfolioData["timeline"];
  galleryPhotos: GalleryPhoto[];
  activeGalleryPhoto: GalleryPhoto | null;
  isGalleryLightboxOpen: boolean;
  setIsGalleryLightboxOpen: (open: boolean) => void;
  setActiveGalleryPhoto: (photo: GalleryPhoto | null) => void;
  blogPosts: PortfolioData["blogs"];
  fullTimeJobs: PortfolioData["jobs"];
  internshipJobs: PortfolioData["jobs"];
  projectCards: PortfolioData["projects"];
  certifications: PortfolioData["certifications"];
  contact: PortfolioData["contact"];
  theme: ThemeName;
  applyTheme: (theme: ThemeName) => void;
  muted: boolean;
  toggleSoundFromMenu: () => void;
  audioError: boolean;
  terminalLines: TerminalLine[];
  terminalInput: string;
  setTerminalInput: (value: string) => void;
  runTerminalCommand: (command: string) => void;
  navigateTerminalHistory: (direction: "up" | "down") => void;
  autocompleteTerminalInput: () => void;
  normalizedQuery: string;
  searchWindowStyle: CSSProperties;
  query: string;
  setQuery: (query: string) => void;
  filteredProjectCards: PortfolioData["projects"];
  filteredBlogPosts: PortfolioData["blogs"];
  searchedJobs: PortfolioData["jobs"];
  filteredFullTimeJobs: PortfolioData["jobs"];
  filteredInternshipJobs: PortfolioData["jobs"];
  widgetSettings: import("./types").WidgetSettings;
  setWidgetSettings: React.Dispatch<
    React.SetStateAction<import("./types").WidgetSettings>
  >;
};

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
    widgetSettings,
    setWidgetSettings,
  } = props;

  return (
    <div className="desktop" onMouseDown={closeStartMenu}>
      {widgetSettings.showDesktopIcons && (
        <DesktopIconGrid
          viewport={viewport}
          taskbarReservedHeight={taskbarReservedHeight}
          openApp={openApp}
        />
      )}

      {widgetSettings.showSocials && (
        <aside
          className="social-rail"
          aria-label="Social links"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {socialLinks.map(({ key, label, href, Icon }) => (
            <a
              key={key}
              className="social-rail-link"
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon className="social-rail-icon" />
            </a>
          ))}
        </aside>
      )}

      {(widgetSettings.showGithub || widgetSettings.showCalendar) && (
        <div
          className="desktop-widgets"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {widgetSettings.showGithub && (
            <GithubProfileCard username={contact.githubUsername} />
          )}
          {widgetSettings.showCalendar && <ClockCalendarWidget />}
        </div>
      )}

      <div className="window-area">
        {(Object.keys(windows) as AppId[]).map((id) => {
          const w = windows[id];
          if (!w.isOpen || w.isMinimized) return null;

          const isActive = activeId === id;
          const zIndex = isActive ? 3 : 2;
          const pos = positions[id];
          const size = sizes[id];
          const isMaximized = windows[id].isMaximized;
          const windowClassName = [
            "window",
            isActive ? "active" : "",
            isMaximized ? "maximized" : "",
            closingWindows[id] ? "window-exit" : "window-enter",
          ]
            .filter(Boolean)
            .join(" ");
          const maximizedHeight = Math.max(
            220,
            viewport.height - taskbarReservedHeight,
          );
          const fullscreenHeight = Math.max(
            220,
            viewport.height - taskbarReservedHeight - windowInset * 2,
          );

          return (
            <section
              key={id}
              className={windowClassName}
              style={
                isMaximized
                  ? {
                      zIndex,
                      left: 0,
                      top: 0,
                      width: viewport.width,
                      height: maximizedHeight,
                    }
                  : forceFullscreenWindows
                    ? {
                        zIndex,
                        left: windowInset,
                        top: windowInset,
                        width: Math.max(0, viewport.width - windowInset * 2),
                        height: fullscreenHeight,
                      }
                    : {
                        zIndex,
                        left: pos.x,
                        top: pos.y,
                        width: size.width,
                        height: size.height,
                      }
              }
              ref={(el) => {
                windowRefs.current[id] = el;
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setActiveId(id);
              }}
            >
              <header
                className="window-titlebar"
                onPointerDown={(e) => {
                  if (
                    (e.target as HTMLElement | null)?.closest(
                      ".window-controls",
                    )
                  )
                    return;
                  if (
                    (e.target as HTMLElement | null)?.closest(
                      ".window-resize-handle",
                    )
                  )
                    return;
                  if (windows[id].isMaximized) return;

                  e.stopPropagation();
                  setActiveId(id);

                  const start = positions[id];
                  (e.currentTarget as HTMLElement).setPointerCapture(
                    e.pointerId,
                  );
                  setDrag({
                    id,
                    pointerId: e.pointerId,
                    startClientX: e.clientX,
                    startClientY: e.clientY,
                    startX: start.x,
                    startY: start.y,
                  });
                }}
              >
                <div className="window-title">
                  <span
                    className={
                      id === "about"
                        ? "app-icon small about"
                        : id === "projects"
                          ? "app-icon small projects"
                          : id === "gallery"
                            ? "app-icon small gallery"
                            : id === "blogs"
                              ? "app-icon small blogs"
                              : id === "jobs"
                                ? "app-icon small projects"
                                : id === "timeline"
                                  ? "app-icon small timeline"
                                  : id === "settings"
                                    ? "app-icon small settings"
                                    : id === "terminal"
                                      ? "app-icon small terminal"
                                      : "app-icon small contact"
                    }
                    aria-hidden="true"
                  >
                    {id === "about" ? (
                      <AboutIcon className="icon" />
                    ) : id === "projects" ? (
                      <ProjectsIcon className="icon" />
                    ) : id === "gallery" ? (
                      <GalleryIcon className="icon" />
                    ) : id === "blogs" ? (
                      <BlogsIcon className="icon" />
                    ) : id === "jobs" ? (
                      <JobsIcon className="icon" />
                    ) : id === "timeline" ? (
                      <TimelineIcon className="icon" />
                    ) : id === "settings" ? (
                      <SettingsIcon className="icon" />
                    ) : id === "terminal" ? (
                      <TerminalIcon className="icon" />
                    ) : (
                      <ContactIcon className="icon" />
                    )}
                  </span>
                  <span>{w.title}</span>
                </div>
                <div className="window-controls">
                  <button
                    className="win-btn"
                    type="button"
                    aria-label="Minimize"
                    onClick={() => toggleMinimize(id)}
                  >
                    <span className="win-glyph">—</span>
                  </button>
                  <button
                    className="win-btn"
                    type="button"
                    aria-label={isMaximized ? "Restore" : "Maximize"}
                    onClick={() => toggleMaximize(id)}
                  >
                    <span className="win-glyph">{isMaximized ? "❐" : "□"}</span>
                  </button>
                  <button
                    className="win-btn close"
                    type="button"
                    aria-label="Close"
                    onClick={() => closeApp(id)}
                  >
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
                  widgetSettings={widgetSettings}
                  setWidgetSettings={setWidgetSettings}
                />
              </div>

              {!isMaximized && (
                <div
                  className="window-resize-handle"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActiveId(id);
                    (e.currentTarget as HTMLElement).setPointerCapture(
                      e.pointerId,
                    );
                    setResize({
                      id,
                      pointerId: e.pointerId,
                      startClientX: e.clientX,
                      startClientY: e.clientY,
                      startWidth: sizes[id].width,
                      startHeight: sizes[id].height,
                    });
                  }}
                />
              )}
            </section>
          );
        })}

        <SearchResultsWindow
          query={query}
          normalizedQuery={normalizedQuery}
          searchWindowStyle={searchWindowStyle}
          setQuery={setQuery}
          filteredProjectCards={filteredProjectCards}
          filteredBlogPosts={filteredBlogPosts}
          searchedJobs={searchedJobs}
          filteredFullTimeJobs={filteredFullTimeJobs}
          filteredInternshipJobs={filteredInternshipJobs}
        />
      </div>
    </div>
  );
}
