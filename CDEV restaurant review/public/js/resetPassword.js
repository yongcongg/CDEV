var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// link to send reset password email
function sendResetLink(){
    var forgetPass = new XMLHttpRequest();

    forgetPass.open("POST", "https://127.0.0.1:8080/forgetPassword", true);
    forgetPass.setRequestHeader("Content-Type", "application/json");
    forgetPass.onload = function (){
        var result = JSON.parse(forgetPass.responseText);
        var toastLiveExample = document.getElementById('liveToast')
        var toast = new bootstrap.Toast(toastLiveExample)
        let results = result.replace(email, '<strong>'+ email +'</strong>')
        document.getElementById("toast-body").innerHTML = results;
        toast.show()
    }
    var email = document.getElementById("email").value;

    if (!email.match(mailformat)){
        document.getElementById("error").textContent = "Please provide a valid email address"
        document.getElementById("email").style.borderColor = 'red';
    }
    else{
        document.getElementById("email").style.borderColor = null;
        document.getElementById("error").textContent = null
        var payload = {email: email}
        forgetPass.send(JSON.stringify(payload));
    }
}

// reset password link
let url= new URL(window.location.href);
let params = new URLSearchParams(url.search);
let token = params.get("token");
if (token == ""){
    document.getElementById('header').textContent = "Error 400."
    document.getElementById('description').textContent = "No token provided"
    document.getElementById('button').style.display = 'none';
    document.getElementById('password').style.display = 'none';
    document.getElementById('confirmPassword').style.display = 'none';
}
function resetPassword(){
    var resetPassword = new XMLHttpRequest();

    resetPassword.open("PUT", "https://localhost:8080/resetPassword/" + token, true);
    resetPassword.setRequestHeader("Content-Type", "application/json");
    resetPassword.onload = function (){
        var result = JSON.parse(resetPassword.responseText);
        if (result == "Invalid Token given"){
            // error
            var toastLiveExample = document.getElementById('liveToast error')
            var toast = new bootstrap.Toast(toastLiveExample)
            document.getElementById("toast-body error").innerHTML = result;
            toast.show()
        }
        if (result.message == "invalid signature"){
            var toastLiveExample = document.getElementById('liveToast error')
            var toast = new bootstrap.Toast(toastLiveExample)
            document.getElementById("toast-body error").innerHTML = "Invalid Token provided";
            toast.show()
        }
        else{
            // successful
            var toastLiveExample = document.getElementById('liveToast')
            var toast = new bootstrap.Toast(toastLiveExample)
            document.getElementById("toast-body").innerHTML = "Successfully resetted password";
            toast.show()
            
        }
        console.log(result)
    }
    var password = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirmPassword").value;
    if (password != confirmPass){
        document.getElementById("error").textContent = "Password does not match"
        document.getElementById("password").style.borderColor = 'red';
        document.getElementById("confirmPassword").style.borderColor = 'red';
    }
    else if (confirmPass == '' && password != ''){
        document.getElementById("error").textContent = "Please confirm password"
        document.getElementById("confirmPassword").style.borderColor = 'red';
    }
    else if (confirmPass == '' && password == ''){
        document.getElementById("error").textContent = "Please enter a new password"
        document.getElementById("password").style.borderColor = 'red';
        document.getElementById("confirmPassword").style.borderColor = 'red';
    }
    else{
        var payload = {password: password}
        resetPassword.send(JSON.stringify(payload));
    }
}