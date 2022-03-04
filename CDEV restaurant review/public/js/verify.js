$(document).ready(function() {
    let url= new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    var token = params.get("token");
    console.log(token)
    var request = new XMLHttpRequest();
    request.open("PUT", "https://localhost:8080/confirmation/" + token, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        var response = JSON.parse(request.responseText);
        console.log(response)
        window.location.href = "login.html"
    };
    request.send()
})