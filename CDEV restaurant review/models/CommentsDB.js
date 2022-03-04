"use strict";

var db = require('../db-connections');
class CommentsDB{
    getAllComments(callback){
        var sql = "SELECT * from restaurant_review.comment";
        db.query(sql, callback);
    }

    getAllCommentsFromRestaurant(id, callback){
        var sql = `SELECT user.username, user.profile_pic, comment.*, photo.photo, photo.photo_id
        FROM user
        LEFT OUTER JOIN comment 
        ON user._id=comment.user_id
        LEFT OUTER JOIN photo
        ON photo.review_id = comment._id
        WHERE restaurant_id = ?;`;
        db.query(sql, [id], callback);
    }

    getCommentFromID(id, callback){
        var sql = "SELECT * from restaurant_review.comment WHERE _id = ?";
        db.query(sql, [id], callback);
    }

    addComment(comment, callback){ //same code as in workbench, but values change to ??
        var sql = "INSERT INTO comment (restaurant_id, user_id, date_posted, date_visited, overview, comment, rating) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [comment.getRestaurantId(), comment.getUserId(), comment.getDatePosted(), comment.getDateVisited(), comment.getOverview(), comment.getComment(), comment.getRating()], callback);
    }
    
    updateComment(comment, callback){
        var sql = "UPDATE comment SET overview = ?, comment = ?, rating = ?, date_posted = ?, date_visited = ? WHERE _id = ?";
        return db.query(sql, [comment.getOverview(), comment.getComment(), comment.getRating(), comment.getDatePosted(), comment.getDateVisited(), comment.getId()], callback);
    }
    
    deleteComment(commentID, callback){
        var sql = "DELETE from comment WHERE _id = ?";
        return db.query(sql, [commentID], callback);
    }

    getAllCommentsFromAUser(userid, callback){
        var sql = "SELECT * from restaurant_review.comment WHERE user_id = ?";
        db.query(sql, [userid], callback);
    }

    addPhotoInComment(photo, reviewid, restaurantID , callback){
        var sql = "INSERT INTO photo (photo, review_id) VALUES (?, ?)"
        db.query(sql, [photo, reviewid], callback);
    }

    deletePhotoInComment(reviewid, callback){
        var sql = "DELETE from photo WHERE review_id = ?"
        return db.query(sql, [reviewid], callback);
    }

    updatePhotoInComment(photo, reviewid, callback){
        var sql = "UPDATE photo SET photo = ? WHERE review_id = ?"
        return db.query(sql, [photo, reviewid], callback);
    }
}

module.exports = CommentsDB;