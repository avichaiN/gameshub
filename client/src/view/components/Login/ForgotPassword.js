import React, { useState } from 'react';
import LoadingCircle from '../LoadingCircle'
import swal from 'sweetalert';



const ForgotPassword = ({ setEnterEmail, setEmailColor, setEmailNotFound, setForgotPassword, enterEmail, emailNotFound, emptyEmailColor }) => {
    const [loadingCircle, setLoadingCircle] = useState(false)
    return (
        <div>
            <h3>Reset your password</h3>
            <p>We'll email you instructions to reset the password.</p>

            {loadingCircle ?
                <LoadingCircle />
                :
                <form onSubmit={sendResetPassword(setEnterEmail, setEmailColor, setEmailNotFound, setForgotPassword, setLoadingCircle)}>
                    <label >Email</label>
                    <input name='email' style={{ border: emptyEmailColor }} type='email' />
                    {enterEmail ? <label>Email cannot be empty</label> : null}
                    {emailNotFound ? <p>Matching account with this E-mail not found.</p> : null}
                    <button>Reset password</button>
                </form>
            }

            <button onClick={() => handleGoBackToLogin(setForgotPassword)}>Back to login</button>
        </div>
    )
}

const sendResetPassword = (setEnterEmail, setEmailColor, setEmailNotFound, setForgotPassword, setLoadingCircle) => e => {
    e.preventDefault()
    const userEmail = e.target.children.email.value
    setEmailNotFound(false)

    if (!userEmail) {
        setEnterEmail(true)
        setEmailColor('1px solid red')
    } else {
        setLoadingCircle(true)
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
                    setLoadingCircle(false)
                    setEmailNotFound(true)
                } else {
                    setLoadingCircle(false)
                    await swal({
                        title: "Reset E-mail sent!",
                        text: 'Check Inbox/Spam to reset password',
                        icon: "success",
                        buttons: false,
                        timer: 3000,
                    });
                    setForgotPassword(false)
                }
            })
    }
}
const handleGoBackToLogin = (setForgotPassword) => {
    setForgotPassword(false)
}

export default ForgotPassword;