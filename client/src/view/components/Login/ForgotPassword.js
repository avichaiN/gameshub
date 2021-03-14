import React, { useState } from 'react';
import LoadingCircle from '../LoadingCircle'
import swal from 'sweetalert';



const ForgotPassword = ({ setEnterEmail, setEmailColor, setEmailNotFound, setForgotPassword, enterEmail, emailNotFound, emptyEmailColor }) => {
    const [loadingCircle, setLoadingCircle] = useState(false)
    return (
        <div>

            {loadingCircle ?
                <LoadingCircle />
                :
                <form className='loginForm mt-3' onSubmit={sendResetPassword(setEnterEmail, setEmailColor, setEmailNotFound,
                    setForgotPassword, setLoadingCircle)}>
                    <h3 className='light'>Reset your password</h3>
                    <p className='light'>We'll email you instructions to reset your password.</p>
                    <div className="mb-3" name='email'>
                        <input name='email' placeholder='Email' type="text" style={{ border: emptyEmailColor }}
                            className="form-control" />
                        {enterEmail ? <label className='form-text light'>Email cannot be empty</label> : null}
                        {emailNotFound ? <label className='form-text light'>Matching account with this E-mail not found.</label> : null}
                    </div>
                    <button type="submit" className="btn btn-primary">Reset password</button>
                    <button className="btn btn-secondary mt-2" onClick={() => handleGoBackToLogin(setForgotPassword)}>Back to login</button>

                </form>

            }
        </div>
    )
}

const sendResetPassword = (setEnterEmail, setEmailColor, setEmailNotFound, setForgotPassword, setLoadingCircle) => e => {
    e.preventDefault()
    const userEmail = e.target.children.email.children.email.value
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