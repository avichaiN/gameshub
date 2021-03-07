import React, { useState } from 'react';
import { checkpassword } from './passwordStrength'
import { checkIfPasswordsMatch } from './passwordStrength'
import swal from 'sweetalert';



const UpdatePassword = () => {
    const [weekPassword, setWeekPassword] = useState(false)

    const [matchPassword, setMatchPassword] = useState(true)
    const [passwordsMatch, setPasswordsMatch] = useState('')
    return (<div>
        <h2>Update password</h2>
        <form onSubmit={handleUpdatePassword(setMatchPassword, setWeekPassword)}>
            {matchPassword ? <p>{passwordsMatch}</p> : <p>Passwords do not match. Try again.</p>}
            <input onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' name='password1' />
            <input onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' name='password2' />
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

export default UpdatePassword