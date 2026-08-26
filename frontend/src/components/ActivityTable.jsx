import { useState } from "react"
import './style.css'

const ActivityTable = ({epochLastDay,testsByDayOrder}) => {
    const [currentDay, setCurrentDay] = useState(epochLastDay)
    const previousDay = (currentDay) =>{
        return new Date(currentDay.getTime() - 86400000)
    }

    const readableDate = (date) => {
    
        const month = date.toLocaleDateString('en-US', { month: 'long' })
        const day = date.toLocaleDateString('en-US', { day: 'numeric' })
        const year = date.toLocaleDateString('en-US', { year: 'numeric' })
        return `${month} ${day} ${year}`
    };

    const dayColorLevel = (testNumber) => {
        if (!testNumber || testNumber === 0) return '00'      // no activity, fully transparent
        if (testNumber > 9) return 'ff'                        // 10+ tests, fully opaque
        if (testNumber > 7) return 'cc'                        // 8-9 tests
        if (testNumber > 4) return '99'                        // 5-7 tests
        if (testNumber > 1) return '66'                        // 2-4 tests
        return '33'                                             // 1 test
    }

    const lastDay = new Date(epochLastDay)
    const testsByDayOrderReverse = [...testsByDayOrder].reverse()
    console.log('lastDay',readableDate(lastDay),'\n-------------')
    console.log('yesterday',readableDate(previousDay(lastDay)),'\n-------------')


    return(
        <div className="tests-container">
            
            {testsByDayOrderReverse.map((tests,index) => {
                return(
                    <div key={index} className={`test-box level-${dayColorLevel(tests)}`}></div>
                )
            })}
        </div>
    )
}

export default ActivityTable