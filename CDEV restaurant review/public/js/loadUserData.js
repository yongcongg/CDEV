var token = sessionStorage.getItem("accessToken");
$(document).ready(function() {
    if(token != null){
        var user = new XMLHttpRequest();
        user.open("GET", "https://localhost:8080/user", true);
        user.setRequestHeader("Authorization", "Bearer " + token);
        user.onload = function () {
            var result = JSON.parse(user.responseText);
            if (result.name == "TokenExpiredError"){
                refreshToken()
                location.reload()
            }
            if (result.name == "JsonWebTokenError"){
                window.location.href = "https://127.0.0.1:5501/login.html";
            }
            else{
                username = result[0].username

                document.getElementById('profilePic').setAttribute('src', result[0].profile_pic)
                document.getElementById('signupMenu').style.display = "none"
                document.getElementById('loginMenu').style.display = "none"
                document.getElementById('profileMenu').style.display = "block"
                document.getElementById('usernameDisplay').innerHTML = username
                document.getElementById('usernameMenu').style.display = "block"
                
                currentUser = result
                console.log(result)
                userid = result[0]._id
                firstName = result[0].firstName
                lastName = result[0].lastName
                email = result[0].email
                dateOfBirth = result[0].date_of_birth
                gender = result[0].date_of_birth
                address = result[0].address
                phoneNumber = result[0].phone_number
                profilePic = result[0].profile_pic

                displayUser(result)
            }
        }
        user.send()
    }
});

setInterval(refreshToken, 600000);
function refreshToken() {
    var token = localStorage.getItem("refreshToken")
    if (token != null) {
        // silent refresh
        var refreshToken = new XMLHttpRequest();
        refreshToken.open("POST", "https://localhost:8080/token", true);
        refreshToken.setRequestHeader("Content-Type", "application/json");
        refreshToken.onload = function () {
            var result = JSON.parse(refreshToken.responseText);
            if (result.name == "TokenExpiredError"){
                window.location.href = "https://127.0.0.1:5501/login.html"
            }
            sessionStorage.setItem("accessToken", result.accessToken);
            console.log("silent refresh")
        }
        var payload = { token: token }
        refreshToken.send(JSON.stringify(payload));
    }
}