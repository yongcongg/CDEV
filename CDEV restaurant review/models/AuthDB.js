"use strict"

var db = require('../db-connections');

const validator = require("validator");

class AuthDB{

    // sign up
    signUp(user, callback){ //same code as in workbench, but values change to ??
        var sql = "INSERT INTO user (first_name, last_name, username, email, gender, address, phone_number,password, updated_at, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail(), user.getGender(), user.getAddress(), user.getPhoneNumber(), user.getPassword(), user.getUpdatedAt(), user.getProfilePic()], callback);
    }

    // login
    authUser(usernameOrEmail, callback){
        if (validator.isEmail(usernameOrEmail)){
            var sql = "SELECT * FROM user WHERE email = ?";
            db.query(sql, [usernameOrEmail], callback);
        }
        else{
            var sql = "SELECT * FROM user WHERE username = ?";
            db.query(sql, [usernameOrEmail], callback);
        }
    }

    checkUsername(username, callback){
        var sql = "SELECT username FROM user WHERE username = ?";
        db.query(sql, [username], callback);
    }

    checkEmail(input, callback){
        var sql = "SELECT email FROM user WHERE email = ?";
        db.query(sql, [input], callback);
    }

    // activate account
    activateAccount(id, callback){
        var sql = "UPDATE user SET verified = 1 WHERE _id = ?";
        db.query(sql, [id], callback);
    }


    // finding userID by email
    identifyIdFromEmail(email, callback){
        var sql = "SELECT _id FROM user WHERE email = ?";
        return db.query(sql, [email], callback);
    }

    // reset password
    resetPassword(password, updateDate, _id, callback){
        var sql = "UPDATE user SET password = ?, updated_at = ? WHERE _id = ?"
        return db.query(sql, [password, updateDate, _id], callback);
    }

    // check if tokem is in whitelist 
    getToken(token, callback){
        var sql = "SELECT * FROM session WHERE token = ?"
        return db.query(sql, [token], callback);
    }

    // whitelist tokens when issued
    whitelistToken(token, expire, callback){
        var sql = "INSERT INTO session (token, expire) VALUES (?, ?)"
        db.query(sql, [token, expire], callback);
    }

    // logout
    logout(refreshToken, callback){
        var sql = "DELETE FROM session WHERE token = ?"
        return db.query(sql, [refreshToken], callback);
    }

    signupSocial(socials_id, auth_provider, user_account_id, callback){
        var sql = `INSERT INTO socials (external_user_id, authentication_provider, user_account_id) VALUES (?,?,?)`;
        db.query(sql, [socials_id, auth_provider, user_account_id], callback)
    }

    loginSocial(id, callback){
        var sql = "SELECT * FROM socials WHERE external_user_id = ?";
        return db.query(sql, [id], callback);
    }

    // add temp secret
    addTempSecret(user, tempSecret, callback){
        var sql = "INSERT INTO temp_secret (userid, temp_secret) VALUES (?,?)";
        db.query(sql, [user, tempSecret], callback);
    }

    // get temp secret
    twofaSecretTemp(user, callback){
        var sql = 'SELECT * FROM temp_secret WHERE userid = ?';
        db.query(sql, [user], callback);
    }

    // remove temp secret after verifying
    removeSecretTemp(user, callback){
        var sql = 'DELETE FROM temp_secret WHERE userid = ?';
        db.query(sql, [user], callback);
    }

    // adding secret
    twoFA(user, secret, callback){
        var sql = "INSERT INTO twofa (user_id, secret) VALUES (?,?)";
        db.query(sql, [user, secret], callback);
    }

    // get secret
    twofaSecret(user, callback){
        var sql = 'SELECT * FROM twofa WHERE user_id = ?';
        db.query(sql, [user], callback);
    }

    // remove 2FA
    removetwoFA(user, callback){
        var sql = 'DELETE FROM twofa WHERE user_id = ?';
        db.query(sql, [user], callback);
    }

    twoFaUserUpdate(_id, callback){
        var sql = "UPDATE user SET twoFA = 1 WHERE _id = ?"
        return db.query(sql, [_id], callback);
    }

    twoFaUserDeleteUpdate(_id, callback){
        var sql = "UPDATE user SET twoFA = 0 WHERE _id = ?"
        return db.query(sql, [_id], callback);
    }

}

module.exports = AuthDB;