import { useEffect, useRef } from 'react'
import type { AppId } from './types'

export type ContextMenuProps = {
    isOpen: boolean
    x: number
    y: number
    onClose: () => void
    openApp: (id: AppId) => void
    toggleTheme: () => void
}

export function ContextMenu({ isOpen, x, y, onClose, openApp, toggleTheme }: ContextMenuProps) {
    const menuRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <ul
            ref={menuRef}
            className="context-menu"
            style={{ left: x, top: y }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <li className="context-menu-item" onClick={() => { openApp('settings'); onClose() }}>
                Personalize (Settings)
            </li>
            <li className="context-menu-item" onClick={() => { toggleTheme(); onClose() }}>
                Change Theme
            </li>
            <div className="context-menu-divider" />
            <li className="context-menu-item" onClick={() => { openApp('terminal'); onClose() }}>
                Open in Terminal
            </li>
            <li className="context-menu-item" onClick={() => { window.location.reload(); onClose() }}>
                Refresh
            </li>
        </ul>
    )
}
