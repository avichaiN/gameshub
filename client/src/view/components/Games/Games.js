import './dist/games.css';
import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

import Hangman from './Hangman/Hangman'
import Simon from './Simon/Simon'
import Leaderboard from './Leaderboard/Leaderboard'

const Games = () => {
    const [game, setFromWhichGame] = useState('')
    return (

        <Router>
            <div className='games__container'>
                <div className='games__nav'>
                    <Link className='games__hangman' to="/hangman">Hang-Man</Link>
                    <Link onClick={() => setFromWhichGame('')} className='games__leaderboard' to='/leaderboard'>Leaderboard</Link>
                    <Link className='games__hangman' to="/simon">Simon</Link>

                </div>

                <Switch>
                    <Route path="/hangman">
                        <Hangman setFromWhichGame={setFromWhichGame} />
                    </Route>

                    <Route path="/simon">
                        <Simon setFromWhichGame={setFromWhichGame} />
                    </Route>
                    <Route path="/leaderboard">
                        <Leaderboard setFromWhichGame={setFromWhichGame} game={game} />
                    </Route>

                </Switch>
            </div>
        </Router>
    )
}

export default Games