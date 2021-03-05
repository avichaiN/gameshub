import React, { useState, useEffect } from 'react';
import './dist/login.css';
import swal from 'sweetalert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

const Login = ({ setLoggedIn }) => {

    const [badCredentials, setBadCredentials] = useState(false)

    useEffect(() => {
        fetch('/checkCookie')
            .then(r => r.json())
            .then(data => {
                if (data.status === 'authorized') {
                    setLoggedIn(true)
                }
            })
    }, [])

    return (
        <Router>
            <div className='login__Container'>

                <div className='login__Nav'>
                    <Link className='login__navLogin' to="/">Login</Link>
                    <Link className='login__navRegister' to="/register">Create Account</Link>
                </div>

                <Switch>
                    <Route path="/register">
                        <RegisterForm setLoggedIn={setLoggedIn} badCredentials={badCredentials} setBadCredentials={setBadCredentials} />
                    </Route>
                    <Route path="/">
                        <LoginForm setLoggedIn={setLoggedIn} badCredentials={badCredentials} setBadCredentials={setBadCredentials} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
const LoginForm = ({ setLoggedIn, badCredentials, setBadCredentials }) => {

    return (
        <div className='login__fromContainer'>
            <form onSubmit={handleLogin(setLoggedIn, setBadCredentials)} className='login__Form'>
                {badCredentials ? <div>sorry wrong info</div> : null}
                <input type='text' pattern="[A-Za-z0-9]+" required name='username' placeholder='Username' />
                <input type='password' required name='password' placeholder='Passowrd' />
                <button>Login</button>
            </form>

            <button onClick={handleEnterAsGuest(setLoggedIn)} className='login__Guest'>Enter as guest</button>
        </div>
    )
}
const RegisterForm = ({ setLoggedIn, badCredentials, setBadCredentials }) => {
    const [weekPassword, setWeekPassword] = useState(false)
    return (
        <div className='login__registerForm'>

            <form onSubmit={handleRegister(setLoggedIn, setBadCredentials, setWeekPassword)} className='register__form'>
                {badCredentials ? <div className='badCredentials'>* Username or Email is taken!</div> : null}
                {weekPassword ? <div className='badCredentials'>* Password is not strong enough!</div> : null}


                <input type='text' required name='username' placeholder='Username' />
                <input type='email' required name='email' placeholder='E-mail address' />
                <input onKeyUp={checkpassword} type='password' id='password' required name='password' placeholder='Passowrd' />
                <div className='passwordStrength' name='passwordBox'>
                    Password Strengh -
                    <progress max="100" name='passwordStrength' value="0" id="meter"></progress>
                    <div id="passwordStrengthText"></div>
                </div>
                {weekPassword ? <div className='passwordRequirements'>
                    <span>Password requirements:</span>
                    <span>* At least 6 digits.</span>
                    <span>* At least one Upper case / Symbol / Number.</span>
                </div> : null}
                <button>Create Account</button>
            </form>
        </div>
    )
}

const handleLogin = (setLoggedIn, setBadLogin) => e => {
    console.log('handle login')
    e.preventDefault()
    const username = e.target.children.username.value
    const password = e.target.children.password.value
    const onlyLetterNumbers = /^[0-9a-zA-Z]+$/;

    if (username.match(onlyLetterNumbers)) {
        fetch("/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.status === 'authorized') {
                    await swal({
                        title: "Login successfully",
                        text: 'Welcome',
                        icon: "success",
                        buttons: false,
                        timer: 1500,
                    });
                    setLoggedIn(true)
                } else {
                    setBadLogin(true)
                    setLoggedIn(false)
                }
            })
    } else {
        setBadLogin(true)
        setLoggedIn(false)
    }
}

const handleEnterAsGuest = setLoggedIn => e => {

    fetch("/guest")
        .then((res) => res.json())
        .then(async (data) => {
            if (data.status === 'authorized') {
                await swal({
                    title: "Entering as Guest!",
                    text: 'Welcome',
                    icon: "success",
                    buttons: false,
                    timer: 1500,
                });
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        });
}

const handleRegister = (setLoggedIn, setBadCredentials, setWeekPassword) => e => {
    e.preventDefault()
    const username = e.target.children.username.value
    const email = e.target.children.email.value
    const password = e.target.children.password.value
    const passwordStrength = e.target.children.passwordBox.children.passwordStrength.value

    if (passwordStrength > 25) {
        setWeekPassword(false)
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.status === 'authorized') {
                    await swal({
                        title: "Welcome!",
                        text: "Account created successfully",
                        icon: "success",
                        buttons: false,
                        timer: 1500,
                    });
                    setLoggedIn(true)
                } else {
                    setBadCredentials(true)
                    setLoggedIn(false)
                }
            })
    } else {
        setWeekPassword(true)
    }
}
function checkpassword(e) {
    const password = e.target.value
    const strengthbar = document.getElementById("meter");
    const passwordStrengthText = document.getElementById('passwordStrengthText')

    let strength = 0;

    if (password.match(/[a-z]+/)) {
        strength += 1;
    }
    if (password.match(/[A-Z]+/)) {
        strength += 1;
    }
    if (password.match(/[0-9]+/)) {
        strength += 1;
    }
    if (password.match(/[$@#&!]+/)) {
        strength += 1;
    }
    if (password.length < 6) {
        strength = 1
    }

    switch (strength) {
        case 0:
            strengthbar.value = 0;
            passwordStrengthText.innerHTML =
                'Very Week Password'
            break;

        case 1:
            strengthbar.value = 25;
            passwordStrengthText.innerText = 'Week Password'
            break;

        case 2:
            strengthbar.value = 50;
            passwordStrengthText.innerText = 'Good Password'
            break;

        case 3:
            strengthbar.value = 75;
            passwordStrengthText.innerText = 'Strong Password'

            break;

        case 4:
            strengthbar.value = 100;
            passwordStrengthText.innerText = 'Very Strong Password'
            break;
    }
}

export default Login