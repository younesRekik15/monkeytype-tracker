

import { useEffect, useState } from 'react'
import ActivityTable from './components/ActivityTable'

function App() {
  const [testActivities, setTestActivities] = useState(null)
  async function loadActivity (){
    const response = await fetch('http://localhost:3001/api/monkeytype/test-activity')
    
    const result = await response.json()
    if(response.ok){
      setTestActivities(result)
    }else{
      console.log(result)
    }

  }
  useEffect( ()=>{loadActivity()},[])

  return (
    <>
      {testActivities?<ActivityTable epochLastDay={testActivities.lastDay} testsByDayOrder={testActivities.testsByDays}/>:''}
      
    </>
  )
}

export default App
