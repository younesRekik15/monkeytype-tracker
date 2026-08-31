import { useState } from 'react'
import './style.css'

const ActivityTable = ({ epochLastDay, testsByDayOrder }) => {
    const [selectedDay, setSelectedDay] = useState(null)

    const subtractDay = (currentDay, days) => {
        const date = new Date(currentDay)
        date.setDate(date.getDate() - days)
        return date
    }

    const readableDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const dayColorLevel = (testNumber) => {
        if (!testNumber || testNumber === 0) return '00'      // no activity, fully transparent
        if (testNumber > 9) return 'ff'                        // 10+ tests, fully opaque
        if (testNumber > 7) return 'cc'                        // 8-9 tests
        if (testNumber > 4) return '99'                        // 5-7 tests
        if (testNumber > 1) return '66'                        // 2-4 tests
        return '33'                                             // 1 test
    }

    const lastDay = new Date(epochLastDay)
    lastDay.setHours(0, 0, 0, 0)
    const orderedTestsByDay = testsByDayOrder
    const firstDay = subtractDay(lastDay, orderedTestsByDay.length - 1)
    const calendarStart = subtractDay(firstDay, firstDay.getDay())
    const calendarEnd = new Date(lastDay)
    calendarEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (calendarEnd > today) {
        calendarEnd.setTime(today.getTime())
    }

    const calendarDays = []

    for (let currentDay = new Date(calendarStart); currentDay <= calendarEnd; currentDay.setDate(currentDay.getDate() + 1)) {
        const dayIndex = Math.round((currentDay - firstDay) / 86400000)
        const tests = dayIndex >= 0 && dayIndex < orderedTestsByDay.length
            ? orderedTestsByDay[dayIndex]
            : null
        const isBeforeRange = currentDay < firstDay

        calendarDays.push({
            date: new Date(currentDay),
            tests,
            isBeforeRange,
            isAfterRange: dayIndex >= orderedTestsByDay.length,
        })
    }

    return(
        <div className="activity-wrapper">
            <div className="tests-container">
            {calendarDays.map(({ date, tests, isBeforeRange, isAfterRange }) => (
                <button
                    key={date.getTime()}
                    type="button"
                    className={`test-box level-${dayColorLevel(tests)}${isBeforeRange ? ' before-range' : isAfterRange ? ' outside-range' : ''}`}
                    title={`${tests ? tests === 1 ? '1 test' : `${tests} tests` : 'no activity'} on ${readableDate(date)}`}
                    aria-label={`${tests ? tests === 1 ? '1 test' : `${tests} tests` : 'no activity'} on ${readableDate(date)}`}
                    onClick={() => setSelectedDay({ date, tests })}
                />
            ))}
            </div>
            {selectedDay && (
                <div className="activity-details" role="status">
                    <strong>{readableDate(selectedDay.date)}</strong>
                    <span>{selectedDay.tests ? `${selectedDay.tests} ${selectedDay.tests === 1 ? 'test' : 'tests'}` : 'No tests'}</span>
                </div>
            )}
        </div>
    )
}

export default ActivityTable
