import './dist/games.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

import Hangman from './Hangman/Hangman'
import Simon from './Simon/Simon'

const Games = () => {
    return (
        <Router>
            <div className='games__container'>

                <div className='games__nav'>
                    <Link className='games__hangman' to="/hangman">Hang-Man</Link>
                    <Link className='games__hangman' to="/simon">Simon</Link>

                </div>

                <Switch>
                    <Route path="/hangman">
                        <Hangman />
                    </Route>
                    <Route path="/simon">
                        <Simon />
                    </Route>

                </Switch>
            </div>
        </Router>
    )
}

export default Games