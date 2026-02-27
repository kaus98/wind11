import type { AppId, AppWindow, WindowBounds, WindowPos, WindowSize } from './types'

export const galleryImageModules = import.meta.glob(
  ['/public/gallery/*.{png,jpg,jpeg,webp,gif,avif,svg}', '/public/gallery/*.{PNG,JPG,JPEG,WEBP,GIF,AVIF,SVG}'],
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>

export const AVATAR_ICON_URL = 'https://kaus98.github.io/img/avatar-hux-home.jpg?cache-bust=1772011888911'
export const GALLERY_LIGHTBOX_TRANSITION_MS = 260
export const WINDOW_PANEL_TRANSITION_MS = 240

export const themeOptions = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'glass', label: 'Glass' },
  { id: 'retro', label: 'Retro' },
  { id: 'solar', label: 'Solar' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'neon', label: 'Neon' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'dracula', label: 'Dracula' },
  { id: 'oceanic', label: 'Oceanic' },
] as const

export type ThemeName = (typeof themeOptions)[number]['id']

export function isThemeName(value: string | null): value is ThemeName {
  return themeOptions.some((theme) => theme.id === value)
}

export const startMenuThemeOptions = themeOptions.filter(
  (themeOption) => themeOption.id === 'matrix' || themeOption.id === 'dark' || themeOption.id === 'solar',
)

export function isExternalLink(href: string) {
  return /^https?:\/\//.test(href)
}

export const pinnedApps: Array<{ id: AppId; label: string }> = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'terminal', label: 'Terminal' },
]

export const initialPositions: Record<AppId, WindowPos> = {
  about: { x: 160, y: 70 },
  projects: { x: 210, y: 110 },
  gallery: { x: 230, y: 110 },
  blogs: { x: 220, y: 100 },
  jobs: { x: 240, y: 130 },
  timeline: { x: 250, y: 120 },
  contact: { x: 240, y: 140 },
  settings: { x: 260, y: 90 },
  terminal: { x: 280, y: 110 },
}

export const initialSizes: Record<AppId, WindowSize> = {
  about: { width: 840, height: 520 },
  projects: { width: 840, height: 520 },
  gallery: { width: 920, height: 560 },
  blogs: { width: 860, height: 540 },
  jobs: { width: 860, height: 560 },
  timeline: { width: 860, height: 560 },
  contact: { width: 620, height: 440 },
  settings: { width: 540, height: 420 },
  terminal: { width: 880, height: 520 },
}

export const initialRestoreBounds: Record<AppId, WindowBounds | null> = {
  about: null,
  projects: null,
  gallery: null,
  blogs: null,
  jobs: null,
  timeline: null,
  contact: null,
  settings: null,
  terminal: null,
}

export const initialClosingWindows: Record<AppId, boolean> = {
  about: false,
  projects: false,
  gallery: false,
  blogs: false,
  jobs: false,
  timeline: false,
  contact: false,
  settings: false,
  terminal: false,
}

export const initialWindows: Record<AppId, AppWindow> = {
  about: { id: 'about', title: 'About', isOpen: false, isMinimized: false, isMaximized: false },
  projects: { id: 'projects', title: 'Projects', isOpen: false, isMinimized: false, isMaximized: false },
  gallery: { id: 'gallery', title: 'Gallery', isOpen: false, isMinimized: false, isMaximized: false },
  blogs: { id: 'blogs', title: 'Blogs', isOpen: false, isMinimized: false, isMaximized: false },
  jobs: { id: 'jobs', title: 'Jobs', isOpen: false, isMinimized: false, isMaximized: false },
  timeline: { id: 'timeline', title: 'Timeline', isOpen: false, isMinimized: false, isMaximized: false },
  contact: { id: 'contact', title: 'Contact', isOpen: false, isMinimized: false, isMaximized: false },
  settings: { id: 'settings', title: 'Settings', isOpen: false, isMinimized: false, isMaximized: false },
  terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, isMaximized: false },
}
