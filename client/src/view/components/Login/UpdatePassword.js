import React, { useState } from 'react';
import { checkpassword } from './passwordStrength'
import { checkIfPasswordsMatch } from './passwordStrength'
import swal from 'sweetalert';



const UpdatePassword = () => {
    const [weekPassword, setWeekPassword] = useState(false)

    const [matchPassword, setMatchPassword] = useState(true)
    const [passwordsMatch, setPasswordsMatch] = useState('')
    return (<div>
        <form className='loginForm mt-3' onSubmit={handleUpdatePassword(setMatchPassword, setWeekPassword)}>
            <h2 className='light'>Update password</h2>

            {matchPassword ?
                <div className="mb-3 light">
                    {passwordsMatch}
                </div>
                :
                <div className="mb-3 light">Passwords do not match. Try again.</div>
            }

            <div className="mb-3" name='pass'>
                <input className='form-control' onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' placeholder='Passowrd' name='password1' />
                <input className='form-control' onKeyUp={checkpassword(setMatchPassword, setPasswordsMatch)} type='password' placeholder='Confirm password' name='password2' />
            </div>
            <div className="mb-3 light" name='passwordBox'>
                <span>Password strength - </span> <label id="passwordStrengthText" className='form-text light'></label>
                <progress max="100" className='meter' name='passwordStrength' value="0" id="meter" />
            </div>
            {weekPassword ? <div className="mb-3 light">
                Password is not strong enough!
            </div> : null}
            {weekPassword ? <div className="mb-3 passwordStrength light" name='passwordBox'>
                <span>Password requirements:</span>
                <span> At least 6 characters.</span>
                <span> At least one Upper case / Symbol / Number.</span>
            </div> : null}
            <button type="submit" className="btn btn-primary">Update password</button>
        </form>
    </div>)
}

const handleUpdatePassword = (setMatchPassword, setWeekPassword) => e => {
    e.preventDefault();
    const passwordStrength = e.target.children.passwordBox.children.passwordStrength.value

    const password1 = e.target.children.pass.children.password1.value;
    const password2 = e.target.children.pass.children.password2.value;
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