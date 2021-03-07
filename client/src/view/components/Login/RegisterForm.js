import React, { useState } from 'react';
import swal from 'sweetalert';
import { checkpassword } from './passwordStrength'
import { checkIfPasswordsMatch } from './passwordStrength'
import LoadingCircle from '../LoadingCircle'

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

    const [loadingCircle, setLoadingCircle] = useState(false)

    const [matchPassword, setMatchPassword] = useState(true)
    const [passwordsMatch, setPasswordsMatch] = useState('')

    return (
        <div className='login__registerForm'>

            {loadingCircle ?

                <LoadingCircle />
                :
                <form
                    onSubmit={
                        handleRegister(setLoggedIn, setTaken, setWeekPassword, setBadInput,
                            setEnterUsername, setUsernameColor,
                            setEnterEmail, setEmailColor,
                            setEnterPassword, setPasswordColor, setLoadingCircle, setMatchPassword
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
                    <input style={{ border: emptyPasswordColor }} onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' maxLength="35" id='password1' name='password1' placeholder='Passowrd' />
                    <input style={{ border: emptyPasswordColor }} onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' maxLength="35" id='password2' name='password2' placeholder='Confirm passowrd' />
                    {passwordsMatch}

                    {enterPassword ? <label>Please enter both password fields</label> : null}
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
            }

        </div>
    )
}


const handleRegister = (setLoggedIn, setTaken, setWeekPassword, setBadInput, setEnterUsername, setUsernameColor, setEnterEmail, setEmailColor, setEnterPassword, setPasswordColor, setLoadingCircle, setMatchPassword) => e => {
    e.preventDefault()
    const username = e.target.children.username.value
    const email = e.target.children.email.value
    const password1 = e.target.children.password1.value;
    const password2 = e.target.children.password2.value;
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
    else if (!password1 || !password2) {
        setEnterPassword(true)
        setPasswordColor('1px solid red')

        setEnterEmail(false)
        setEmailColor('1px solid black')
    }

    else if (password1 != password2) {
        setMatchPassword(false)
    } else {

        setEnterPassword(false)
        setEnterUsername(false)
        setEnterEmail(false)
        setEmailColor('1px solid black')
        setUsernameColor('1px solid black')
        setPasswordColor('1px solid black')

        if (passwordStrength > 25) {
            setLoadingCircle(true)
            setWeekPassword(false)
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password1 }),
            })
                .then((res) => res.json())
                .then(async (data) => {
                    if (data.status === 'authorized') {
                        setLoadingCircle(false)
                        await swal({
                            title: "Welcome!",
                            text: "Account created successfully",
                            icon: "success",
                            buttons: false,
                            timer: 1500,
                        });
                        window.location.href = "/"
                        setLoggedIn(false)
                    } else {
                        setLoadingCircle(false)
                        setTaken(true)
                        setLoggedIn(false)
                    }
                })
        } else {
            setLoadingCircle(false)
            setWeekPassword(true)
        }
    }
}
export default RegisterForm;