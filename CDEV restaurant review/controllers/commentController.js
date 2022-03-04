"use strict";

const CommentsDB = require('../models/CommentsDB');
const Comment = require('../models/Comment');
var moment = require('moment');
var jwt = require('jsonwebtoken');
const { end } = require('../db-connections');

var commentsDB = new CommentsDB();

function getAllComments(reqest, respond){
    commentsDB.getAllComments(function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getAllCommentsFromRestaurant(request, respond){
    commentsDB.getAllCommentsFromRestaurant(request.params.id, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getAllCommentsFromAUser(request, respond){
    var userid = request.userid;
    commentsDB.getAllCommentsFromAUser(userid, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function addComment(request, respond){
    var date = new Date();
    var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');
    var comment = new Comment(null, request.body.restaurant_id, request.userid, request.body.overview, request.body.comment, request.body.rating, datetime.toString(), request.body.date_visited);
    if (request.body.photo != null){
        commentsDB.addComment(comment, function(error, result){
            if (error){
                respond.json(error);
            }
            else {
                commentsDB.addPhotoInComment(request.body.photo, result.insertId, function(error, result){
                    if (error) {
                        respond.json(error)
                    }
                    else {
                        respond.json("Comment with image attached posted")
                    }
                });
            }
        })
    }
    else {
        commentsDB.addComment(comment, function(error, result){
            if (error){
                respond.json(error);
            }
            else respond.json("Comment posted")
        })
    }
}

function updateComment(request, respond){
    var date = new Date();
    var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');
    var comment = new Comment(parseInt(request.params.id), request.body.restaurant_id, request.userid, request.body.overview, request.body.comment, request.body.rating, datetime.toString(), request.body.date_visited);
    var photo = request.body.photo

    commentsDB.getCommentFromID(request.params.id, function(error, result){
        if (error) respond.json(error);

        if (request.userid == result[0].user_id){
            if(photo != null){
                commentsDB.updateComment(comment, function(error, result){
                    if(error){
                        respond.json(error);
                    }
                    else{
                        commentsDB.updatePhotoInComment(photo, request.params.id , function(error, result){
                            if(error){
                                respond.json(error)
                            } 
                            if(result.affectedRows == 0){
                                commentsDB.addPhotoInComment(photo, request.params.id, function(error, result){
                                    if (error) {
                                        respond.json(error)
                                    }
                                    else {
                                        respond.json("Comment edited with image attached")
                                    }
                                });
                            }
                            else respond.json("image and comment edited")
                        });
                    }
                });
            }
            else{
                commentsDB.updateComment(comment, function(error, result){
                    if(error){
                        respond.json(error);
                    }
                    else{
                        respond.json("comment edited")
                    }
                });
            }
        }

        else respond.status(401).json("Unauthorized");
    });
}

function deleteComment(request, respond){
    var id = request.params.id;
    commentsDB.getCommentFromID(id, function(error, result){
        if (error) respond.json(error);

        if (request.userid == result[0].user_id){
            commentsDB.deleteComment(id, function(error, result){
                if(error){
                    respond.json(error);
                }
                else{
                    respond.json(result);
                }
            });
        }

        else respond.status(401).json("Unauthorized");
    });
}

function deletePhotoInComment(request, respond){
    commentsDB.deletePhotoInComment(request.params.id, function(error, result){
        if(error) respond.json(error)
        else respond.json("Photo deleted")
    });
}

function updatePhotoInComment(request, respond){
    commentsDB.updatePhotoInComment(request.body.photo, request.params.id, function(error, result){
        if(error) respond.json(error)
        else respond.json("Photo updated")
    });
}

module.exports = {getAllComments,getAllCommentsFromRestaurant ,addComment, updateComment, deleteComment, getAllCommentsFromAUser, deletePhotoInComment, updatePhotoInComment};