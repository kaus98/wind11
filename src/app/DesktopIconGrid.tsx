import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
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
import type { AppId } from './types'

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

type DesktopIconGridProps = {
    viewport: { width: number; height: number }
    taskbarReservedHeight: number
    openApp: (id: AppId) => void
}

export function DesktopIconGrid({ viewport, taskbarReservedHeight, openApp }: DesktopIconGridProps) {
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
            // Unsnapped direct follow
            setIconPositions((prev) => ({
                ...prev,
                [dragState.id]: { x, y },
            }))
        }

        function onMouseUp() {
            const dragState = dragStateRef.current
            if (dragState?.moved) {
                skipClickForIconRef.current = dragState.id

                // --- Grid Snapping & Collision Resolution ---
                setIconPositions((prevPositions) => {
                    const nextPositions = { ...prevPositions }
                    const draggingId = dragState.id
                    const dropPos = nextPositions[draggingId]

                    if (!dropPos) return prevPositions

                    const CW = 106 // Column Width
                    const RH = 108 // Row Height
                    const MARGIN = 14

                    let targetCol = Math.max(0, Math.round((dropPos.x - MARGIN) / CW))
                    let targetRow = Math.max(0, Math.round((dropPos.y - MARGIN) / RH))

                    // Collision Check
                    const isOccupied = (c: number, r: number) => {
                        return (Object.keys(nextPositions) as AppId[]).some(iterId => {
                            if (iterId === draggingId) return false
                            const otherPos = nextPositions[iterId]
                            const otherCol = Math.round((otherPos.x - MARGIN) / CW)
                            const otherRow = Math.round((otherPos.y - MARGIN) / RH)
                            return otherCol === c && otherRow === r
                        })
                    }

                    // Spiral search for nearest empty slot if occupied
                    if (isOccupied(targetCol, targetRow)) {
                        let radius = 1
                        let found = false
                        while (!found && radius < 20) { // Limit search radius
                            for (let dx = -radius; dx <= radius && !found; dx++) {
                                for (let dy = -radius; dy <= radius && !found; dy++) {
                                    if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue // Only perimeter of spiral
                                    const testCol = Math.max(0, targetCol + dx)
                                    const testRow = Math.max(0, targetRow + dy)
                                    if (!isOccupied(testCol, testRow)) {
                                        targetCol = testCol
                                        targetRow = testRow
                                        found = true
                                    }
                                }
                            }
                            radius++
                        }
                    }

                    // Enforce Grid Bounds
                    const availableWidth = Math.max(220, viewport.width - 180)
                    const availableHeight = Math.max(220, viewport.height - taskbarReservedHeight - 36)

                    const maxCol = Math.max(0, Math.floor((availableWidth - iconSize.width - MARGIN) / CW))
                    const maxRow = Math.max(0, Math.floor((availableHeight - iconSize.height - MARGIN) / RH))

                    targetCol = Math.min(targetCol, maxCol)
                    targetRow = Math.min(targetRow, maxRow)

                    // Final snapped X/Y
                    nextPositions[draggingId] = {
                        x: MARGIN + targetCol * CW,
                        y: MARGIN + targetRow * RH
                    }

                    return nextPositions
                })
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIconPositions((prev) => {
            const availableWidth = Math.max(220, viewport.width - 180)
            const availableHeight = Math.max(220, viewport.height - taskbarReservedHeight - 36)
            const CW = 106
            const RH = 108
            const MARGIN = 14
            let changed = false
            const next = { ...prev }

            const isOccupied = (c: number, r: number, ignoreId: AppId | null = null) => {
                return (Object.keys(next) as AppId[]).some((iterId) => {
                    if (iterId === ignoreId) return false
                    const otherPos = next[iterId]
                    const otherCol = Math.round((otherPos.x - MARGIN) / CW)
                    const otherRow = Math.round((otherPos.y - MARGIN) / RH)
                    return otherCol === c && otherRow === r
                })
            }

            desktopShortcuts.forEach((shortcut, index) => {
                const currentPos = next[shortcut.id]
                let targetCol = 0
                let targetRow = 0

                if (!currentPos) {
                    // Initialize if missing
                    const itemsPerColumn = Math.max(1, Math.floor(availableHeight / 108))
                    targetCol = Math.floor(index / itemsPerColumn)
                    targetRow = index % itemsPerColumn
                } else {
                    // Retrieve current intended column
                    targetCol = Math.max(0, Math.round((currentPos.x - MARGIN) / CW))
                    targetRow = Math.max(0, Math.round((currentPos.y - MARGIN) / RH))
                }

                // Enforce Grid Bounds
                const maxCol = Math.max(0, Math.floor((availableWidth - iconSize.width - MARGIN) / CW))
                const maxRow = Math.max(0, Math.floor((availableHeight - iconSize.height - MARGIN) / RH))

                targetCol = Math.min(targetCol, maxCol)
                targetRow = Math.min(targetRow, maxRow)

                // Collision Check & Resolution for Resizing
                if (isOccupied(targetCol, targetRow, shortcut.id)) {
                    let radius = 1
                    let found = false
                    while (!found && radius < 30) {
                        for (let dx = -radius; dx <= radius && !found; dx++) {
                            for (let dy = -radius; dy <= radius && !found; dy++) {
                                if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue
                                const testCol = Math.min(maxCol, Math.max(0, targetCol + dx))
                                const testRow = Math.min(maxRow, Math.max(0, targetRow + dy))
                                if (!isOccupied(testCol, testRow, shortcut.id)) {
                                    targetCol = testCol
                                    targetRow = testRow
                                    found = true
                                }
                            }
                        }
                        radius++
                    }
                }

                const finalX = MARGIN + targetCol * CW
                const finalY = MARGIN + targetRow * RH

                if (!currentPos || finalX !== currentPos.x || finalY !== currentPos.y) {
                    next[shortcut.id] = { x: finalX, y: finalY }
                    changed = true
                }
            })

            return changed ? next : prev
        })
    }, [desktopShortcuts, iconSize.height, iconSize.width, taskbarReservedHeight, viewport.height, viewport.width])

    return (
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
    )
}
