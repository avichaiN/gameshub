import './dist/login.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";

const handleLogin = (e) => {
    e.preventDefault()
    const username = e.target.children.username.value
    const password = e.target.children.password.value

    fetch("/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
}


const handleEnterAsGuest = () => {
    fetch("/guest")
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        });
    console.log('enter as guest')
}

const handleRegister = (e) => {
    e.preventDefault()
    const username = e.target.children.username.value
    const email = e.target.children.email.value
    const password = e.target.children.password.value

    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
}
const Login = () => {

    return (
        <Router>
            <div className='login__Container'>

                <div className='login__Nav'>
                    <Link className='login__navLogin' to="/">Login</Link>
                    <Link className='login__navRegister' to="/register">Create Account</Link>
                </div>

                <Switch>
                    <Route path="/register">
                        <RegisterForm />
                    </Route>
                    <Route path="/">
                        <LoginForm />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
const RegisterForm = () => {
    return (
        <div className='login__registerForm'>
            <form onSubmit={handleRegister} className='register__form'>
                <input type='text' required name='username' placeholder='Username' />
                <input type='email' required name='email' placeholder='E-mail address' />
                <input type='password' required name='password' placeholder='Passowrd' />
                <button>Create Account</button>
            </form>
        </div>
    )
}
const LoginForm = () => {
    return (
        <div className='login__fromContainer'>
            <form onSubmit={handleLogin} className='login__Form'>
                <input type='text' required name='username' placeholder='Username' />
                <input type='password' required name='password' placeholder='Passowrd' />
                <button>Login</button>
            </form>

            <button onClick={handleEnterAsGuest} className='login__Guest'>Enter as guest</button>
        </div>
    )
}

export default Login