function logout() {
    var token = localStorage.getItem("refreshToken")

    var logout = new XMLHttpRequest();
    logout.open("DELETE", "https://localhost:8080/logout", true);
    logout.setRequestHeader("Content-Type", "application/json");
    logout.onload = function () {
        var result = JSON.parse(logout.responseText);
        console.log(result)  
        sessionStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "login.html"
    }
    var payload = { token: token }
    logout.send(JSON.stringify(payload));
}




