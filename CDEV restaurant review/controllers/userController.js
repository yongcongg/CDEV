"use strict";

const UsersDB = require('../models/UsersDB');
const User = require('../models/User');

var usersDB = new UsersDB();
var moment = require('moment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()

function getUser(request, respond){
    usersDB.getUser(request.userid, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function updateUser(request, respond){
    var date = new Date();
    var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');
    var user = new User(request.userid, request.body.first_name, request.body.last_name, request.body.username, request.body.email, request.body.gender, request.body.address, request.body.phone_number, null, datetime.toString());
    usersDB.updateUser(user, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function updateProfilePic(request, respond){
    usersDB.updateUserProfilePic(request.body.profilePic, request.userid, function(error, result){
        if(error){
            respond.json(error)
        }
        else{
            respond.json("changed")
        }
    })
}

function deleteUser(request, respond){
    usersDB.deleteUser(request.userid, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function updatePassword(request, respond){
    var date = new Date();
    var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');
    var {currentPassword, newPassword} = request.body;
    var userid = request.userid
    
    usersDB.getUserPasswordUpdatedAt(userid, function(error, result){
        if (error){
            respond.json(error);
        }
        else {
            bcrypt.compare(currentPassword, result[0].password, (error, isMatch) => {
                if (error){
                    respond.json(error)
                }
                if (!isMatch){
                    respond.json("Current password input is not valid")
                }
                if (isMatch){
                    bcrypt.hash(newPassword, 10, (error, hash) => {
                        usersDB.updatePassword(userid, hash, datetime, (error, result) => {
                            if(error){
                                respond.json(error);
                            }
                            else {
                                respond.json("Password has been updated!");
                            }
                        })
                    });
                }
            });
        }
    });
}

function deactivateAccount(request, respond){
    usersDB.deactivateAccount(request.userid, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    })
}

function activateAccount(request, respond){
    usersDB.activateAccount(request.userid, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    })
}



module.exports = {getUser, updateUser, deleteUser, updatePassword, deactivateAccount, activateAccount, updateProfilePic};