import React, { useState } from 'react';
import Login from './view/components/Login/Login'
import Games from './view/components/Games/Games'

function App() {

  // useEffect(() => {
  //   fetch('/test')
  //     .then(r => r.json())
  //     .then(data => {
  //       console.log(data)
  //     })
  // }, [])
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <div className="App">
      {!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Games />}

    </div>
  );
}

export default App;
