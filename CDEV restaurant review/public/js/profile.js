var token = sessionStorage.getItem("accessToken")
var currentUser = ""
var username = ""
var email = ""

function checkToken(){
    if(token == null){
        window.location.href = 'index.html'
        console.log("null")
    }
}

function displayUser(user) {
    if(token == null){
        window.location.href = 'index.html'
    }
    else{
        currentUser = user
        document.getElementById('firstName').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>First Name </b></small>" + user[0].first_name + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('lastName').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>Last Name </b></small>" + user[0].last_name + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('username').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>Username </b></small>" + user[0].username + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('email').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>Email </b></small>" + user[0].email + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('gender').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>Gender </b></small>" + user[0].gender + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('address').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>Address </b></small>" + user[0].address + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('phoneNum').innerHTML = "<small class='mr-5' style='color: grey; font-size:small;'><b>Phone Number </b></small>" + user[0].phone_number + "<i style='font-size:15px; float: right;' class='fas'>&#xf105;</i>"
        document.getElementById('userProfilePic').src = user[0].profile_pic
        document.getElementById('firstName1').value = user[0].first_name
        document.getElementById('lastName1').value = user[0].last_name
        document.getElementById('username1').value = user[0].username
        document.getElementById('email1').value = user[0].email
        document.getElementById('gender1').value = user[0].gender
        document.getElementById('address1').value = user[0].address
        document.getElementById('phoneNumber1').value = user[0].phone_number
        username = user[0].username
        email = user[0].email
        if (user[0].twoFA == 1) {
            document.getElementById("twofaDelete").style.display = "block"
            document.getElementById("twofa").style.display = "none"
            document.getElementById("twoFADisplay").innerHTML += "<img src='images/2fa.jpg' height='35px' style='margin-left:20px'>"
            console.log("changed")
        }
        else {
            document.getElementById("twofa").style.display = "block"
            document.getElementById("twofaDelete").style.display = "none"
            document.getElementById("twoFADisplay").innerHTML += "<img src='images/2faNotActive.png' height='35px' style='margin-left:20px'>"
        }
        checkSocials()
    }
    
}

function twofa() {
    document.getElementById('scanQRcode').style.display = "block"
    document.getElementById('verify').style.display = "none"

    var token = sessionStorage.getItem("accessToken")

    var twofaSignUp = new XMLHttpRequest();
    twofaSignUp.open("POST", "https://localhost:8080/user/2fa", true);
    twofaSignUp.setRequestHeader("Authorization", "Bearer " + token);
    twofaSignUp.onload = function () {
        var result = JSON.parse(twofaSignUp.responseText);
        console.log(result)
        document.getElementById('qrcode').src = result
    }
    twofaSignUp.send()
}

function twofaDelete() {
    var token = sessionStorage.getItem("accessToken")
    var twofaRemove = new XMLHttpRequest();
    twofaRemove.open("DELETE", "https://localhost:8080/user/2fa/remove", true);
    twofaRemove.setRequestHeader("Authorization", "Bearer " + token);
    twofaRemove.onload = function () {
        var result = JSON.parse(twofaRemove.responseText);
        console.log(result)
        if (result == "removed") {
            location.reload()
        }
    }
    twofaRemove.send()
}

function verifyTemp() {
    document.getElementById('scanQRcode').style.display = "none"
    document.getElementById('verify').style.display = "block"
}

function verifyTempKey() {
    var tempKey = document.getElementById('tempKey').value

    var twofaSignUp = new XMLHttpRequest();
    twofaSignUp.open("POST", "https://localhost:8080/user/2fa/confirm", true);
    twofaSignUp.setRequestHeader("Authorization", "Bearer " + token);
    twofaSignUp.setRequestHeader("Content-Type", "application/json")
    twofaSignUp.onload = function () {
        var result = JSON.parse(twofaSignUp.responseText);
        if (result == "success") {
            location.reload()
        }
        if (result == false){
            document.getElementById('twoFAError').innerHTML = "The code is incorrect"
            document.getElementById('tempKey').style.borderColor = "red"
        }
        console.log(result)
    }
    var payload = { token: tempKey }
    twofaSignUp.send(JSON.stringify(payload))
    console.log(payload)
}

function deleteTempSecret() {
    var tempSecretDelete = new XMLHttpRequest();
    tempSecretDelete.open("DELETE", "https://localhost:8080/user/tempSecretDelete", true);
    tempSecretDelete.setRequestHeader("Authorization", "Bearer " + token);
    tempSecretDelete.onload = function () {
        var result = JSON.parse(tempSecretDelete.responseText);
        console.log(result)
    }
    tempSecretDelete.send()
}

// connect with google account
function handleCredentialResponse(response) {
    // add to DB response.credential
    const responsePayload = response.credential;
    var connectUserGoogle = new XMLHttpRequest();
    connectUserGoogle.open("POST", "https://localhost:8080/user/connect/google", true);
    connectUserGoogle.setRequestHeader("Content-Type", "application/json");
    connectUserGoogle.setRequestHeader("Authorization", "Bearer " + token);
    connectUserGoogle.onload = function () {
        var result = JSON.parse(connectUserGoogle.responseText);
        console.log(result)
        location.reload()
    }
    var payload = { token: responsePayload, provider: "Google" }
    connectUserGoogle.send(JSON.stringify(payload));
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "416420044948-7fvi2dlmiorfugq6paj1ptal6ntger5v.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", shape: "rectangular", text: "signin", logo_alignment: "left" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}

// connect with facebook
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        FB.api('/me', { fields: 'first_name, last_name, email, picture' }, function (response) {
            console.log(JSON.stringify(response));
            // check DB and return ID from DB
            var loginUserFacebook = new XMLHttpRequest();
            loginUserFacebook.open("POST", "https://localhost:8080/user/connect/facebook", true);
            loginUserFacebook.setRequestHeader("Content-Type", "application/json");
            loginUserFacebook.setRequestHeader("Authorization", "Bearer " + token);
            loginUserFacebook.onload = function () {
                var result = JSON.parse(loginUserFacebook.responseText);
                if (result == "user not found") {
                    console.log("user not found")
                }
                else if (result.accessToken != null) {
                    sessionStorage.setItem("accessToken", result.accessToken);
                    localStorage.setItem("refreshToken", result.refreshToken);
                    window.location.href = "/index.html"
                }
                else {
                    console.log(result)
                    location.reload()
                }
                    
            }
            var payload = { id: response.id, provider: "Facebook" }
            loginUserFacebook.send(JSON.stringify(payload));
        });
    }
    else {  // Not logged into your webpage or we are unable to tell.
        console.log('error')
    }
}

function profile() {
    document.getElementById("profileTab").className = "nav-link active"
    document.getElementById("securityTab").className = "nav-link"
    document.getElementById("profileView").style.display = "block"
    document.getElementById("security").style.display = "none"
}

function security() {
    document.getElementById("profileTab").className = "nav-link"
    document.getElementById("securityTab").className = "nav-link active"
    document.getElementById("profileView").style.display = "none"
    document.getElementById("security").style.display = "block"
}

function editName() {
    document.getElementById('firstName1').value = currentUser[0].first_name
    document.getElementById('lastName1').value = currentUser[0].last_name
    document.getElementById("firstNameFormGroup").style.display = "block"
    document.getElementById("lastNameFormGroup").style.display = "block"
    document.getElementById("usernameFormGroup").style.display = "none"
    document.getElementById("emailFormGroup").style.display = "none"
    document.getElementById("genderFormGroup").style.display = "none"
    document.getElementById("addressFormGroup").style.display = "none"
    document.getElementById("phoneNumberFormGroup").style.display = "none"
}

function editUsername() {
    document.getElementById("username1").style.borderColor = "grey";
    document.getElementById('username1').value = currentUser[0].username
    document.getElementById("username1Error").innerHTML = ""
    document.getElementById("firstNameFormGroup").style.display = "none"
    document.getElementById("lastNameFormGroup").style.display = "none"
    document.getElementById("usernameFormGroup").style.display = "block"
    document.getElementById("emailFormGroup").style.display = "none"
    document.getElementById("genderFormGroup").style.display = "none"
    document.getElementById("addressFormGroup").style.display = "none"
    document.getElementById("phoneNumberFormGroup").style.display = "none"
}

function editGender() {
    document.getElementById('gender1').value = currentUser[0].gender
    document.getElementById("firstNameFormGroup").style.display = "none"
    document.getElementById("lastNameFormGroup").style.display = "none"
    document.getElementById("usernameFormGroup").style.display = "none"
    document.getElementById("emailFormGroup").style.display = "none"
    document.getElementById("genderFormGroup").style.display = "block"
    document.getElementById("addressFormGroup").style.display = "none"
    document.getElementById("phoneNumberFormGroup").style.display = "none"
}

function editEmail() {
    document.getElementById("email1").style.borderColor = "grey";
    document.getElementById('email1').value = currentUser[0].email
    document.getElementById("email1Error").innerHTML = ""
    document.getElementById("firstNameFormGroup").style.display = "none"
    document.getElementById("lastNameFormGroup").style.display = "none"
    document.getElementById("usernameFormGroup").style.display = "none"
    document.getElementById("emailFormGroup").style.display = "block"
    document.getElementById("genderFormGroup").style.display = "none"
    document.getElementById("addressFormGroup").style.display = "none"
    document.getElementById("phoneNumberFormGroup").style.display = "none"
}

function editAddress() {
    document.getElementById('address1').value = currentUser[0].address
    document.getElementById("firstNameFormGroup").style.display = "none"
    document.getElementById("lastNameFormGroup").style.display = "none"
    document.getElementById("usernameFormGroup").style.display = "none"
    document.getElementById("emailFormGroup").style.display = "none"
    document.getElementById("genderFormGroup").style.display = "none"
    document.getElementById("addressFormGroup").style.display = "block"
    document.getElementById("phoneNumberFormGroup").style.display = "none"
}

function editPhoneNum() {
    document.getElementById('phoneNumber1').value = currentUser[0].phone_number
    document.getElementById("firstNameFormGroup").style.display = "none"
    document.getElementById("lastNameFormGroup").style.display = "none"
    document.getElementById("usernameFormGroup").style.display = "none"
    document.getElementById("emailFormGroup").style.display = "none"
    document.getElementById("genderFormGroup").style.display = "none"
    document.getElementById("addressFormGroup").style.display = "none"
    document.getElementById("phoneNumberFormGroup").style.display = "block"
}

function checkUsername() {
    var usernameInput = document.getElementById("username1").value;
    if (usernameInput == "") {
        document.getElementById("username1").style.borderColor = "red";
        console.log("empty");
    }
    else {
        var check = new XMLHttpRequest();
        check.open("POST", "https://localhost:8080/username", true);
        check.setRequestHeader("Content-Type", "application/json");
        check.onload = function () {
            var result = JSON.parse(check.responseText);
            if (document.getElementById("username1").value == username) {
                document.getElementById("username1").style.borderColor = "green"
                document.getElementById("username1Error").innerHTML = ""
                document.getElementById("saveButton").className = "btn btn-primary"
                console.log("not taken")
            }
            else if (result == "taken") {
                document.getElementById("username1").style.borderColor = "red"
                document.getElementById("username1Error").innerHTML = "Sorry this username is taken"
                document.getElementById("saveButton").className = "btn btn-primary disabled"
                console.log(result)
            }
            else {
                document.getElementById("username1").style.borderColor = "green"
                document.getElementById("username1Error").innerHTML = ""
                document.getElementById("saveButton").className = "btn btn-primary"
                console.log("not taken")
            }
        }
        var payload = { username: usernameInput }
        check.send(JSON.stringify(payload));
    }
}

function checkEmail() {
    var input = document.getElementById("email1").value;
    if (input == "") {
        document.getElementById("email1").style.borderColor = "red";
        console.log("empty");
    }
    else {
        var checkEmail = new XMLHttpRequest();
        checkEmail.open("POST", "https://localhost:8080/email", true);
        checkEmail.setRequestHeader("Content-Type", "application/json");
        checkEmail.onload = function () {
            var result = JSON.parse(checkEmail.responseText);
            if (document.getElementById("email1").value == email) {
                document.getElementById("email1").style.borderColor = "green";
                document.getElementById("saveButton").className = "btn btn-primary"
                console.log("valid");
                document.getElementById("email1Error").innerHTML = ""
            }
            else if (result == "taken") {
                document.getElementById("email1").style.borderColor = "red";
                document.getElementById("email1Error").innerHTML = result
                document.getElementById("saveButton").className = "btn btn-primary disabled"
                console.log("taken");
            }
            else if (result == "invalid") {
                document.getElementById("email1").style.borderColor = "red";
                document.getElementById("email1Error").innerHTML = result
                document.getElementById("saveButton").className = "btn btn-primary disabled"
                console.log(result);
            }
            else {
                document.getElementById("email1").style.borderColor = "green";
                document.getElementById("saveButton").className = "btn btn-primary"
                console.log("valid");
                document.getElementById("email1Error").innerHTML = ""
            }
        }
        var payload = { input: input }
        checkEmail.send(JSON.stringify(payload));
    }
}

function update() {
    var firstName = document.getElementById("firstName1").value
    var lastName = document.getElementById("lastName1").value
    var username = document.getElementById("username1").value
    var email = document.getElementById("email1").value
    var gender = document.getElementById("gender1").value
    if(gender == ""){
        gender = null
    }
    var address = document.getElementById("address1").value
    if(address == ""){
        address = null
    }
    var phoneNum = document.getElementById("phoneNumber1").value
    if(phoneNum == ""){
        phoneNum = null
    }
    var update = new XMLHttpRequest();
    update.open("PUT", "https://localhost:8080/user", true);
    update.setRequestHeader("Content-Type", "application/json");
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        console.log(result)
        location.reload()
    }
    var payload = { first_name: firstName, last_name: lastName, username: username, email: email, gender: gender, address: address, phone_number: phoneNum }
    if(username == ""){
        alert("Please fill up username")
    }
    else if(email == ""){
        alert("Please fill up email")
    }
    else{
        update.send(JSON.stringify(payload));
    }
    
}

function updateProfilePic() {
    var profilePic = document.getElementById("target").src
    var update = new XMLHttpRequest();
    update.open("PUT", "https://localhost:8080/user/profilePic", true);
    update.setRequestHeader("Content-Type", "application/json");
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        console.log(result)
        location.reload()
    }
    var payload = { profilePic: profilePic }
    update.send(JSON.stringify(payload));
}

function openEditProfilePicModal() {
    document.getElementById("target").src = ""
    const image_drop_area = document.getElementById("image_drop_area");
    image_drop_area.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
    });

    image_drop_area.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        readImage(fileList[0]);
    });

    readImage = (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            picture = event.target.result;
            console.log(picture);
            document.getElementById('target').src = picture
        });
        reader.readAsDataURL(file);
    }
}

function defaultProfilePic(){
    var profilePic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURbOzs////9ra2tYEXekAAATcSURBVHja7Z09bttAFIRFAizonkdgkVvwCCq8hOCKZZBT8BLs0wgIcsokCPLjxCbfSpz9LHnmAvth9s17K4paHQ6WZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWdbGWlL6iAOm7xhkGQAkSTfATID3RAOkjmIKfmmmAEQLofgGkiQaAktD/BkgnGoCpwybBFvwNgFjwDICwoE2wBc8BTjRAwgEmtgiJibA8B0hD4fXP/6xfugzb9J+KJrH+f/2yZdi/ADCyG1B2D5YXAU6wAQX34GUDyrWCh1fWL7YH/WsAiesBRVtB+zrACS3BUjlY2YEyOWjWAI7sDhTZg9UdKDEP2nUAfRC7dQB9ENfX1xdBtQEgL4JmC+DIloC+CLbWVxfBZgmoi6DZBtB2gn4bQFuFyzbAI1uD4nNZFQFQVmEbARjYGtRWYRcBOLEhkMagjqyvbMahEChj0MYAdDFoYgATm0JlDrsYwIlNoRIgtr6uEdRBgJEGSHAf0nWilgZoogADDTCxjfANABzZTqxrhTjAkuBejAOkmwEY7xQgPAxV49AAVRxgph2Y79OBWwIYDGAAAxjAAJ4FdsAHEgMYwAAGMIABDOBnRO/+MZ0dMIAB7hTgYAADvPsU9DRAgsdxmwFwgndAY8GSAzChGdDsQZUFMLI1KAlikwcwsyFQPKztaIAlD2C6P4B0YwBHO/DuHTDAcH8Ay40B7D+OuxsDgE/lijMhDpB3JhS8V5t3KsY/F+AAgvfra3gWZQ6DQQCwsI0wsxUqAHq2D+V1Isn7/fgzopptA3k5HCQACxuCrBzSj2pFP/Fo2RTmzEPRb81qdBZm5XAQAXRsCjNiIFo/PI5kP3yuyFGUEwPdr+/hFIbH0SwD6NkQRGMgvIWjZVMYzaHyJhY4BMEYDEKAjk1hMIfC9UMxkN5JVcEhCI0j7bVgcApDMRikAD0bgsg4Et/O17IpjMQAvyBRfUXkwoYgkMP5AMdAvP5mDPCLUvGrYvUXFi/kKArEYJAD9GwItmJQ4MroihxF2+MIv7V7KgDQsSHYmAYF1l+NAX53fZnb++EQrMZgKgLQc8ehrSos9D8iFdmI16vwWAhgYWtwpQrnQgAdW4Ovb8EjDVCqBg/kLF6dRqUMqOgSqOgQtPQWNHQR9m+2E5fqAx09jRf4PHKgT2Q1+7loFeCINsJiVdjCn8xWP5zOaBso1QsX+sMp/Iho4yEV/YCkRBF08LPqA/y0fvNxvbwTbH1zOZFdoEQQt7+4nNkdUO9B4P2BR9gA7R6E3uc7wQakcWYNeAN/Z8T/lQ3+FxaiIHyIv93/hG7AD31EN+CHPlMJkDWDzDs4dieoU0IJ6iVdoB3r4Jwu0heoAP/oU/EOJOlID+kK7VCKV62/A8FlAdiP4Or1ryU4p+s1wutfc0D5kPbRBK9/6RHpYbf1LyuDOu2oSzZh2RNgLDiBdjoltmlnzWABXNIMzrsD5FnQ7r9+1rcZtWD9rCD0CoCMXiAxIMeCswYgXIataP1wEnsVwIhWQLwMGx1AbA86HUDsGx3h+iNcAsHnyAmugZoGsAN2wA7YATtgB+yAHbADdsAO2AE7YAfsgB2wA3bADtgBO2AH7IAdsAO4A5ZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWdZ70zfEOlBzdVBO/QAAAABJRU5ErkJggg=="
    var update = new XMLHttpRequest();
    update.open("PUT", "https://localhost:8080/user/profilePic", true);
    update.setRequestHeader("Content-Type", "application/json");
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        console.log(result)
        location.reload()
    }
    var payload = { profilePic: profilePic }
    update.send(JSON.stringify(payload));
}


function closeModal() {
    document.getElementById('firstName1').value = currentUser[0].first_name
    document.getElementById('lastName1').value = currentUser[0].last_name
    document.getElementById('username1').value = currentUser[0].username
    document.getElementById('email1').value = currentUser[0].email
    document.getElementById('gender1').value = currentUser[0].gender
    document.getElementById('address1').value = currentUser[0].address
    document.getElementById('phoneNumber1').value = currentUser[0].phone_number
}

function checkSocials() {
    if (currentUser[0].facebook == 0) {
        console.log("you can connect with facebook")
    }
    if (currentUser[0].google == 0) {
        console.log("you can connect with Google")
    }
    if (currentUser[0].facebook == 1) {
        console.log("you are connected with Facebook")
        document.querySelector('#facebookButton').style.display = "none"
        document.querySelector('#facebookConnected').style.display = "inline-block"
    }
    if (currentUser[0].google == 1) {
        console.log("you are connected with Google")
        document.querySelector('#googleConnected').style.display = "inline-block"
        document.querySelector('#buttonDiv').style.display = "none"
    }
}

function checkSocialStatus(){
    if (currentUser[0].facebook == 0) {
        document.querySelector('#facebookModalHeader').innerHTML = "Connect with Facebook now!"
        document.querySelector('#facebookButtonModal').style.display = "block"
    }
    if (currentUser[0].google == 0) {
        document.querySelector('#googleModalHeader').innerHTML = "Connect with Google now!"
        console.log("you can connect with Google")
    }
    if (currentUser[0].facebook == 1) {
        console.log("you are connected with Facebook")
        document.querySelector('#disconnectFacebookButton').style.display = "block"
        document.querySelector('#facebookButton').style.display = "none"
        document.querySelector('#facebookConnected').style.display = "inline-block"
    }
    if (currentUser[0].google == 1) {
        console.log("you are connected with Google")
        document.querySelector('#disconnectGoogleButton').style.display = "block"
        document.querySelector('#googleConnected').style.display = "inline-block"
        document.querySelector('#buttonDiv').style.display = "none"
    }
}

function disconnectFacebook(){
    var update = new XMLHttpRequest();
    update.open("DELETE", "https://localhost:8080/user/connect/facebook", true);
    update.setRequestHeader("Content-Type", "application/json");
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        console.log(result)
        location.reload()
    }
    update.send();
}

function disconnectGoogle(){
    var update = new XMLHttpRequest();
    update.open("DELETE", "https://localhost:8080/user/connect/google", true);
    update.setRequestHeader("Content-Type", "application/json");
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        console.log(result)
        location.reload()
    }
    update.send();
}

function changePassword(){
    var currentPassword = document.getElementById('currentPass').value
    var newPassword = document.getElementById('newPass').value
    var result = zxcvbn(newPassword)
    var confirmNewPass = document.getElementById('confirmNewPass').value
    var update = new XMLHttpRequest();
    update.open("PUT", "https://localhost:8080/updatePassword", true);
    update.setRequestHeader("Content-Type", "application/json");
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        if(result == "Current password input is not valid"){
            document.getElementById('currentPass').style.borderColor = "red"
            document.getElementById('changePassErr').innerHTML = result
            document.getElementById('changePassErr').style.color = "red"
            console.log(result)
        }
        else if(result == "Password has been updated!"){
            document.getElementById('changePassErr').style.color = "green"
            document.getElementById('changePassErr').innerHTML = result
            console.log(result)
        }
        else{
            console.log(result)
        }
        console.log(result)
    }
    if(newPassword != confirmNewPass){
        document.getElementById('newPass').style.borderColor = "red"
        document.getElementById('confirmNewPass').style.borderColor = "red"
        document.getElementById('changePassErr').innerHTML = "Please ensure that your password matches"
    }
    if(result.score <= 2){
        var newPassword = document.getElementById('newPass').style.borderColor = "red"
    }
    else{
        var payload = {currentPassword : currentPassword, newPassword: newPassword}
        update.send(JSON.stringify(payload));
        document.getElementById('newPass').style.borderColor = "grey"
        document.getElementById('confirmNewPass').style.borderColor = "grey"
    }
    
}

function deleteAccount(){
    var update = new XMLHttpRequest();
    update.open("DELETE", "https://localhost:8080/user", true);
    update.setRequestHeader("Authorization", "Bearer " + token)
    update.onload = function () {
        var result = JSON.parse(update.responseText)
        console.log(result)
        sessionStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = "index.html"
    }
    update.send();
}

function passwordStrength() {
    var password = document.getElementById("newPass").value;
    var result = zxcvbn(password)
    if (result.score == 0) {
        document.getElementById("password-meter-inner").style.width = "10%"
        document.getElementById("password-meter-inner").style.background = "red"
        document.getElementById("newPass").style.borderColor = "red";
        document.getElementById('passwordError').style.display = "block"
        document.getElementById('passwordError').innerHTML = result.feedback.suggestions
    }
    if (result.score == 1) {
        document.getElementById("password-meter-inner").style.width = "30%"
        document.getElementById("password-meter-inner").style.background = "red"
        document.getElementById("newPass").style.borderColor = "red";
        document.getElementById('passwordError').style.display = "block"
        document.getElementById('passwordError').innerHTML = result.feedback.suggestions
    }
    if (result.score == 2) {
        document.getElementById("password-meter-inner").style.width = "50%"
        document.getElementById("password-meter-inner").style.background = "orange"
        document.getElementById("newPass").style.borderColor = "orange";
        document.getElementById('passwordError').style.display = "block"
        document.getElementById('passwordError').innerHTML = result.feedback.suggestions
    }
    if (result.score == 3) {
        document.getElementById("password-meter-inner").style.width = "80%"
        document.getElementById("password-meter-inner").style.background = "green"
        document.getElementById("newPass").style.borderColor = "green";
        document.getElementById('passwordError').style.display = "none"
    }
    if (result.score == 4) {
        document.getElementById("password-meter-inner").style.width = "100%"
        document.getElementById("password-meter-inner").style.background = "green"
        document.getElementById("newPass").style.borderColor = "green";
        document.getElementById('passwordError').style.display = "none"
    }
}

function resetChangePassModal(){
    document.getElementById('currentPass').value = ""
    document.getElementById('newPass').value = ""
    document.getElementById('confirmNewPass').value = ""
    document.getElementById('passwordError').innerHTML = ""
    document.getElementById('changePassErr').innerHTML = ""
    document.getElementById('newPass').style.borderColor = "grey"
    document.getElementById('currentPass').style.borderColor = "grey"
    document.getElementById('confirmNewPass').style.borderColor = "grey"
}
