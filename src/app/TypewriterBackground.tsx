import { useEffect, useState } from 'react'

const phrases = [
    'Hi, I am Kaustubh Pathak.',
    'I Love Coding',
    'Welcome to my Page.'
]

const TYPING_SPEED_MS = 100
const DELETING_SPEED_MS = 50
const PAUSE_AFTER_TYPING_MS = 2000
const PAUSE_AFTER_DELETING_MS = 500

export function TypewriterBackground() {
    const [text, setText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [loopIndex, setLoopIndex] = useState(0)
    const [typingDelay, setTypingDelay] = useState(TYPING_SPEED_MS)

    useEffect(() => {
        let timeoutId: number

        const currentPhrase = phrases[loopIndex % phrases.length]

        const handleType = () => {
            if (!isDeleting) {
                // Typing
                const nextText = currentPhrase.substring(0, text.length + 1)
                setText(nextText)

                if (nextText === currentPhrase) {
                    // Finished typing the phrase
                    setTypingDelay(PAUSE_AFTER_TYPING_MS)
                    setIsDeleting(true)
                } else {
                    // Continue typing with some randomness
                    setTypingDelay(TYPING_SPEED_MS + Math.random() * 50)
                }
            } else {
                // Deleting
                const nextText = currentPhrase.substring(0, text.length - 1)
                setText(nextText)

                if (nextText === '') {
                    // Finished deleting
                    setIsDeleting(false)
                    setLoopIndex((prev) => prev + 1)
                    setTypingDelay(PAUSE_AFTER_DELETING_MS)
                } else {
                    // Continue deleting, usually faster than typing
                    setTypingDelay(DELETING_SPEED_MS)
                }
            }
        }

        timeoutId = window.setTimeout(handleType, typingDelay)
        return () => window.clearTimeout(timeoutId)
    }, [text, isDeleting, loopIndex, typingDelay])

    return (
        <div className="typewriter-background" aria-hidden="true">
            <div className="typewriter-content">
                <div className="typewriter-line">
                    {text}
                    <span className="typewriter-cursor">|</span>
                </div>
            </div>
        </div>
    )
}
