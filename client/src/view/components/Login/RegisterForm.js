import React, { useState } from 'react';
import swal from 'sweetalert';
import { checkpassword } from './passwordStrength'
import { checkIfPasswordsMatch } from './passwordStrength'
import LoadingCircle from '../LoadingCircle/LoadingCircle'

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
        <div className='mainContainer bg-dark'>

            {loadingCircle ?

                <LoadingCircle />
                :
                <form className='loginForm mt-3' onSubmit={
                    handleRegister(setLoggedIn, setTaken, setWeekPassword, setBadInput,
                        setEnterUsername, setUsernameColor,
                        setEnterEmail, setEmailColor,
                        setEnterPassword, setPasswordColor, setLoadingCircle, setMatchPassword
                    )
                }>

                    {infoTaken ? <div className="mb-3">
                        Username or Email is taken!
                    </div> : null}
                    {badInput ? <div className="mb-3">
                        Please check you have filled the form!
                    </div> : null}


                    <div className="mb-3" name='user'>
                        <input style={{ border: emptyUsernameColor }} className='form-control' type='text' name='username' maxLength="35" placeholder='Username' />
                        {enterUsername ? <label className='form-text light'>Please enter Username</label> : null}
                    </div>
                    <div className="mb-3" name='email'>
                        <input style={{ border: emptyEmailColor }} className='form-control' type='email' name='email' maxLength="40" placeholder='E-mail address' />
                        {enterEmail ? <label className='form-text light'>Please enter Email</label> : null}
                    </div>
                    <div className="mb-3" name='pass'>
                        <input style={{ border: emptyPasswordColor }} className="form-control" onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' maxLength="35" id='password1' name='password1' placeholder='Passowrd' />
                        <input style={{ border: emptyPasswordColor }} className="form-control mt-2" onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' maxLength="35" id='password2' name='password2' placeholder='Confirm passowrd' />
                        {passwordsMatch}
                        {enterPassword ? <label className='form-text light'>Please enter both password fields</label> : null}
                    </div>
                    <div className="mb-3 light" name='passwordBox'>
                            <span>Password strength - </span> <label id="passwordStrengthText" className='form-text light'></label>
                            <progress max="100" className='meter' name='passwordStrength' value="0" id="meter" /></div>
                    {weekPassword ? <div className="mb-3 light">
                        Password is not strong enough!
                    </div> : null}
                    {weekPassword ? <div className="mb-3 passwordStrength light" name='passwordBox'>
                        <span>Password requirements:</span>
                        <span> At least 6 characters.</span>
                        <span> At least one Upper case / Symbol / Number.</span>
                    </div> : null}


                    <button type="submit" className="btn btn-primary">Create account</button>
                </form>
            }

        </div>
    )
}


const handleRegister = (setLoggedIn, setTaken, setWeekPassword, setBadInput, setEnterUsername, setUsernameColor, setEnterEmail, setEmailColor, setEnterPassword, setPasswordColor, setLoadingCircle, setMatchPassword) => e => {
    e.preventDefault()
    const username = e.target.children.user.children.username.value
    const email = e.target.children.email.children.email.value
    const password1 = e.target.children.pass.children.password1.value;
    const password2 = e.target.children.pass.children.password2.value;
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
                        setLoggedIn(true)
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