import { useEffect, useState } from 'react'
import '../App.css'

export function ClockCalendarWidget() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000)
        return () => window.clearInterval(timer)
    }, [])

    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const currentDate = now.getDate()

    const timeString = now.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    })

    const dateString = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    // Calendar logic
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const calendarCells = []
    // Fill empty days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="calendar-cell empty" />)
    }
    // Fill days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === currentDate
        calendarCells.push(
            <div key={`day-${i}`} className={`calendar-cell ${isToday ? 'today' : ''}`}>
                {i}
            </div>
        )
    }

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    return (
        <div className="clock-calendar-widget">
            <div className="clock-header">
                <h2 className="clock-time">{timeString}</h2>
                <div className="clock-date">{dateString}</div>
            </div>
            <div className="calendar-container">
                <div className="calendar-header">
                    {now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
                <div className="calendar-grid">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="calendar-cell day-name">{day}</div>
                    ))}
                    {calendarCells}
                </div>
            </div>
        </div>
    )
}
