var d = new Date();
var epoch = d.getTime() / 1000;
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
            console.log(result)
            if (result.name == "TokenExpiredError"){
                window.location.href = "https://127.0.0.1:5501/login.html"
            }
            sessionStorage.setItem("accessToken", result.accessToken);
        }
        var payload = { token: token }
        refreshToken.send(JSON.stringify(payload));
    }
}