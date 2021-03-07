import React, { useState } from 'react';
import { Login } from './view/components/Login/Login'
import Games from './view/components/Games/Games'
import './view/components/dist/index.css';

function App() {


  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="App">
      {!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Games/>}
    </div>
  );
}

export default App;
