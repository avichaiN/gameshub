import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
} from "react-router-dom";
import './dist/gamesNavbar.css';
import CoolAnimation from '../CoolAnimation/CoolAnimation'


import Hangman from './Hangman/Hangman'
import Simon from './Simon/Simon'
import Leaderboard from '../Leaderboard/Leaderboard'


const Games = ({ setFromWhichGame, game, setLoggedIn, loggedIn }) => {
    return (

        <Router>
            <div className='GamesNavbar__container bg-dark'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light navBarFather">
                    <div className="container-fluid">
                        <div className="navbar-expand navbarContainer">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbarContent">
                                <li className="nav-item">
                                    <NavLink to='/hangman' exact className='nav-link'>Hangman</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/simon' exact className='nav-link'>Simon</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <Switch>
                    <Route path="/hangman">
                        <Hangman setFromWhichGame={setFromWhichGame} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                    </Route>

                    <Route path="/simon">
                        <Simon setFromWhichGame={setFromWhichGame} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                    </Route>
                    <Route path="/leaderboard">
                        <Leaderboard setFromWhichGame={setFromWhichGame} game={game} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                    </Route>
                    <CoolAnimation />
                </Switch>
            </div>
        </Router>
    )
}
export default Games