"use strict";

var db = require('../db-connections');

class SocialsDB{
    connectSocials(socials_id, auth_provider, user_account_id, callback){
        var sql = "INSERT INTO socials (external_user_id, authentication_provider, user_account_id) VALUES (?,?,?)"
        db.query(sql, [socials_id, auth_provider, user_account_id], callback)
    }

    facebookConnected(userid, callback){
        var sql = "UPDATE user set facebook = 1 WHERE _id = ?"
        db.query(sql, [userid], callback)
    }

    googleConnected(userid, callback){
        var sql = "UPDATE user set google = 1 WHERE _id = ?"
        db.query(sql, [userid], callback)
    }

    disconnectSocials(userid, provider, callback){
        var sql = "DELETE from socials WHERE user_account_id = ? AND authentication_provider = ?"
        db.query(sql, [userid, provider], callback)
    }

    facebookDisconnected(userid, callback){
        var sql = "UPDATE user set facebook = 0 WHERE _id = ?"
        db.query(sql, [userid], callback)
    }

    googleDisconnected(userid, callback){
        var sql = "UPDATE user set google = 0 WHERE _id = ?"
        db.query(sql, [userid], callback)
    }
}

module.exports = SocialsDB;