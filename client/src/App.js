import React, { useEffect } from 'react';

import './App.css';

function App() {

  useEffect(() => {
    fetch('/test')
      .then(r => r.json())
      .then(data => {
        console.log(data)
      })
  }, [])
  
  return (
    <div className="App">
      <h1>react app</h1>
    </div>
  );
}

export default App;
