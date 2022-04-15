var emailTaken = true
var usernameTaken = true

function register() {
    var registerUser = new XMLHttpRequest();

    registerUser.open("POST", "https://127.0.0.1:8080/signup", true);
    registerUser.setRequestHeader("Content-Type", "application/json");
    registerUser.onload = function () {
        var result = JSON.parse(registerUser.responseText);
        if (result.invalid == 'true') {
            alert("\ninvalid Email")
        }
        else {
            alert(result)
        }
    }

    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var sel = document.getElementById("gender");
    var gender = sel.options[sel.selectedIndex].text;
    if (gender == 'Gender') gender = null
    var address = document.getElementById("address").value;
    var phone_number = document.getElementById("phoneNumber").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var result = zxcvbn(password)
    if (password != confirmPassword) {
        console.log("Password do not match")
        alert("\nPassword did not match: Please try again...")
    }

    else if (result.score <= 2) {
        alert("Please create a stronger password... \n" + result.feedback.suggestions)
    }

    else if (usernameTaken == true) {
        document.getElementById("username").style.borderColor = "red"
        document.getElementById("usernameError").innerHTML = "taken"
        console.log("taken")
    }

    else if (emailTaken == true) {
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("emailError").innerHTML = "taken";
        console.log("taken");
    }

    else if (password && username && firstName && lastName && email && confirmPassword != '') {
        document.getElementById("loader").style.visibility = "visible"
        var payload = { username: username, first_name: firstName, email: email, last_name: lastName, gender: gender, address: address, phoneNumber: phone_number, password: password }
        registerUser.send(JSON.stringify(payload));
    }
}

// google signup
function handleCredentialResponse(response) {
    // add to DB response.credential
    const responsePayload = response.credential;
    var signupUserGoogle = new XMLHttpRequest();
    signupUserGoogle.open("POST", "https://localhost:8080/signup/google", true);
    signupUserGoogle.setRequestHeader("Content-Type", "application/json");
    signupUserGoogle.onload = function () {
        var result = JSON.parse(signupUserGoogle.responseText);
        if (result == "signed up with Google successfully"){
            alert("Signed up with Google successfully. Procees to Login")
        }
        else if (result == "An account has already been registered with this email. Please login") {
            alert(result)
        }
        console.log(result)
    }
    var payload = { token: responsePayload, provider: "Google" }
    signupUserGoogle.send(JSON.stringify(payload));
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "client_id",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", shape: "pill", text: "signup_with", logo_alignment: "left", width: "400px" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}

// facebook signUp
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        FB.api('/me', { fields: 'first_name, last_name, email, picture' }, function (response) {
            // check DB and sign user up
            var signupUserFacebook = new XMLHttpRequest();
            signupUserFacebook.open("POST", "https://localhost:8080/signup/facebook", true);
            signupUserFacebook.setRequestHeader("Content-Type", "application/json");
            signupUserFacebook.onload = function () {
                var result = JSON.parse(signupUserFacebook.responseText);
                if (result == "signed up with Facebook successfully"){
                    alert(result)
                }
                else if (result == "An account has already been registered with this email. Please login"){
                    alert(result)
                }
                console.log(result)
            }
            var payload = { id: response.id, firstName: response.first_name, lastName: response.last_name, email: response.email, profilePic: response.picture.data.url }
            signupUserFacebook.send(JSON.stringify(payload));
        });
    }
    else {  // Not logged into your webpage or we are unable to tell.
        console.log('Please log into this webpage.')
    }
}

function checkUsername() {
    var username = document.getElementById("username").value;
    if (username == "") {
        document.getElementById("username").style.borderColor = "red";
        console.log("empty");
    }
    else {
        var check = new XMLHttpRequest();
        check.open("POST", "https://localhost:8080/username", true);
        check.setRequestHeader("Content-Type", "application/json");
        check.onload = function () {
            var result = JSON.parse(check.responseText);
            if (result == "taken") {
                document.getElementById("username").style.borderColor = "red"
                document.getElementById("usernameError").innerHTML = "taken"
                document.getElementById("usernameError").style.display = "block"
                console.log("taken")
            }
            else {
                document.getElementById("username").style.borderColor = "green"
                document.getElementById("usernameError").style.display = "none"
                console.log("not taken")
                usernameTaken = false
            }
        }
        var payload = { username: username }
        check.send(JSON.stringify(payload));
    }
}

function checkEmail() {
    var input = document.getElementById("email").value;
    if (input == "") {
        document.getElementById("email").style.borderColor = "red";
        console.log("empty");
    }
    else {
        var checkEmail = new XMLHttpRequest();
        checkEmail.open("POST", "https://localhost:8080/email", true);
        checkEmail.setRequestHeader("Content-Type", "application/json");
        checkEmail.onload = function () {
            var result = JSON.parse(checkEmail.responseText);
            if (result == "taken") {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("emailError").innerHTML = "taken";
                document.getElementById("emailError").style.display = "block";
                console.log("taken");
            }
            else if (result == "invalid") {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("emailError").innerHTML = "Invalid email format";
                document.getElementById("emailError").style.display = "block";
                emailTaken = false
                console.log(result);
            }
            else {
                document.getElementById("email").style.borderColor = "green";
                document.getElementById("emailError").style.display = "none";
                console.log("valid");
                emailTaken = false
            }
        }
        var payload = { input: input }
        checkEmail.send(JSON.stringify(payload));
    }
}

function checkPassword() {
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirmPassword").value;
    var result = zxcvbn(password)
    if (password != confirm) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
    }
    else if (result.score <= 2) {
        document.getElementById("password").style.borderColor = "red";
    }
    else if (password == confirm && password != '' && confirm != '') {
        document.getElementById("password").style.borderColor = "green";
        document.getElementById("confirmPassword").style.borderColor = "green";
    }
    else {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
        console.log("empty")
    }
}

function passwordStrength() {
    var password = document.getElementById("password").value;
    var result = zxcvbn(password)
    if (result.score == 0) {
        document.getElementById("password-meter-inner").style.width = "10%"
        document.getElementById("password-meter-inner").style.background = "red"
        document.getElementById("password").style.borderColor = "red";
        document.getElementById('passwordError').style.display = "block"
        document.getElementById('passwordError').innerHTML = result.feedback.suggestions
    }
    if (result.score == 1) {
        document.getElementById("password-meter-inner").style.width = "30%"
        document.getElementById("password-meter-inner").style.background = "red"
        document.getElementById("password").style.borderColor = "red";
        document.getElementById('passwordError').style.display = "block"
        document.getElementById('passwordError').innerHTML = result.feedback.suggestions
    }
    if (result.score == 2) {
        document.getElementById("password-meter-inner").style.width = "50%"
        document.getElementById("password-meter-inner").style.background = "orange"
        document.getElementById("password").style.borderColor = "orange";
        document.getElementById('passwordError').style.display = "block"
        document.getElementById('passwordError').innerHTML = result.feedback.suggestions
    }
    if (result.score == 3) {
        document.getElementById("password-meter-inner").style.width = "80%"
        document.getElementById("password-meter-inner").style.background = "green"
        document.getElementById("password").style.borderColor = "green";
        document.getElementById('passwordError').style.display = "none"
    }
    if (result.score == 4) {
        document.getElementById("password-meter-inner").style.width = "100%"
        document.getElementById("password-meter-inner").style.background = "green"
        document.getElementById("password").style.borderColor = "green";
        document.getElementById('passwordError').style.display = "none"
    }
}
