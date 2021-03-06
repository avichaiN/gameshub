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
                        <RegisterForm setLoggedIn={setLoggedIn} />
                    </Route>
                    <Route path="/updatePassword">
                        <UpdatePassword />
                    </Route>
                    <Route path="/">
                        <LoginForm setLoggedIn={setLoggedIn} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

const LoginForm = ({ setLoggedIn }) => {
    const [forgotPassword, setForgotPassword] = useState(false)
    const [badCredentials, setBadCredentials] = useState(false)
    const [enterUsername, setEnterUsername] = useState(false)
    const [enterPassword, setEnterPassword] = useState(false)

    const [emptyUsernameColor, setUsernameColor] = useState('1px solid black')
    const [emptyPasswordColor, setPasswordColor] = useState('1px solid black')

    const [enterEmail, setEnterEmail] = useState(false)
    const [emptyEmailColor, setEmailColor] = useState('1px solid black')
    const [emailNotFound, setEmailNotFound] = useState(false)

    return (

        < div >

            {!forgotPassword ?
                <div className='login__fromContainer'>
                    <form onSubmit={handleLogin(setLoggedIn, setBadCredentials, setEnterUsername, setEnterPassword, setUsernameColor, setPasswordColor)} className='login__Form'>
                        {badCredentials ? <div>sorry wrong info</div> : null}

                        <input style={{ border: emptyUsernameColor }} type='text' pattern="[A-Za-z0-9]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" name='username' placeholder='Username' />
                        {enterUsername ? <label>Please enter Username/Email</label> : null}
                        <input style={{ border: emptyPasswordColor }} type='password' name='password' placeholder='Passowrd' />
                        {enterPassword ? <label>Please enter Password</label> : null}
                        <button>Login</button>

                        <button onClick={() => handleForgotPassword(setForgotPassword)} type='button'>Forgot password?</button>
                    </form>

                    <button onClick={handleEnterAsGuest(setLoggedIn)} className='login__Guest'>Enter as guest</button>
                </div>
                :
                <div>
                    <h3>Reset your password</h3>
                    <p>We'll email you instructions to reset the password.</p>
                    <form onSubmit={sendResetPassword(setEnterEmail, setEmailColor, setEmailNotFound)}>
                        <label >Email</label>
                        <input name='email' style={{ border: emptyEmailColor }} type='email' />
                        {enterEmail ? <label>Email cannot be empty</label> : null}
                        {emailNotFound ? <p>Matching account with this E-mail not found.</p> : null}
                        <button>Reset password</button>
                    </form>
                    <button onClick={() => handleGoBackToLogin(setForgotPassword)}>Back to login</button>
                </div>
            }

        </div >
    )
}

const RegisterForm = ({ setLoggedIn }) => {
    const [infoTaken, setTaken] = useState(false)
    const [badInput, setBadInput] = useState(false)
    const [weekPassword, setWeekPassword] = useState(false)

    const [enterUsername, setEnterUsername] = useState(false)
    const [enterEmail, setEnterEmail] = useState(false)
    const [enterPassword, setEnterPassword] = useState(false)

    const [emptyUsernameColor, setUsernameColor] = useState('1px solid black')
    const [emptyEmailColor, setEmailColor] = useState('1px solid black')
    const [emptyPasswordColor, setPasswordColor] = useState('1px solid black')

    return (
        <div className='login__registerForm'>

            <form
                onSubmit={
                    handleRegister(setLoggedIn, setTaken, setWeekPassword, setBadInput,
                        setEnterUsername, setUsernameColor,
                        setEnterEmail, setEmailColor,
                        setEnterPassword, setPasswordColor
                    )
                }
                className='register__form'>
                {infoTaken ? <div className='badCredentials'>* Username or Email is taken!</div> : null}
                {badInput ? <div className='badCredentials'>* Please check you have filled the form!</div> : null}
                {weekPassword ? <div className='badCredentials'>* Password is not strong enough!</div> : null}


                <input style={{ border: emptyUsernameColor }} type='text' name='username' maxLength="35" placeholder='Username' />
                {enterUsername ? <label>Please enter Username</label> : null}
                <input style={{ border: emptyEmailColor }} type='email' name='email' maxLength="40" placeholder='E-mail address' />
                {enterEmail ? <label>Please enter Email</label> : null}
                <input style={{ border: emptyPasswordColor }} onKeyUp={checkpassword} type='password' maxLength="35" id='password' name='password' placeholder='Passowrd' />
                {enterPassword ? <label>Please enter Password</label> : null}
                <div className='passwordStrength' name='passwordBox'>
                    Password Strengh -
                    <progress max="100" name='passwordStrength' value="0" id="meter"></progress>
                    <div id="passwordStrengthText"></div>
                </div>
                {weekPassword ? <div className='passwordRequirements'>
                    <span>Password requirements:</span>
                    <span>* At least 6 characters.</span>
                    <span>* At least one Upper case / Symbol / Number.</span>
                </div> : null}
                <button>Create Account</button>
            </form>
        </div>
    )
}
const UpdatePassword = () => {
    const [weekPassword, setWeekPassword] = useState(false)

    const [matchPassword, setMatchPassword] = useState(true)
    const [passwordsMatch, setPasswordsMatch] = useState('')
    return (<div>
        <h2>Update password</h2>
        <form onSubmit={handleUpdatePassword(setMatchPassword, setWeekPassword)}>
            {matchPassword ? <p>{passwordsMatch}</p> : <p>Passwords do not match. Try again.</p>}
            <input onKeyDown={checkpassword} onKeyUp={checkIfPasswordsMatch(setMatchPassword, setPasswordsMatch)} type='password' name='password1' />
            <input onKeyUp={checkIfPasswordsMatch(setMatchPassword, setPasswordsMatch)} type='password' name='password2' />
            <div className='passwordStrength' name='passwordBox'>
                Password Strengh -
                    <progress max="100" name='passwordStrength' value="0" id="meter"></progress>
                <div id="passwordStrengthText"></div>
            </div>
            {weekPassword ? <div className='passwordRequirements'>
                <span>Password requirements:</span>
                <span>* At least 6 characters.</span>
                <span>* At least one Upper case / Symbol / Number.</span>
            </div> : null}
            <button>Update password</button>
        </form>
    </div>)
}
const handleLogin = (setLoggedIn, setBadLogin, setEnterUsername, setEnterPassword, setUsernameColor, setPasswordColor) => e => {
    e.preventDefault()
    const username = e.target.children.username.value
    const password = e.target.children.password.value
    console.log(username)
    if (!username) {
        setEnterUsername(true)
        setUsernameColor('1px solid red')
    }
    else if (!password) {
        setEnterPassword(true)
        setPasswordColor('1px solid red')

        setEnterUsername(false)
        setUsernameColor('1px solid black')
    } else {
        setEnterPassword(false)
        setEnterUsername(false)
        setUsernameColor('1px solid black')
        setPasswordColor('1px solid black')

        const onlyLetterNumbers = /^[A-Za-z0-9]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

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

const handleRegister = (setLoggedIn, setTaken, setWeekPassword, setBadInput, setEnterUsername, setUsernameColor, setEnterEmail, setEmailColor, setEnterPassword, setPasswordColor) => e => {
    e.preventDefault()
    const username = e.target.children.username.value
    const email = e.target.children.email.value
    const password = e.target.children.password.value
    const passwordStrength = e.target.children.passwordBox.children.passwordStrength.value

    if (!username) {
        setEnterUsername(true)
        setUsernameColor('1px solid red')
    } else if (!email) {
        setEnterEmail(true)
        setEmailColor('1px solid red')

        setEnterUsername(false)
        setUsernameColor('1px solid black')
    }
    else if (!password) {
        setEnterPassword(true)
        setPasswordColor('1px solid red')

        setEnterEmail(false)
        setEmailColor('1px solid black')
    } else {
        setEnterPassword(false)
        setEnterUsername(false)
        setEnterEmail(false)
        setEmailColor('1px solid black')
        setUsernameColor('1px solid black')
        setPasswordColor('1px solid black')

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
                        setTaken(true)
                        setLoggedIn(false)
                    }
                })
        } else {
            setWeekPassword(true)
        }
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
const sendResetPassword = (setEnterEmail, setEmailColor, setEmailNotFound) => e => {
    e.preventDefault()
    const userEmail = e.target.children.email.value
    setEmailNotFound(false)

    if (!userEmail) {
        setEnterEmail(true)
        setEmailColor('1px solid red')
    } else {
        setEnterEmail(false)
        setEmailColor('1px solid black')

        fetch("/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.email === 'failed') {
                    setEmailNotFound(true)
                }
                console.log(data)
            })
    }
}
const checkIfPasswordsMatch = (setMatchPassword, setPasswordsMatch) => e => {

    const password1 = e.target.parentNode.children.password1.value
    const password2 = e.target.parentNode.children.password2.value

    if (password1 === password2) {
        setMatchPassword(true)
        setPasswordsMatch('Passwords match.')
    }else{
        setPasswordsMatch('Passwords do not match.')
    }
}
const handleUpdatePassword = (setMatchPassword, setWeekPassword) => e => {
    e.preventDefault();
    const passwordStrength = e.target.children.passwordBox.children.passwordStrength.value

    const password1 = e.target.children.password1.value;
    const password2 = e.target.children.password2.value;
    if (password1 != password2) {
        setMatchPassword(false)

    } else if (passwordStrength > 25) {
        fetch("/reset", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password1 }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                console.log(data)
                if (data.user === 'updated') {
                    await swal({
                        title: "Password updated.",
                        text: 'Please login',
                        icon: "success",
                        buttons: false,
                        timer: 1500,
                    });
                    window.location.href = '/'
                } else {
                    window.location.href = '/'
                }
            })
    } else {
        setWeekPassword(true)
    }

}
const handleForgotPassword = (setForgotPassword) => {
    setForgotPassword(true)
}
const handleGoBackToLogin = (setForgotPassword) => {
    setForgotPassword(false)
}

export default Login