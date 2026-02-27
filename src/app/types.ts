export type AppId = 'about' | 'projects' | 'gallery' | 'blogs' | 'jobs' | 'timeline' | 'contact' | 'settings' | 'terminal'

export type AppWindow = {
  id: AppId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
}

export type WindowPos = {
  x: number
  y: number
}

export type WindowSize = {
  width: number
  height: number
}

export type WindowBounds = WindowPos & WindowSize

export type DragState = {
  id: AppId
  pointerId: number
  startClientX: number
  startClientY: number
  startX: number
  startY: number
}

export type ResizeState = {
  id: AppId
  pointerId: number
  startClientX: number
  startClientY: number
  startWidth: number
  startHeight: number
}

export type GalleryPhoto = {
  src: string
  filename: string
  displayName: string
}

export type TerminalLineTone = 'input' | 'output' | 'error' | 'system'

export type TerminalLine = {
  id: number
  text: string
  tone: TerminalLineTone
}
