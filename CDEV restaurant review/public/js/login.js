function login() {
    var loginUser = new XMLHttpRequest();

    loginUser.open("POST", "https://localhost:8080/login", true);
    loginUser.setRequestHeader("Content-Type", "application/json");
    loginUser.onload = function () {
        var result = JSON.parse(loginUser.responseText);
        document.getElementById("loader").style.visibility = "hidden"
        if (result == "User not found! Please create account") {
            document.getElementById("errorMsg").textContent = result
            console.log(result)
        }
        else if (result == "Please activate account!") {
            document.getElementById("errorMsg").textContent = result
            console.log(result)
        }
        else if (result == "Wrong password!") {
            document.getElementById("errorMsg").textContent = result
            console.log(result)
        }
        else if (result.twoFA == "enabled") {
            console.log(result.twoFAtoken)
            document.getElementById("login-form").style.display = "none"
            document.getElementById("2fa-form").style.display = "block"
            var current_url = window.location.href
            var new_url = current_url + "?token=" + result.twoFAtoken
            window.history.replaceState('', '', new_url)
        }
        else {
            console.log({ accessToken: result.accessToken, refreshToken: result.refreshToken });
            sessionStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            window.location.replace('https://127.0.0.1:5501/index.html')
            //window.location.href = "/index.html"
        }
    }

    var input = document.getElementById("input").value;
    var password = document.getElementById("password").value;
    if (input != '' && password != '') {
        document.getElementById("loader").style.visibility = "visible"
        var payload = { input: input, password: password }
        loginUser.send(JSON.stringify(payload));
    }
    else {
        document.getElementById("errorMsg").textContent = "Please enter your username and password"
    }
}

function twoFASignin() {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    var token = params.get("token");
    var key = document.getElementById("token").value
    var twoFA = new XMLHttpRequest();
    twoFA.open("POST", "https://localhost:8080/login/2fa", true);
    twoFA.setRequestHeader("Content-Type", "application/json");
    twoFA.onload = function () {
        var result = JSON.parse(twoFA.responseText);
        if (result.name == "TokenExpiredError") {
            document.getElementById("loader2FA").style.visibility = "hidden"
            var timer = 5
            document.getElementById("errorMsg").innerHTML = "Token has expired. You will be redirected back in 5 seconds"
            var interval = setInterval(function () {
                timer -= 1
                document.getElementById("errorMsg").innerHTML = "Token has expired. You will be redirected back in " + timer
                if (timer == 1) {
                    window.history.pushState("object or string", "Title", "/" + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]);
                    location.reload()
                    clearInterval(interval)
                    return
                }
            }, 1000);
        }
        if (result == false) {
            document.getElementById("loader2FA").style.visibility = "hidden"
            document.getElementById("token").style.borderColor = "red"
            document.getElementById("errorMsg").innerHTML = "Wrong code. Please try again"
        }
        if (result.twoFA == true) {
            document.getElementById("loader2FA").style.visibility = "hiddem"
            sessionStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            window.location.href = 'index.html'
        }
        console.log(result)
    }
    var payload = { token: token, key: key }
    twoFA.send(JSON.stringify(payload));
    document.getElementById("loader2FA").style.visibility = "visible"
}

// google login
function handleCredentialResponse(response) {
    // add to DB response.credential
    const responsePayload = response.credential;

    var loginUserGoogle = new XMLHttpRequest();
    loginUserGoogle.open("POST", "https://localhost:8080/login/google", true);
    loginUserGoogle.setRequestHeader("Content-Type", "application/json");
    loginUserGoogle.onload = function () {
        var result = JSON.parse(loginUserGoogle.responseText);
        console.log(result)
        if (result == "user not found") {
            console.log("user not found")
            document.getElementById("errorMsg").textContent = "User not found! Please create account"
        }
        else if (result.accessToken != null) {
            sessionStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            window.location.href = "/index.html"
        }
        else (
            console.log(result)
        )
    }
    var payload = { token: responsePayload }
    loginUserGoogle.send(JSON.stringify(payload));
}

// facebook login
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        FB.api('/me', { fields: 'first_name, last_name, email, picture' }, function (response) {
            console.log(JSON.stringify(response));
            console.log(response.picture.data.url)
            // check DB and return ID from DB
            var loginUserFacebook = new XMLHttpRequest();
            loginUserFacebook.open("POST", "https://localhost:8080/login/facebook", true);
            loginUserFacebook.setRequestHeader("Content-Type", "application/json");
            loginUserFacebook.onload = function () {
                var result = JSON.parse(loginUserFacebook.responseText);
                if (result == "user not found") {
                    document.getElementById("errorMsg").textContent = "User not found! Please create account"
                    console.log("user not found")
                }
                else if (result.accessToken != null) {
                    sessionStorage.setItem("accessToken", result.accessToken);
                    localStorage.setItem("refreshToken", result.refreshToken);
                    window.location.href = "/index.html"
                }
                else (
                    console.log(result)
                )
            }
            var payload = { ID: response.id }
            loginUserFacebook.send(JSON.stringify(payload));
        });
    }
    else {  // Not logged into your webpage or we are unable to tell.
        document.getElementById("errorMsg").textContent = 'Please log into this webpage.'
    }
}
