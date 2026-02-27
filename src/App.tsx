import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { portfolioData } from './data/portfolioData'
import {
  GALLERY_LIGHTBOX_TRANSITION_MS,
  WINDOW_PANEL_TRANSITION_MS,
  galleryImageModules,
  initialClosingWindows,
  initialPositions,
  initialRestoreBounds,
  initialSizes,
  initialWindows,
  isThemeName,
  pinnedApps,
  themeOptions,
  type ThemeName,
} from './app/constants'
import {
  GithubIcon,
  InstagramIcon,
  KaggleIcon,
  LinkedInIcon,
} from './app/icons'
import { DesktopWindows } from './app/DesktopWindows'
import { StartMenu, type StartMenuOption } from './app/StartMenu'
import { Taskbar } from './app/Taskbar'
import type { AppId, AppWindow, DragState, GalleryPhoto, ResizeState, TerminalLine, WindowBounds, WindowPos, WindowSize } from './app/types'

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

  const [positions, setPositions] = useState<Record<AppId, WindowPos>>(initialPositions)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [resize, setResize] = useState<ResizeState | null>(null)
  const [sizes, setSizes] = useState<Record<AppId, WindowSize>>(initialSizes)
  const [restoreBounds, setRestoreBounds] = useState<Record<AppId, WindowBounds | null>>(initialRestoreBounds)
  const [closingWindows, setClosingWindows] = useState<Record<AppId, boolean>>(initialClosingWindows)
  const closeWindowTimeouts = useRef<Partial<Record<AppId, number>>>({})
  const windowRefs = useRef<Record<AppId, HTMLElement | null>>({
    about: null,
    projects: null,
    gallery: null,
    blogs: null,
    jobs: null,
    timeline: null,
    contact: null,
    settings: null,
    terminal: null,
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
  const [isSleeping, setIsSleeping] = useState(false)
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<GalleryPhoto | null>(null)
  const [isGalleryLightboxOpen, setIsGalleryLightboxOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeName>(() => {
    const raw = window.localStorage.getItem('w11-theme')
    return isThemeName(raw) ? raw : 'matrix'
  })

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { id: 1, text: 'Kaus OS Terminal v1.0.0', tone: 'system' },
    { id: 2, text: "Type 'help' to list available commands.", tone: 'system' },
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [, setTerminalHistoryIndex] = useState(-1)

  const [windows, setWindows] = useState<Record<AppId, AppWindow>>(initialWindows)

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

  function pushTerminalLines(lines: Array<{ text: string; tone: TerminalLine['tone'] }>) {
    if (lines.length === 0) return
    setTerminalLines((prev) => {
      let nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1
      const appended = lines.map((line) => {
        const entry: TerminalLine = { id: nextId, text: line.text, tone: line.tone }
        nextId += 1
        return entry
      })
      return [...prev, ...appended]
    })
  }

  function downloadResume() {
    const anchor = document.createElement('a')
    anchor.href = './Kaustubh_Pathak_Resume.pdf'
    anchor.download = ''
    anchor.click()
  }

  function resolveAppId(token: string | undefined): AppId | null {
    if (!token) return null
    const normalized = token.toLowerCase()
    const appAliasMap: Record<string, AppId> = {
      about: 'about',
      project: 'projects',
      projects: 'projects',
      gallery: 'gallery',
      blog: 'blogs',
      blogs: 'blogs',
      job: 'jobs',
      jobs: 'jobs',
      timeline: 'timeline',
      contact: 'contact',
      setting: 'settings',
      settings: 'settings',
      terminal: 'terminal',
    }
    return appAliasMap[normalized] ?? null
  }

  function maximizeApp(id: AppId) {
    setRestoreBounds((boundsPrev) => ({
      ...boundsPrev,
      [id]: boundsPrev[id] ?? {
        x: positions[id].x,
        y: positions[id].y,
        width: sizes[id].width,
        height: sizes[id].height,
      },
    }))

    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, isMaximized: true },
    }))
    setActiveId(id)
  }

  function getTerminalHelpLines() {
    return [
      'Core: help, clear, history, date, time, echo <text>, man <command>',
      'Navigation: apps, open <app>, close <app>, minimize <app>, maximize <app>',
      'Apps: about, projects, gallery, blogs, jobs, timeline, contact, settings, terminal',
      'System: resume, theme list, theme set <name>, theme next, sound on/off/toggle',
      'Profile: whoami, skills, social, neofetch, matrix, fortune, joke',
      'Aliases: ls=apps, cls=clear, cv=resume',
    ]
  }

  function runTerminalCommand(rawInput: string) {
    const commandText = rawInput.trim()
    if (!commandText) return

    pushTerminalLines([{ text: `C:/Users/${userName}> ${commandText}`, tone: 'input' }])
    setTerminalHistory((prev) => [...prev, commandText])
    setTerminalHistoryIndex(-1)

    const [rawCommand, ...args] = commandText.split(/\s+/)
    const aliases: Record<string, string> = { ls: 'apps', cls: 'clear', cv: 'resume' }
    const command = aliases[rawCommand.toLowerCase()] ?? rawCommand.toLowerCase()

    const pushOutput = (...text: string[]) => pushTerminalLines(text.map((line) => ({ text: line, tone: 'output' as const })))
    const pushError = (text: string) => pushTerminalLines([{ text, tone: 'error' }])
    const pushSystem = (...text: string[]) => pushTerminalLines(text.map((line) => ({ text: line, tone: 'system' as const })))

    if (command === 'clear') {
      setTerminalLines([])
      setTerminalInput('')
      return
    }

    switch (command) {
      case 'help':
        pushOutput(...getTerminalHelpLines())
        break
      case 'history':
        pushOutput(...(terminalHistory.length ? terminalHistory.map((entry, index) => `${index + 1}. ${entry}`) : ['No commands in history yet.']))
        break
      case 'date':
        pushOutput(now.toLocaleDateString())
        break
      case 'time':
        pushOutput(now.toLocaleTimeString())
        break
      case 'echo':
        pushOutput(args.join(' '))
        break
      case 'man': {
        const topic = args[0]?.toLowerCase()
        if (!topic) {
          pushError('Usage: man <command>')
        } else if (topic === 'theme') {
          pushOutput('theme list | theme set <name> | theme next')
        } else if (topic === 'sound') {
          pushOutput('sound on | sound off | sound toggle')
        } else if (topic === 'open') {
          pushOutput('open <app-name>  # about/projects/gallery/blogs/jobs/timeline/contact/settings/terminal')
        } else {
          pushOutput(`No manual entry for '${topic}'.`)
        }
        break
      }
      case 'apps':
        pushOutput('Installed apps: about, projects, gallery, blogs, jobs, timeline, contact, settings, terminal')
        break
      case 'open': {
        const appId = resolveAppId(args[0])
        if (!appId) {
          pushError('Unknown app. Try: open projects')
          break
        }
        openApp(appId)
        pushSystem(`Opened ${appId}.`)
        break
      }
      case 'close': {
        const appId = resolveAppId(args[0])
        if (!appId) {
          pushError('Unknown app. Try: close projects')
          break
        }
        closeApp(appId)
        pushSystem(`Closing ${appId}.`)
        break
      }
      case 'minimize': {
        const appId = resolveAppId(args[0])
        if (!appId) {
          pushError('Unknown app. Try: minimize projects')
          break
        }
        toggleMinimize(appId)
        pushSystem(`Toggled minimize for ${appId}.`)
        break
      }
      case 'maximize': {
        const appId = resolveAppId(args[0])
        if (!appId) {
          pushError('Unknown app. Try: maximize projects')
          break
        }
        maximizeApp(appId)
        pushSystem(`Maximized ${appId}.`)
        break
      }
      case 'about':
      case 'projects':
      case 'gallery':
      case 'blogs':
      case 'jobs':
      case 'timeline':
      case 'contact':
      case 'settings':
      case 'terminal':
        openApp(command)
        pushSystem(`Opened ${command}.`)
        break
      case 'resume':
        downloadResume()
        pushSystem('Resume download started.')
        break
      case 'theme': {
        const sub = args[0]?.toLowerCase()
        if (sub === 'list') {
          pushOutput(`Themes: ${themeOptions.map((item) => item.id).join(', ')}`)
        } else if (sub === 'next') {
          toggleTheme()
          pushSystem('Switched to next theme.')
        } else if (sub === 'set') {
          const next = args[1]?.toLowerCase() ?? null
          if (!next || !isThemeName(next)) {
            pushError('Usage: theme set <name>  # use theme list')
            break
          }
          applyTheme(next)
          pushSystem(`Theme set to ${next}.`)
        } else {
          pushError('Usage: theme list | theme set <name> | theme next')
        }
        break
      }
      case 'sound': {
        const sub = args[0]?.toLowerCase()
        if (sub === 'toggle') {
          toggleSoundFromMenu()
          pushSystem('Sound toggled.')
        } else if (sub === 'on') {
          if (muted) {
            toggleSoundFromMenu()
            pushSystem('Attempting to enable sound.')
          } else {
            pushOutput('Sound is already on.')
          }
        } else if (sub === 'off') {
          if (muted) {
            pushOutput('Sound is already off.')
          } else {
            setMuted(true)
            pushSystem('Sound muted.')
          }
        } else {
          pushError('Usage: sound on | sound off | sound toggle')
        }
        break
      }
      case 'whoami':
        pushOutput(`${about.name} - ${about.rolesLine}`)
        break
      case 'skills':
        pushOutput(`Technologies: ${technologyChips.join(', ')}`)
        pushOutput(`Programming: ${programmingChips.join(', ')}`)
        break
      case 'social':
        pushOutput(...socialLinks.map((item) => `${item.label}: ${item.href}`))
        break
      case 'matrix': {
        const glyphs = '01#@$%&*+'
        const rows = Array.from({ length: 8 }, () => Array.from({ length: 34 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join(''))
        pushOutput(...rows)
        break
      }
      case 'neofetch':
        pushOutput('Kaus-OS', `User: ${about.name}`, `Role: ${about.rolesLine}`, `Location: ${about.location}`, `Theme: ${theme}`)
        break
      case 'fortune': {
        const fortunes = ['Stay curious, keep shipping.', 'Small commits build big products.', 'Data tells stories if you ask the right questions.']
        pushOutput(fortunes[Math.floor(Math.random() * fortunes.length)])
        break
      }
      case 'joke': {
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs.',
          'There are 10 types of people: those who understand binary and those who do not.',
          'I would tell you a UDP joke, but you might not get it.',
        ]
        pushOutput(jokes[Math.floor(Math.random() * jokes.length)])
        break
      }
      default:
        pushError(`Unknown command: ${command}. Type 'help' to see available commands.`)
    }

    setTerminalInput('')
  }

  function navigateTerminalHistory(direction: 'up' | 'down') {
    if (terminalHistory.length === 0) return

    setTerminalHistoryIndex((prev) => {
      if (direction === 'up') {
        const nextIndex = prev === -1 ? terminalHistory.length - 1 : Math.max(0, prev - 1)
        setTerminalInput(terminalHistory[nextIndex])
        return nextIndex
      }

      if (prev === -1) return -1
      const nextIndex = prev + 1
      if (nextIndex >= terminalHistory.length) {
        setTerminalInput('')
        return -1
      }

      setTerminalInput(terminalHistory[nextIndex])
      return nextIndex
    })
  }

  function autocompleteTerminalInput() {
    const value = terminalInput.trimStart()
    if (!value) return

    if (value.includes(' ')) {
      const [command, ...rest] = value.split(/\s+/)
      if (command.toLowerCase() === 'theme' && rest.length === 2 && rest[0].toLowerCase() === 'set') {
        const partial = rest[1].toLowerCase()
        const matches = themeOptions.map((item) => item.id).filter((name) => name.startsWith(partial))
        if (matches.length === 1) {
          setTerminalInput(`theme set ${matches[0]}`)
        }
      }
      return
    }

    const commandCatalog = [
      'help', 'clear', 'history', 'date', 'time', 'echo', 'man', 'apps', 'open', 'close', 'minimize', 'maximize',
      'about', 'projects', 'gallery', 'blogs', 'jobs', 'timeline', 'contact', 'settings', 'terminal',
      'resume', 'theme', 'sound', 'whoami', 'skills', 'social', 'matrix', 'neofetch', 'fortune', 'joke',
      'ls', 'cls', 'cv',
    ]
    const partial = value.toLowerCase()
    const matches = commandCatalog.filter((item) => item.startsWith(partial))
    if (matches.length === 1) {
      setTerminalInput(matches[0])
      return
    }

    if (matches.length > 1) {
      pushTerminalLines([{ text: `Suggestions: ${matches.join(', ')}`, tone: 'system' }])
    }
  }

  useEffect(() => {
    if (!activeGalleryPhoto) return
    const frame = window.requestAnimationFrame(() => setIsGalleryLightboxOpen(true))
    return () => window.cancelAnimationFrame(frame)
  }, [activeGalleryPhoto])

  useEffect(() => {
    if (!activeGalleryPhoto || isGalleryLightboxOpen) return
    const timeout = window.setTimeout(() => {
      setActiveGalleryPhoto(null)
    }, GALLERY_LIGHTBOX_TRANSITION_MS)

    return () => window.clearTimeout(timeout)
  }, [activeGalleryPhoto, isGalleryLightboxOpen])

  useEffect(
    () => () => {
      Object.values(closeWindowTimeouts.current).forEach((timeoutId) => {
        if (typeof timeoutId === 'number') {
          window.clearTimeout(timeoutId)
        }
      })
    },
    [],
  )

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
    setTheme((prev) => {
      const currentIndex = themeOptions.findIndex((themeOption) => themeOption.id === prev)
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeOptions.length
      return themeOptions[nextIndex].id
    })
  }

  function applyTheme(nextTheme: ThemeName) {
    setTheme(nextTheme)
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

  const allOptions = useMemo<StartMenuOption[]>(
    () => [
      { key: 'about', label: 'About', description: 'Profile, education and skills', type: 'app' as const, appId: 'about' as const },
      { key: 'projects', label: 'Projects', description: 'AI, NLP and data engineering work', type: 'app' as const, appId: 'projects' as const },
      { key: 'gallery', label: 'Gallery', description: 'Photos loaded from /public/gallery', type: 'app' as const, appId: 'gallery' as const },
      { key: 'blogs', label: 'Blogs', description: 'Posts from kaus98.github.io', type: 'app' as const, appId: 'blogs' as const },
      { key: 'jobs', label: 'Jobs', description: 'Experience and internships', type: 'app' as const, appId: 'jobs' as const },
      { key: 'timeline', label: 'Timeline', description: 'Career milestones and dated journey', type: 'app' as const, appId: 'timeline' as const },
      { key: 'contact', label: 'Contact', description: 'Email, phone and social links', type: 'app' as const, appId: 'contact' as const },
      { key: 'settings', label: 'Settings', description: 'Theme, sound and time controls', type: 'app' as const, appId: 'settings' as const },
      { key: 'terminal', label: 'Terminal', description: 'Command line tools and shortcuts', type: 'app' as const, appId: 'terminal' as const },
      { key: 'resume', label: 'Resume', description: 'Download PDF resume', type: 'resume' as const },
      {
        key: 'theme',
        label: `Cycle theme (${themeOptions.find((themeOption) => themeOption.id === theme)?.label ?? 'Matrix'})`,
        description: 'Rotate between visual styles',
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

  const filteredPinnedApps = pinnedApps.filter(
    (app) => app.id !== 'terminal' && app.label.toLowerCase().includes(normalizedStartQuery),
  )
  const filteredAllOptions = allOptions.filter(
    (item) =>
      item.label.toLowerCase().includes(normalizedStartQuery) || item.description.toLowerCase().includes(normalizedStartQuery),
  )

  const about = portfolioData.about
  const contact = portfolioData.contact
  const availability = contact.availability
  const timelineItems = [...portfolioData.timeline].sort((a, b) => b.sortOrder - a.sortOrder)
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
    const closeTimeoutId = closeWindowTimeouts.current[id]
    if (typeof closeTimeoutId === 'number') {
      window.clearTimeout(closeTimeoutId)
      delete closeWindowTimeouts.current[id]
    }

    setClosingWindows((prev) => ({ ...prev, [id]: false }))
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

  function openStartOption(option: StartMenuOption) {
    if (option.type === 'app') {
      if (!option.appId) return
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

  function runPowerAction(action: 'restart' | 'sleep' | 'shutdown') {
    closeStartMenu()

    if (action === 'restart') {
      window.location.reload()
      return
    }

    if (action === 'sleep') {
      setIsSleeping(true)
      return
    }

    window.close()
    window.location.href = 'about:blank'
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
    if (closingWindows[id]) return

    const closeTimeoutId = closeWindowTimeouts.current[id]
    if (typeof closeTimeoutId === 'number') {
      window.clearTimeout(closeTimeoutId)
    }

    setClosingWindows((prev) => ({ ...prev, [id]: true }))
    closeWindowTimeouts.current[id] = window.setTimeout(() => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false },
      }))
      setClosingWindows((prev) => ({ ...prev, [id]: false }))
      setActiveId((prev) => (prev === id ? 'about' : prev))
      delete closeWindowTimeouts.current[id]
    }, WINDOW_PANEL_TRANSITION_MS)
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
      {isSleeping && (
        <div className="sleep-overlay" role="dialog" aria-label="Sleep mode" onClick={() => setIsSleeping(false)}>
          <button
            className="sleep-wake-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsSleeping(false)
            }}
          >
            Wake screen
          </button>
        </div>
      )}
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

      <DesktopWindows
        windows={windows}
        activeId={activeId}
        positions={positions}
        sizes={sizes}
        closingWindows={closingWindows}
        viewport={viewport}
        taskbarReservedHeight={taskbarReservedHeight}
        windowInset={windowInset}
        forceFullscreenWindows={forceFullscreenWindows}
        windowRefs={windowRefs}
        setActiveId={setActiveId}
        setDrag={setDrag}
        setResize={setResize}
        toggleMinimize={toggleMinimize}
        toggleMaximize={toggleMaximize}
        closeApp={closeApp}
        closeStartMenu={closeStartMenu}
        openApp={openApp}
        socialLinks={socialLinks}
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
        normalizedQuery={normalizedQuery}
        searchWindowStyle={searchWindowStyle}
        query={query}
        setQuery={setQuery}
        filteredProjectCards={filteredProjectCards}
        filteredBlogPosts={filteredBlogPosts}
        searchedJobs={searchedJobs}
        filteredFullTimeJobs={filteredFullTimeJobs}
        filteredInternshipJobs={filteredInternshipJobs}
      />

      <StartMenu
        startOpen={startOpen}
        startQuery={startQuery}
        setStartQuery={setStartQuery}
        filteredPinnedApps={filteredPinnedApps}
        filteredAllOptions={filteredAllOptions}
        openApp={openApp}
        openStartOption={openStartOption}
        socialLinks={socialLinks}
        theme={theme}
        applyTheme={applyTheme}
        muted={muted}
        userName={userName}
        runPowerAction={runPowerAction}
      />

      <Taskbar
        startOpen={startOpen}
        toggleStartMenu={toggleStartMenu}
        query={query}
        setQuery={setQuery}
        windows={windows}
        activeId={activeId}
        visibleWindowIds={visibleWindowIds}
        toggleMinimize={toggleMinimize}
        setActiveId={setActiveId}
        openApp={openApp}
        toggleTheme={toggleTheme}
        theme={theme}
        muted={muted}
        audioError={audioError}
        toggleSoundFromMenu={toggleSoundFromMenu}
        timeText={timeText}
        dateText={dateText}
      />
    </div>
  )
}

export default App
