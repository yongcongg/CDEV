"use strict";

class User {
    constructor(id, first_name, last_name, username, email, gender, address, phone_number, password, profile_pic, updated_at) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.email = email
        this.gender = gender;
        this.address = address;
        this.phone_number = phone_number;
        this.password = password;
        this.profile_pic = profile_pic
        this.updated_at = updated_at;
    }

    //add the set and get methods here
    getId() {
        return this.id;
    }
    getFirstName() {
        return this.first_name;
    }
    getLastName() {
        return this.last_name;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getGender() {
        return this.gender;
    }
    getAddress() {
        return this.address;
    }
    getPhoneNumber() {
        return this.phone_number
    }
    getPassword() {
        return this.password
    }
    getProfilePic() {
        return this.profile_pic
    }
    getUpdatedAt() {
        return this.updated_at
    }


    setFirstName(first_name) {
        this.first_name = first_name;
    }
    setLastName(last_name) {
        this.last_name = last_name;
    }
    setUsername(username) {
        this.username = username;
    }
    setEmail(email) {
        this.email = email;
    }
    setGender(gender) {
        this.gender = gender;
    }
    setAddress(address) {
        this.address = address;
    }
    setPhoneNumber(phone_number) {
        this.phone_number = phone_number;
    }
    setPassword(password) {
        this.password = password;
    }
    setProfilePic(profile_pic) {
        this.profilePicture = profile_pic;
    }
    setUpdatedAt(updated_at) {
        this.updated_at = updated_at;
    }

}

module.exports = User;