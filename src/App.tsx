import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { portfolioData } from './data/portfolioData'

type AppId = 'about' | 'projects' | 'gallery' | 'blogs' | 'jobs' | 'contact'

const galleryImageModules = import.meta.glob(['/public/gallery/*.{png,jpg,jpeg,webp,gif,avif,svg}', '/public/gallery/*.{PNG,JPG,JPEG,WEBP,GIF,AVIF,SVG}'], {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const AVATAR_ICON_URL = 'https://kaus98.github.io/img/avatar-hux-home.jpg?cache-bust=1772011888911'

type AppWindow = {
  id: AppId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
}

function isExternalLink(href: string) {
  return /^https?:\/\//.test(href)
}

function JobsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4.5A2.5 2.5 0 0 1 10.5 2h3A2.5 2.5 0 0 1 16 4.5V6h3.2A2.8 2.8 0 0 1 22 8.8v9.4a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 18.2V8.8A2.8 2.8 0 0 1 4.8 6H8V4.5Zm2.5-.5a.5.5 0 0 0-.5.5V6h4V4.5a.5.5 0 0 0-.5-.5h-3Z" />
      <path d="M2 12.1h7.5v1.1a1.4 1.4 0 0 0 1.4 1.4h2.2a1.4 1.4 0 0 0 1.4-1.4v-1.1H22v-1.8h-7.5V11a.4.4 0 0 1-.4.4h-2.2a.4.4 0 0 1-.4-.4v-.7H2v1.8Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.6 2h8.8A5.6 5.6 0 0 1 22 7.6v8.8a5.6 5.6 0 0 1-5.6 5.6H7.6A5.6 5.6 0 0 1 2 16.4V7.6A5.6 5.6 0 0 1 7.6 2Zm0 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Z" />
      <path d="M12 7a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3Zm5-3.4a1.4 1.4 0 1 1-1.4 1.4A1.4 1.4 0 0 1 17 5.6Z" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.2-3.5-1.2a2.8 2.8 0 0 0-1.2-1.6c-1-.7.1-.7.1-.7a2.3 2.3 0 0 1 1.7 1.1 2.4 2.4 0 0 0 3.2.9 2.4 2.4 0 0 1 .7-1.5c-2.3-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.7 3.7 0 0 1 .1-2.7s.8-.3 2.8 1a9.9 9.9 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1a3.7 3.7 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.8-4.6 5a2.7 2.7 0 0 1 .8 2.1v3.1c0 .3.2.6.7.5A10 10 0 0 0 12 2.2Z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.2 3A2.2 2.2 0 1 1 3 5.2 2.2 2.2 0 0 1 5.2 3ZM3.5 8h3.4v12.5H3.5V8Zm5.5 0h3.2v1.8h.1a3.5 3.5 0 0 1 3.2-2c3.4 0 4 2.2 4 5.2v7.5h-3.4v-6.7c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5v6.8H9V8Z" />
    </svg>
  )
}

function KaggleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5a1 1 0 0 1 2 0v9.6l4.3-4.4a1 1 0 1 1 1.4 1.4L9.8 14l3 3.7a1 1 0 1 1-1.6 1.2L8.4 15.4 7 16.9v2.6a1 1 0 1 1-2 0V4.5Zm10.4 5.1a1 1 0 0 1 1.4.2l2.9 3.8 2.8-3.8a1 1 0 0 1 1.6 1.2l-3.1 4.1 3.1 4.1a1 1 0 1 1-1.6 1.2l-2.8-3.8-2.9 3.8a1 1 0 1 1-1.6-1.2l3.1-4.1-3.1-4.1a1 1 0 0 1 .2-1.4Z" />
    </svg>
  )
}

function TechChipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2.2a1 1 0 0 0-2 0v1.4a8.2 8.2 0 0 0-2.6 1.1L7.3 3.6a1 1 0 0 0-1.4 1.4L7 6.1A8.2 8.2 0 0 0 5.9 8.7H4.5a1 1 0 0 0 0 2h1.4A8.2 8.2 0 0 0 7 13.3l-1.1 1.1a1 1 0 1 0 1.4 1.4l1.1-1.1a8.2 8.2 0 0 0 2.6 1.1v1.4a1 1 0 0 0 2 0v-1.4a8.2 8.2 0 0 0 2.6-1.1l1.1 1.1a1 1 0 0 0 1.4-1.4L17 13.3a8.2 8.2 0 0 0 1.1-2.6h1.4a1 1 0 1 0 0-2h-1.4A8.2 8.2 0 0 0 17 6.1l1.1-1.1a1 1 0 0 0-1.4-1.4l-1.1 1.1A8.2 8.2 0 0 0 13 3.6V2.2Zm-1 5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    </svg>
  )
}

function CodeChipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7.6a1 1 0 0 1 0 1.4L5 12l3 3a1 1 0 0 1-1.4 1.4l-3.7-3.7a1 1 0 0 1 0-1.4l3.7-3.7A1 1 0 0 1 8 7.6Zm8 0a1 1 0 0 1 1.4 0l3.7 3.7a1 1 0 0 1 0 1.4l-3.7 3.7a1 1 0 1 1-1.4-1.4l3-3-3-3a1 1 0 0 1 0-1.4ZM13.9 4.4a1 1 0 0 1 .7 1.2l-3.1 12a1 1 0 0 1-1.9-.5l3.1-12a1 1 0 0 1 1.2-.7Z" />
    </svg>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7.2a4.8 4.8 0 1 0 4.8 4.8A4.8 4.8 0 0 0 12 7.2Zm0 7.6a2.8 2.8 0 1 1 2.8-2.8 2.8 2.8 0 0 1-2.8 2.8Z" />
      <path d="M12 2.4a1 1 0 0 1 1 1v1.3a1 1 0 1 1-2 0V3.4a1 1 0 0 1 1-1Zm0 16.9a1 1 0 0 1 1 1v1.3a1 1 0 1 1-2 0v-1.3a1 1 0 0 1 1-1ZM4.7 11a1 1 0 1 1 0 2H3.4a1 1 0 0 1 0-2h1.3Zm16 0a1 1 0 1 1 0 2h-1.3a1 1 0 0 1 0-2h1.3ZM6.5 5.1a1 1 0 0 1 1.4 0l.9.9A1 1 0 1 1 7.4 7.4l-.9-.9a1 1 0 0 1 0-1.4Zm9.7 9.7a1 1 0 0 1 1.4 0l.9.9a1 1 0 1 1-1.4 1.4l-.9-.9a1 1 0 0 1 0-1.4ZM18.5 5.1a1 1 0 0 1 0 1.4l-.9.9a1 1 0 0 1-1.4-1.4l.9-.9a1 1 0 0 1 1.4 0Zm-9.7 9.7a1 1 0 0 1 0 1.4l-.9.9a1 1 0 1 1-1.4-1.4l.9-.9a1 1 0 0 1 1.4 0Z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.9 3.3a1 1 0 0 1 .8 1.6 7.6 7.6 0 1 0 3.4 12.3 1 1 0 0 1 1.7.9 9.6 9.6 0 1 1-6.3-14.7h.4Z" />
    </svg>
  )
}

function BlogsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v14h12V5H6Z" />
      <path d="M8 8.2h8v1.7H8V8.2Zm0 3.6h8v1.7H8v-1.7Zm0 3.6h5.4v1.7H8v-1.7Z" />
    </svg>
  )
}

type WindowPos = {
  x: number
  y: number
}

type WindowSize = {
  width: number
  height: number
}

type WindowBounds = WindowPos & WindowSize

type DragState = {
  id: AppId
  pointerId: number
  startClientX: number
  startClientY: number
  startX: number
  startY: number
}

type ResizeState = {
  id: AppId
  pointerId: number
  startClientX: number
  startClientY: number
  startWidth: number
  startHeight: number
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#00A4EF" d="M3 3h8.6v8.6H3V3Z" />
      <path fill="#7FBA00" d="M12.9 3H21v8.6h-8.1V3Z" />
      <path fill="#FFB900" d="M3 12.9h8.6V21H3v-8.1Z" />
      <path fill="#F25022" d="M12.9 12.9H21V21h-8.1v-8.1Z" />
    </svg>
  )
}

function AboutIcon({ className }: { className?: string }) {
  return (
    <img className={className ? `${className} avatar-photo-icon` : 'avatar-photo-icon'} src={AVATAR_ICON_URL} alt="" aria-hidden="true" />
  )
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 4h4l2 2h4.2c1 0 1.8.8 1.8 1.8V18c0 1-.8 1.8-1.8 1.8H3.8C2.8 19.8 2 19 2 18V6.8C2 5.8 2.8 5 3.8 5H8l2-1Zm11.2 4.3H2.8V18c0 .6.4 1 1 1h16.4c.6 0 1-.4 1-1V8.3Z" />
      <path d="M10.1 10.8 6.9 12.7l3.2 1.9v1.3L5 13.4v-1.4l5.1-2.5v1.3Zm3.8 4.1 3.2-1.9-3.2-1.9V9.8L19 12.3v1.4l-5.1 2.5v-1.3Z" />
    </svg>
  )
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Zm0 2v.4l-8 5-8-5V8h16Zm0 8H4V9.7l7.5 4.7c.3.2.7.2 1 0L20 9.7V16Z" />
    </svg>
  )
}

function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.2 4h15.6A2.2 2.2 0 0 1 22 6.2v11.6a2.2 2.2 0 0 1-2.2 2.2H4.2A2.2 2.2 0 0 1 2 17.8V6.2A2.2 2.2 0 0 1 4.2 4Zm0 2a.2.2 0 0 0-.2.2v11.6c0 .1.1.2.2.2h15.6a.2.2 0 0 0 .2-.2V6.2a.2.2 0 0 0-.2-.2H4.2Z" />
      <path d="M7.3 10.5a1.9 1.9 0 1 1 1.9-1.9 1.9 1.9 0 0 1-1.9 1.9Zm0-2a.1.1 0 1 0 .1.1.1.1 0 0 0-.1-.1Zm12.2 7.5H4.5a1 1 0 0 1-.8-1.6l3.6-5a1 1 0 0 1 1.4-.2l2.2 1.6 2.3-3a1 1 0 0 1 1.5-.1l5.6 5.8a1 1 0 0 1-.8 1.7Z" />
    </svg>
  )
}

function SpeakerOnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 4 6.8 7.6H3a1 1 0 0 0-1 1v6.8a1 1 0 0 0 1 1h3.8L11 20V4Z" />
      <path d="M14.6 8.2a1 1 0 0 1 1.4 0 6.7 6.7 0 0 1 0 9.6 1 1 0 1 1-1.4-1.4 4.7 4.7 0 0 0 0-6.8 1 1 0 0 1 0-1.4Z" />
      <path d="M17.4 5.4a1 1 0 0 1 1.4 0 10.7 10.7 0 0 1 0 15.2 1 1 0 1 1-1.4-1.4 8.7 8.7 0 0 0 0-12.4 1 1 0 0 1 0-1.4Z" />
    </svg>
  )
}

function SpeakerOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 4 6.8 7.6H3a1 1 0 0 0-1 1v6.8a1 1 0 0 0 1 1h3.8L11 20V4Z" />
      <path d="M15.2 9.2a1 1 0 0 1 1.4 0L19 11.6l2.4-2.4a1 1 0 1 1 1.4 1.4L20.4 13l2.4 2.4a1 1 0 1 1-1.4 1.4L19 14.4l-2.4 2.4a1 1 0 0 1-1.4-1.4l2.4-2.4-2.4-2.4a1 1 0 0 1 0-1.4Z" />
    </svg>
  )
}

function ResumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h7.3L18 5.7V14a1 1 0 0 1-2 0V7h-3.3A1.7 1.7 0 0 1 11 5.3V2H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H7a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3Zm6 1.9V5a.3.3 0 0 0 .3.3H16l-3-3Z" />
      <path d="M18 16a1 1 0 0 1 1 1v2.6l.8-.8a1 1 0 1 1 1.4 1.4l-2.5 2.5a1 1 0 0 1-1.4 0l-2.5-2.5a1 1 0 1 1 1.4-1.4l.8.8V17a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

function App() {
  const [startOpen, setStartOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [startQuery, setStartQuery] = useState('')
  const [activeId, setActiveId] = useState<AppId>('about')
  const [now, setNow] = useState(() => new Date())
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))

  const taskbarReservedHeight = viewport.width < 700 ? 118 : 76
  const windowInset = viewport.width < 480 ? 6 : 8
  const forceFullscreenWindows = viewport.width < 640

  const [positions, setPositions] = useState<Record<AppId, WindowPos>>({
    about: { x: 160, y: 70 },
    projects: { x: 210, y: 110 },
    gallery: { x: 230, y: 110 },
    blogs: { x: 220, y: 100 },
    jobs: { x: 240, y: 130 },
    contact: { x: 240, y: 140 },
  })
  const [drag, setDrag] = useState<DragState | null>(null)
  const [resize, setResize] = useState<ResizeState | null>(null)
  const [sizes, setSizes] = useState<Record<AppId, WindowSize>>({
    about: { width: 840, height: 520 },
    projects: { width: 840, height: 520 },
    gallery: { width: 920, height: 560 },
    blogs: { width: 860, height: 540 },
    jobs: { width: 860, height: 560 },
    contact: { width: 620, height: 440 },
  })
  const [restoreBounds, setRestoreBounds] = useState<Record<AppId, WindowBounds | null>>({
    about: null,
    projects: null,
    gallery: null,
    blogs: null,
    jobs: null,
    contact: null,
  })
  const windowRefs = useRef<Record<AppId, HTMLElement | null>>({
    about: null,
    projects: null,
    gallery: null,
    blogs: null,
    jobs: null,
    contact: null,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(() => {
    const raw = window.localStorage.getItem('w11-muted')
    return raw === null ? true : raw === 'true'
  })
  const [audioReady, setAudioReady] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [soundToastOpen, setSoundToastOpen] = useState(false)
  const [soundToastText, setSoundToastText] = useState<string>('')
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<{ src: string; filename: string; displayName: string } | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const raw = window.localStorage.getItem('w11-theme')
    return raw === 'light' ? 'light' : 'dark'
  })

  const [windows, setWindows] = useState<Record<AppId, AppWindow>>({
    about: { id: 'about', title: 'About', isOpen: false, isMinimized: false, isMaximized: false },
    projects: { id: 'projects', title: 'Projects', isOpen: false, isMinimized: false, isMaximized: false },
    gallery: { id: 'gallery', title: 'Gallery', isOpen: false, isMinimized: false, isMaximized: false },
    blogs: { id: 'blogs', title: 'Blogs', isOpen: false, isMinimized: false, isMaximized: false },
    jobs: { id: 'jobs', title: 'Jobs', isOpen: false, isMinimized: false, isMaximized: false },
    contact: { id: 'contact', title: 'Contact', isOpen: false, isMinimized: false, isMaximized: false },
  })

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    function onResize() {
      const nextViewport = { width: window.innerWidth, height: window.innerHeight }
      const minWidth = nextViewport.width < 640 ? 300 : 420
      const minHeight = nextViewport.width < 640 ? 220 : 280

      const nextTaskbarReservedHeight = nextViewport.width < 700 ? 118 : 76

      const nextSizes = { ...sizes }
      let sizesChanged = false
      ;(Object.keys(sizes) as AppId[]).forEach((id) => {
        const maxWidth = Math.max(minWidth, nextViewport.width - 12)
        const maxHeight = Math.max(minHeight, nextViewport.height - nextTaskbarReservedHeight - 12)
        const width = Math.min(Math.max(minWidth, sizes[id].width), maxWidth)
        const height = Math.min(Math.max(minHeight, sizes[id].height), maxHeight)

        if (width !== sizes[id].width || height !== sizes[id].height) {
          sizesChanged = true
          nextSizes[id] = { width, height }
        }
      })

      if (sizesChanged) {
        setSizes(nextSizes)
      }

      const nextPositions = { ...positions }
      let positionsChanged = false
      ;(Object.keys(positions) as AppId[]).forEach((id) => {
        const size = nextSizes[id]
        const maxX = Math.max(0, nextViewport.width - size.width)
        const maxY = Math.max(0, nextViewport.height - size.height - nextTaskbarReservedHeight)
        const x = Math.min(Math.max(0, positions[id].x), maxX)
        const y = Math.min(Math.max(0, positions[id].y), maxY)

        if (x !== positions[id].x || y !== positions[id].y) {
          positionsChanged = true
          nextPositions[id] = { x, y }
        }
      })

      if (positionsChanged) {
        setPositions(nextPositions)
      }

      setViewport(nextViewport)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [positions, sizes])

  useEffect(() => {
    window.localStorage.setItem('w11-muted', String(muted))
  }, [muted])

  useEffect(() => {
    window.localStorage.setItem('w11-theme', theme)
  }, [theme])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.loop = true
    a.volume = 0.35
    a.muted = muted

    if (muted) {
      void a.play().catch(() => {
        // ignore; can still be blocked or file may be missing
      })
      return
    }

    void a.play().catch(() => {
      setMuted(true)
      setSoundToastText('Sound is blocked by the browser. Click Enable sound to start music.')
      setSoundToastOpen(true)
    })
  }, [muted])

  async function enableSoundFromUserGesture() {
    const a = audioRef.current
    if (!a) return
    a.muted = false
    try {
      await a.play()
      setMuted(false)
      setSoundToastOpen(false)
    } catch {
      setMuted(true)
      setSoundToastText('Sound is blocked. Try interacting with the page and click Enable sound again.')
      setSoundToastOpen(true)
    }
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function closeStartMenu() {
    setStartOpen(false)
    setStartQuery('')
  }

  function toggleStartMenu() {
    if (startOpen) {
      setStartQuery('')
    }
    setStartOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!drag) return

    const d = drag

    function onMove(e: PointerEvent) {
      if (e.pointerId !== d.pointerId) return

      const el = windowRefs.current[d.id]
      const rect = el?.getBoundingClientRect()
      const w = rect?.width ?? 0
      const h = rect?.height ?? 0

      const dx = e.clientX - d.startClientX
      const dy = e.clientY - d.startClientY

      const rawX = d.startX + dx
      const rawY = d.startY + dy

      const maxX = Math.max(0, window.innerWidth - w)
      const maxY = Math.max(0, window.innerHeight - h - taskbarReservedHeight)

      const x = Math.min(Math.max(0, rawX), maxX)
      const y = Math.min(Math.max(0, rawY), maxY)

      setPositions((prev) => ({
        ...prev,
        [d.id]: { x, y },
      }))
    }

    function onUp(e: PointerEvent) {
      if (e.pointerId !== d.pointerId) return
      setDrag(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [drag])

  useEffect(() => {
    if (!resize) return

    const r = resize

    function onMove(e: PointerEvent) {
      if (e.pointerId !== r.pointerId) return
      if (windows[r.id].isMaximized) return

      const dx = e.clientX - r.startClientX
      const dy = e.clientY - r.startClientY

      const minWidth = viewport.width < 640 ? 300 : 420
      const minHeight = viewport.width < 640 ? 220 : 280
      const maxWidth = Math.max(minWidth, window.innerWidth - positions[r.id].x)
      const maxHeight = Math.max(minHeight, window.innerHeight - taskbarReservedHeight - positions[r.id].y)

      const width = Math.min(Math.max(minWidth, r.startWidth + dx), maxWidth)
      const height = Math.min(Math.max(minHeight, r.startHeight + dy), maxHeight)

      setSizes((prev) => ({
        ...prev,
        [r.id]: { width, height },
      }))
    }

    function onUp(e: PointerEvent) {
      if (e.pointerId !== r.pointerId) return
      setResize(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [positions, resize, taskbarReservedHeight, viewport.width, windows])

  const pinnedApps = useMemo(
    () =>
      [
        { id: 'about' as const, label: 'About' },
        { id: 'projects' as const, label: 'Projects' },
        { id: 'gallery' as const, label: 'Gallery' },
        { id: 'blogs' as const, label: 'Blogs' },
        { id: 'jobs' as const, label: 'Jobs' },
        { id: 'contact' as const, label: 'Contact' },
      ],
    [],
  )

  const allOptions = useMemo(
    () => [
      { key: 'about', label: 'About', description: 'Profile, education and skills', type: 'app' as const, appId: 'about' as const },
      { key: 'projects', label: 'Projects', description: 'AI, NLP and data engineering work', type: 'app' as const, appId: 'projects' as const },
      { key: 'gallery', label: 'Gallery', description: 'Photos loaded from /public/gallery', type: 'app' as const, appId: 'gallery' as const },
      { key: 'blogs', label: 'Blogs', description: 'Posts from kaus98.github.io', type: 'app' as const, appId: 'blogs' as const },
      { key: 'jobs', label: 'Jobs', description: 'Experience and internships', type: 'app' as const, appId: 'jobs' as const },
      { key: 'contact', label: 'Contact', description: 'Email, phone and social links', type: 'app' as const, appId: 'contact' as const },
      { key: 'resume', label: 'Resume', description: 'Download PDF resume', type: 'resume' as const },
      {
        key: 'theme',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        description: 'Theme appearance toggle',
        type: 'theme' as const,
      },
      {
        key: 'sound',
        label: muted ? 'Unmute music' : 'Mute music',
        description: 'Background audio toggle',
        type: 'sound' as const,
      },
    ],
    [muted, theme],
  )

  const normalizedStartQuery = startQuery.trim().toLowerCase()
  const normalizedQuery = query.trim().toLowerCase()

  const filteredPinnedApps = pinnedApps.filter((app) => app.label.toLowerCase().includes(normalizedStartQuery))
  const filteredAllOptions = allOptions.filter(
    (item) =>
      item.label.toLowerCase().includes(normalizedStartQuery) || item.description.toLowerCase().includes(normalizedStartQuery),
  )

  const about = portfolioData.about
  const contact = portfolioData.contact
  const technologyChips = about.technologies
  const programmingChips = about.programming
  const userName = about.name

  const socialIconMap = {
    instagram: InstagramIcon,
    github: GithubIcon,
    linkedin: LinkedInIcon,
    kaggle: KaggleIcon,
  } as const

  const socialLinks = portfolioData.socialLinks.map((link) => ({
    ...link,
    Icon: socialIconMap[link.key],
  }))

  const galleryPhotos = useMemo(
    () =>
      Object.entries(galleryImageModules)
        .map(([filePath, src]) => {
          const filename = filePath.split('/').pop() ?? filePath
          const displayName = filename
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
          return {
            src: src.replace('/public', ''),
            filename,
            displayName: displayName || filename,
          }
        })
        .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' })),
    [],
  )

  const jobExperiences = portfolioData.jobs
  const blogPosts = portfolioData.blogs

  const searchedJobs = jobExperiences.filter((job) => {
    if (!normalizedQuery) return true
    const haystack = `${job.company} ${job.role} ${job.period ?? ''} ${job.highlights.join(' ')}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })

  const filteredFullTimeJobs = searchedJobs
    .filter((job) => job.employmentType === 'full-time')
    .sort((a, b) => b.sortOrder - a.sortOrder)
  const filteredInternshipJobs = searchedJobs
    .filter((job) => job.employmentType === 'internship')
    .sort((a, b) => b.sortOrder - a.sortOrder)

  const fullTimeJobs = jobExperiences
    .filter((job) => job.employmentType === 'full-time')
    .sort((a, b) => b.sortOrder - a.sortOrder)
  const internshipJobs = jobExperiences
    .filter((job) => job.employmentType === 'internship')
    .sort((a, b) => b.sortOrder - a.sortOrder)

  const projectCards = portfolioData.projects
  const certifications = portfolioData.certifications

  const filteredProjectCards = projectCards.filter((project) => {
    if (!normalizedQuery) return true
    const haystack = `${project.title} ${project.subtitle} ${project.description}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })

  const filteredBlogPosts = blogPosts.filter((post) => {
    if (!normalizedQuery) return true
    const haystack = `${post.title} ${post.date} ${post.summary}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })

  const searchWindowStyle = {
    zIndex: 5,
    left: Math.max(8, Math.floor((viewport.width - Math.min(760, viewport.width - 16)) / 2)),
    top: viewport.width < 700 ? 8 : 48,
    width: Math.min(760, viewport.width - 16),
    height: Math.max(240, Math.min(500, viewport.height - taskbarReservedHeight - 16)),
  }

  function openApp(id: AppId) {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false },
    }))
    setActiveId(id)
    closeStartMenu()
  }

  function toggleSoundFromMenu() {
    const a = audioRef.current
    if (!a) return

    if (!audioReady) {
      a.load()
    }

    if (!muted) {
      setMuted(true)
      return
    }

    a.muted = false
    void a.play()
      .then(() => {
        setMuted(false)
        setSoundToastOpen(false)
      })
      .catch(() => {
        setMuted(true)
        setSoundToastText('Sound is blocked by the browser. Click Enable sound to start music.')
        setSoundToastOpen(true)
      })
  }

  function openStartOption(option: (typeof allOptions)[number]) {
    if (option.type === 'app') {
      openApp(option.appId)
      return
    }

    if (option.type === 'theme') {
      toggleTheme()
      return
    }

    if (option.type === 'sound') {
      toggleSoundFromMenu()
      return
    }

    const a = document.createElement('a')
    a.href = './Kaustubh_Pathak_Resume.pdf'
    a.download = ''
    a.click()
    closeStartMenu()
  }

  function toggleMinimize(id: AppId) {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: !prev[id].isMinimized },
    }))
    setActiveId(id)
  }

  function toggleMaximize(id: AppId) {
    setWindows((prev) => {
      const w = prev[id]

      if (!w.isMaximized) {
        setRestoreBounds((boundsPrev) => ({
          ...boundsPrev,
          [id]: {
            x: positions[id].x,
            y: positions[id].y,
            width: sizes[id].width,
            height: sizes[id].height,
          },
        }))

        return {
          ...prev,
          [id]: { ...w, isMaximized: true, isMinimized: false },
        }
      }

      const restore = restoreBounds[id]
      if (restore) {
        setPositions((posPrev) => ({
          ...posPrev,
          [id]: { x: restore.x, y: restore.y },
        }))
        setSizes((sizePrev) => ({
          ...sizePrev,
          [id]: { width: restore.width, height: restore.height },
        }))
      }

      return {
        ...prev,
        [id]: { ...w, isMaximized: false },
      }
    })
    setActiveId(id)
  }

  function closeApp(id: AppId) {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false },
    }))
    setActiveId('about')
  }

  const visibleWindowIds = (Object.keys(windows) as AppId[]).filter(
    (id) => windows[id].isOpen && !windows[id].isMinimized,
  )

  const timeText = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateText = now.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <div className={drag || resize ? `w11 ${theme} dragging` : `w11 ${theme}`}>
      <div className="wallpaper" aria-hidden="true" />
      <audio
        ref={audioRef}
        src="./audio/background.mp3"
        preload="auto"
        onCanPlay={() => {
          setAudioReady(true)
          setAudioError(false)
        }}
        onError={() => {
          setAudioReady(false)
          setAudioError(true)
          setSoundToastText('Music file not found. Add /public/audio/background.mp3 to enable sound.')
          setSoundToastOpen(true)
        }}
      />

      {soundToastOpen && (
        <div className="toast" role="status" aria-live="polite" onMouseDown={(e) => e.stopPropagation()}>
          <div className="toast-title">Sound</div>
          <div className="toast-text">{soundToastText}</div>
          <div className="toast-actions">
            <button className="toast-btn primary" type="button" onClick={() => void enableSoundFromUserGesture()} disabled={audioError}>
              Enable sound
            </button>
            <button className="toast-btn" type="button" onClick={() => setSoundToastOpen(false)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="desktop" onMouseDown={closeStartMenu}>
        <div className="desktop-icons">
          <button className="desktop-icon" type="button" onClick={() => openApp('about')}>
            <span className="app-icon about" aria-hidden="true">
              <AboutIcon className="icon" />
            </span>
            <span className="desktop-icon-label">About</span>
          </button>
          <button className="desktop-icon" type="button" onClick={() => openApp('projects')}>
            <span className="app-icon projects" aria-hidden="true">
              <ProjectsIcon className="icon" />
            </span>
            <span className="desktop-icon-label">Projects</span>
          </button>
          <button className="desktop-icon" type="button" onClick={() => openApp('gallery')}>
            <span className="app-icon gallery" aria-hidden="true">
              <GalleryIcon className="icon" />
            </span>
            <span className="desktop-icon-label">Gallery</span>
          </button>
          <button className="desktop-icon" type="button" onClick={() => openApp('blogs')}>
            <span className="app-icon blogs" aria-hidden="true">
              <BlogsIcon className="icon" />
            </span>
            <span className="desktop-icon-label">Blogs</span>
          </button>
          <button className="desktop-icon" type="button" onClick={() => openApp('jobs')}>
            <span className="app-icon projects" aria-hidden="true">
              <JobsIcon className="icon" />
            </span>
            <span className="desktop-icon-label">Jobs</span>
          </button>
          <button className="desktop-icon" type="button" onClick={() => openApp('contact')}>
            <span className="app-icon contact" aria-hidden="true">
              <ContactIcon className="icon" />
            </span>
            <span className="desktop-icon-label">Contact</span>
          </button>
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
            const maximizedHeight = Math.max(220, viewport.height - taskbarReservedHeight)
            const fullscreenHeight = Math.max(220, viewport.height - taskbarReservedHeight - windowInset * 2)

            return (
              <section
                key={id}
                className={isActive ? (isMaximized ? 'window active maximized' : 'window active') : isMaximized ? 'window maximized' : 'window'}
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
                    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
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
                  {id === 'about' && (
                    <div className="panel full-panel">
                      <h1 className="big-title">{about.name}</h1>
                      <p className="muted">{about.rolesLine}</p>
                      <p className="muted">{about.location}</p>
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
                                onClick={() => setActiveGalleryPhoto(photo)}
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
                        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setActiveGalleryPhoto(null)}>
                          <div className="gallery-lightbox-card" onClick={(e) => e.stopPropagation()}>
                            <div className="gallery-lightbox-header">
                              <button
                                className="gallery-lightbox-close-floating"
                                type="button"
                                aria-label="Close image"
                                onClick={() => setActiveGalleryPhoto(null)}
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
                </div>

                {!isMaximized && (
                  <div
                    className="window-resize-handle"
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      setActiveId(id)
                      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
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
            <section
              className="window active search-results-window"
              style={searchWindowStyle}
              onMouseDown={(e) => e.stopPropagation()}
            >
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

      {startOpen && (
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
                        : a.id === 'gallery'
                          ? 'app-icon gallery'
                        : a.id === 'blogs'
                          ? 'app-icon blogs'
                        : a.id === 'jobs'
                          ? 'app-icon projects'
                          : 'app-icon contact'
                  }
                  aria-hidden="true"
                >
                  {a.id === 'about' ? (
                    <AboutIcon className="icon" />
                  ) : a.id === 'projects' ? (
                    <ProjectsIcon className="icon" />
                  ) : a.id === 'gallery' ? (
                    <GalleryIcon className="icon" />
                  ) : a.id === 'blogs' ? (
                    <BlogsIcon className="icon" />
                  ) : a.id === 'jobs' ? (
                    <JobsIcon className="icon" />
                  ) : (
                    <ContactIcon className="icon" />
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
                        : option.key === 'contact'
                          ? 'app-icon small contact'
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
                  ) : option.key === 'contact' ? (
                    <ContactIcon className="icon" />
                  ) : option.key === 'theme' ? (
                    theme === 'dark' ? <SunIcon className="icon" /> : <MoonIcon className="icon" />
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
            <a className="start-resume-link" href="./Kaustubh_Pathak_Resume.pdf" download>
              Resume
            </a>
          </div>
        </div>
      )}

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
                            : a.id === 'blogs'
                              ? 'app-icon blogs'
                            : a.id === 'jobs'
                              ? 'app-icon projects'
                              : 'app-icon contact'
                      }
                      aria-hidden="true"
                    >
                      {a.id === 'about' ? (
                        <AboutIcon className="icon" />
                      ) : a.id === 'projects' ? (
                        <ProjectsIcon className="icon" />
                      ) : a.id === 'blogs' ? (
                        <BlogsIcon className="icon" />
                      ) : a.id === 'jobs' ? (
                        <JobsIcon className="icon" />
                      ) : (
                        <ContactIcon className="icon" />
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
              <button
                className="tray-btn"
                type="button"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <SunIcon className="tray-svg" /> : <MoonIcon className="tray-svg" />}
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
    </div>
  )
}

export default App
