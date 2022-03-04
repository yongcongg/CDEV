"use strict";

var db = require('../db-connections');
class UsersDB{
    getUser(userid, callback){
        var sql = "SELECT _id, first_name, last_name, username, email, date_of_birth, gender, address, phone_number, profile_pic, updated_at, verified, twoFA, google, facebook from restaurant_review.user WHERE _id = ?";
        db.query(sql, [userid], callback);
    }

    getUserPasswordUpdatedAt(userid, callback){
        var sql = "SELECT password, updated_at from restaurant_review.user WHERE _id = ?";
        db.query(sql, [userid], callback);
    }

    updateUser(user, callback){
        var sql = "UPDATE user SET first_name = ?, last_name = ?, username = ?, email = ?, gender = ?, address = ?, phone_number = ?, updated_at = ? WHERE _id = ?";
        return db.query(sql, [user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail(), user.getGender(), user.getAddress(), user.getPhoneNumber(), user.getUpdatedAt(), user.getId()], callback);
    }

    updateUserProfilePic(profilePic, user, callback){
        var sql = "UPDATE user SET profile_pic = ? WHERE _id = ?";
        return db.query(sql, [profilePic, user], callback)
    }

    deleteUser(userId, callback){
        var sql = "DELETE from user WHERE _id = ?";
        return db.query(sql, [userId], callback);
    }

    updatePassword(userId, password, datetime, callback){
        var sql = "UPDATE user set password = ?, updated_at = ? WHERE _id = ?";
        return db.query(sql, [password, datetime, userId], callback);
    }

    // deactivate account
    deactivateAccount(id, callback){
        var sql = "UPDATE user SET isDeleted = 1 WHERE _id = ?";
        return db.query(sql, [id], callback);
    }

    activateAccount(id, callback){
        var sql = "UPDATE user SET isDeleted = 0 WHERE _id = ?";
        return db.query(sql, [id], callback);
    }

}

module.exports = UsersDB;