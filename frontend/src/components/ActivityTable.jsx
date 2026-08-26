import './style.css'

const ActivityTable = ({epochLastDay,testsByDayOrder}) => {
    const subtractDay = (currentDay,days) =>{
        return new Date(currentDay.getTime() - 86400000*days)
    }

    const readableDate = (epoch) => {
        const date = new Date(epoch)
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
    const testsByDayOrderReverse = [...testsByDayOrder].reverse()


    return(
        <div className="tests-container">
            
            {
                testsByDayOrderReverse.map((tests,index) => {
                    const currentDay = subtractDay(lastDay, index)
                    return(
                        <div key={index} className={`test-box level-${dayColorLevel(tests)}`} title={`${tests?tests===1?'1 test':`${tests} tests`:'no activity'} on ${readableDate(currentDay)}`}></div>
                    )
                })
            }
        </div>
    )
}

export default ActivityTable