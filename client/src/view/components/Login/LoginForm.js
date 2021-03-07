
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
        <form onSubmit={handleLogin(setLoggedIn, setBadCredentials, setEnterUsername, setEnterPassword, setUsernameColor, setPasswordColor, setLoadingCircle)} className='login__Form'>
            {badCredentials ? <div>sorry wrong info</div> : null}

            <input style={{ border: emptyUsernameColor }} type='text' pattern="[A-Za-z0-9]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" name='username' placeholder='Username' />
            {enterUsername ? <label>Please enter Username/Email</label> : null}
            <input style={{ border: emptyPasswordColor }} type='password' name='password' placeholder='Passowrd' />
            {enterPassword ? <label>Please enter Password</label> : null}
            <button>Login</button>

            <button onClick={() => handleForgotPassword(setForgotPassword)} type='button'>Forgot password?</button>
        </form>
    )
}

const handleLogin = (setLoggedIn, setBadLogin, setEnterUsername, setEnterPassword, setUsernameColor, setPasswordColor, setLoadingCircle) => e => {
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
                        await swal({
                            title: "Login successfully",
                            text: 'Welcome',
                            icon: "success",
                            buttons: false,
                            timer: 1500,
                        });
                        setLoadingCircle(false)
                        setLoggedIn(true)
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