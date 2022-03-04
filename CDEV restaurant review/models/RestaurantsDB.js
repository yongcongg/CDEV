"use strict";

const { decodeBase64 } = require('bcryptjs');
var db = require('../db-connections');
class RestaurantsDB{
    getAllRestaurants(callback){
        var sql = "SELECT * FROM restaurant_review.restaurant";
        db.query(sql, callback);
    }

    getRestaurantById(id, callback){
        var sql = "SELECT * FROM restaurant_review.restaurant WHERE _id = ?";
        db.query(sql, [id], callback);
    }

    getRestaurantsBySearch(search, location, callback){
        var sql = "SELECT * FROM restaurant_review.restaurant WHERE restaurant_name LIKE '%" + search + "%' AND restaurant_location LIKE '%" + location + "%'"; 
        db.query(sql, callback);
    }

    getRestaurantsByRegion(region, callback){
        var sql = "SELECT * FROM restaurant_review.restaurant WHERE restaurant_region LIKE '%" + region + "%'"; 
        db.query(sql, callback);
    }

    getRestaurantsByPrice(price, callback){
        var sql = "SELECT * FROM restaurant_review.restaurant WHERE price LIKE '" + price + "'";
        db.query(sql, callback);
    }

    getRestaurantByEstablishment(establishment, callback){
        var sql = "SELECT restaurant._id, restaurant.restaurant_name, establishment.establishment\
                  FROM restaurant\
                  JOIN restaurant_establishment\
                  ON restaurant._id = restaurant_establishment.restaurant_id\
                  JOIN establishment\
                  ON restaurant_establishment.establishment_id = establishment._id\
                  WHERE establishment.establishment LIKE '%" + establishment + "%'";              
        db.query(sql, callback);
    }

    getRestaurantByEstablishmentID(id, callback){
        var sql = "SELECT restaurant._id, restaurant.restaurant_name, establishment.establishment\
                  FROM restaurant\
                  JOIN restaurant_establishment\
                  ON restaurant._id = restaurant_establishment.restaurant_id\
                  JOIN establishment\
                  ON restaurant_establishment.establishment_id = establishment._id\
                  WHERE restaurant._id = ?";              
        db.query(sql,[id], callback);
    }

    getRestaurantByCuisine(cuisine, callback){
        var sql = "SELECT restaurant._id, restaurant.restaurant_name, cuisine.cuisine\
                  FROM restaurant\
                  JOIN restaurant_cuisine\
                  ON restaurant._id = restaurant_cuisine.restaurant_id\
                  JOIN cuisine\
                  ON restaurant_cuisine.cuisine_id = cuisine._id\
                  WHERE cuisine.cuisine LIKE '%" + cuisine + "%'";            
        db.query(sql, callback);
    }

    getRestaurantByCuisineID(id, callback){
        var sql = "SELECT restaurant._id, restaurant.restaurant_name, cuisine.cuisine\
                  FROM restaurant\
                  JOIN restaurant_cuisine\
                  ON restaurant._id = restaurant_cuisine.restaurant_id\
                  JOIN cuisine\
                  ON restaurant_cuisine.cuisine_id = cuisine._id\
                  WHERE restaurant._id = ?;"         
        db.query(sql, [id], callback);
    }

    getUserFavourite(userid, callback){
        var sql = `SELECT user_favourite.fav_id, restaurant.*
                    FROM restaurant
                    JOIN user_favourite
                    ON restaurant._id = user_favourite.restaurant_id
                    JOIN user
                    ON user_favourite.user_id = user._id
                    WHERE user._id = ?`;
        db.query(sql, [userid], callback);
    }

    // get favourite by id
    getuserfavourite(id, callback){
        var sql = "SELECT * FROM restaurant_review.user_favourite WHERE fav_id = ?"
        db.query(sql, [id], callback)
    }

    addUserFavourite(userid, restaurantid, callback){
        var sql = "INSERT INTO user_favourite (user_id, restaurant_id) VALUES (?, ?)";
        db.query(sql, [userid, restaurantid], callback);
    }

    deleteUserFavourite(favid, callback){
        var sql = "DELETE from user_favourite where fav_id = ?";
        db.query(sql, [favid], callback);
    }

    getPhotos(id, callback){
        var sql = `SELECT comment.restaurant_id, photo.photo
                   FROM comment
                   JOIN photo
                   ON comment._id = photo.review_id
                   WHERE comment.restaurant_id = ?
                   `;
        db.query(sql,[id], callback);
    }
}

module.exports = RestaurantsDB;