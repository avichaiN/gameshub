const checkpassword = (setMatchPassword, setPasswordsMatch) => e => {
    const password = e.target.value
    const strengthbar = document.getElementById("meter");
    const passwordStrengthText = document.getElementById('passwordStrengthText')
    const password1 = e.target.parentNode.children.password1.value
    const password2 = e.target.parentNode.children.password2.value

    checkIfPasswordsMatch(setMatchPassword, setPasswordsMatch, password1, password2)

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

const checkIfPasswordsMatch = (setMatchPassword, setPasswordsMatch, password1, password2) => {

    if (password2 === '') {
        setMatchPassword(false)
        setPasswordsMatch('')

    } else if (password1 === password2) {
        setMatchPassword(true)
        setPasswordsMatch('Passwords match.')
    } else {
        setMatchPassword(false)
        setPasswordsMatch('Passwords do not match.')
    }
}
export { checkpassword, checkIfPasswordsMatch }