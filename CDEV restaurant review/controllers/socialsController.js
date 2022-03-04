"use strict";

const SocialsDB = require('../models/SocialsDB');
const UsersDB = require('../models/UsersDB')
const { OAuth2Client } = require('google-auth-library');

var socialsDB = new SocialsDB();
var usersDB = new UsersDB();
require('dotenv').config()

function connectGoogle(request, respond) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    var token = request.body.token;
    var provider = request.body.provider
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const googleid = payload['sub'];

        var userid = request.userid
        socialsDB.connectSocials(googleid, provider, userid, function (error, result) {
            if (error) {
                respond.json(error)
            }
            else {
                socialsDB.googleConnected(userid, function(error, result){
                    if(error){
                        respond.json(error)
                    }
                    else{
                        respond.json("success")
                    }
                })
            }
        })
    }
    verify().catch(console.error);
}

function connectFacebook(request, respond) {
    var userid = request.userid
    var facebookID = request.body.id
    var provider = request.body.provider
    socialsDB.connectSocials(facebookID, provider, userid, function (error, result) {
        if (error) {
            respond.json(error)
        }
        else {
            socialsDB.facebookConnected(userid, function(error, result){
                if(error){
                    respond.json(error)
                }
                else{
                    respond.json(result)
                }
            })    
        }
    })
}

function disconnectGoogle(request, respond){
    var userid = request.userid
    var provider = "Google"
    socialsDB.disconnectSocials(userid, provider, function(error, result){
        if(error){
            respond.json(error)
        }
        else{
            socialsDB.googleDisconnected(userid, function(error, result){
                if(error){
                    respond.json(error)
                }
                else{
                    respond.json("Google disconnected")
                }
            })
        }
    })
}

function disconnctFacebook(request, respond){
    var userid = request.userid
    var provider = "Facebook"
    socialsDB.disconnectSocials(userid, provider, function(error, result){
        if(error){
            respond.json(error)
        }
        else{
            console.log(result)
            socialsDB.facebookDisconnected(userid, function(error, result){
                if(error){
                    respond.json(error)
                }
                else{
                    respond.json("Facebook disconnected")
                }
            })
        }
    })
}

module.exports = { connectGoogle, connectFacebook, disconnectGoogle, disconnctFacebook }

