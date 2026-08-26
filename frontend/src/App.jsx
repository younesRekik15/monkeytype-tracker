

import { useEffect, useState } from 'react'

function App() {
  const [testActivities, setTestActivities] = useState(null)
  async function loadActivity (){
    const response = await fetch('/api/monkeytype/test-activity')
    
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
      <p>{JSON.stringify(testActivities)}</p>
    </>
  )
}

export default App
