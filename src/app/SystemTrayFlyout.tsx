import { useEffect, useRef } from 'react'

export type SystemTrayFlyoutProps = {
    isOpen: boolean
    onClose: () => void
    muted: boolean
    toggleSoundFromMenu: () => void
}

export function SystemTrayFlyout({
    isOpen,
    onClose,
    muted,
    toggleSoundFromMenu,
}: SystemTrayFlyoutProps) {
    const flyoutRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
                // We delay closing slightly so the toggle button itself can handle its own click
                setTimeout(() => onClose(), 10)
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
        <div className="system-tray-flyout" ref={flyoutRef} onMouseDown={(e) => e.stopPropagation()}>
            <div className="flyout-section">
                <div className="flyout-row">
                    <span className="flyout-icon">{muted ? '🔇' : '🔊'}</span>
                    <div className="flyout-slider-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={muted ? 0 : 50}
                            className="flyout-slider"
                            onChange={() => {
                                // If they drag the slider while muted, unmute
                                if (muted) toggleSoundFromMenu()
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flyout-section">
                <div className="flyout-row">
                    <span className="flyout-icon">🔋</span>
                    <div className="flyout-info">
                        <div className="flyout-title">Battery</div>
                        <div className="flyout-desc">98% - Fully charged</div>
                    </div>
                </div>
                <div className="flyout-row mt-2">
                    <span className="flyout-icon">🌐</span>
                    <div className="flyout-info">
                        <div className="flyout-title">Network</div>
                        <div className="flyout-desc">Connected, secured</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
