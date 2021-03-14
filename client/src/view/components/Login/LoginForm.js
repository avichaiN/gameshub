import swal from 'sweetalert';


const LoginForm = ({
    setLoggedIn,
    setForgotPassword,
    setBadCredentials,
    setEnterUsername,
    setEnterPassword,
    setUsernameColor,
    setPasswordColor,
    setLoadingCircle,
    badCredentials,
    emptyUsernameColor,
    emptyPasswordColor,
    enterPassword,
    enterUsername
}) => {

    return (
        <form className='loginForm mt-3' onSubmit={handleLogin(setLoggedIn, setBadCredentials, setEnterUsername, setEnterPassword, setUsernameColor,
            setPasswordColor, setLoadingCircle)}>

            {badCredentials ?
                <div className="mb-3 light">
                    Username or Password is incorrect
                </div>
                : null
            }

            <div className="mb-3" name='user'>
                <input pattern="[A-Za-z0-9]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" name='username' placeholder='Username'
                    type="text" style={{ border: emptyUsernameColor }} className="form-control"
                    placeholder='Username' />
                {enterUsername ? <label className='form-text light'>Please enter Username/Email</label> : null}
            </div>
            <div className="mb-3" name='pass'>
                <input style={{ border: emptyPasswordColor }} type='password' name='password' placeholder='Passowrd'
                    className="form-control" />
                {enterPassword ? <label className='form-text light'>Please enter Password</label> : null}
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
            <button onClick={() => handleForgotPassword(setForgotPassword)} className="btn btn-secondary mt-2" type='button'>Forgot password?</button>
        </form>
    )
}

const handleLogin = (setLoggedIn, setBadLogin, setEnterUsername, setEnterPassword, setUsernameColor, setPasswordColor, setLoadingCircle) => e => {
    e.preventDefault()
    const username = e.target.children.user.children.username.value
    const password = e.target.children.pass.children.password.value
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
            setLoadingCircle(true)

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
                        setLoadingCircle(false)
                        setLoggedIn(true)
                        await swal({
                            title: "Login successfully",
                            text: 'Welcome',
                            icon: "success",
                            buttons: false,
                            timer: 1500,
                        });
                    } else {
                        setLoadingCircle(false)
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
const handleForgotPassword = (setForgotPassword) => {
    setForgotPassword(true)
}
export default LoginForm;