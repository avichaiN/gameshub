import React, { useEffect } from 'react';
import Login from './view/components/Login/login'

function App() {

  // useEffect(() => {
  //   fetch('/test')
  //     .then(r => r.json())
  //     .then(data => {
  //       console.log(data)
  //     })
  // }, [])

  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
