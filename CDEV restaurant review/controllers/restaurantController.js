"use strict";

const RestaurantsDB = require('../models/RestaurantsDB');

var restaurantsDB = new RestaurantsDB();

function getAllRestaurants(request, respond){
    restaurantsDB.getAllRestaurants(function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getRestaurantsBySearch(request, respond){
    restaurantsDB.getRestaurantsBySearch(request.body.restaurant, request.body.location, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getRestaurantById(request, respond){
    restaurantsDB.getRestaurantById(request.params.id, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getRestaurantsByRegion(request, respond){
    restaurantsDB.getRestaurantsByRegion(request.body.region, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getRestaurantsByPrice(request, respond){
    restaurantsDB.getRestaurantsByPrice(request.body.price, function(error, result){
        if(error){
            respond.json(error);
        }
        else{
            respond.json(result);
        }
    });
}

function getRestaurantByEstablishment(request, respond){
    restaurantsDB.getRestaurantByEstablishment(request.body.establishment, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    });
}

function getRestaurantByEstablishmentByID(request, respond){
    restaurantsDB.getRestaurantByEstablishmentID(request.params.id, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    });
}

function getRestaurantByCuisineByID(request, respond){
    restaurantsDB.getRestaurantByCuisineID(request.params.id, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    });
}

function getRestaurantByCuisine(request, respond){
    restaurantsDB.getRestaurantByCuisine(request.body.cuisine, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    });
}

function addUserFavourite(request, respond){
    restaurantsDB.addUserFavourite(request.userid, request.body.restaurantID, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    })
}

function getUserFavourite(request, respond){
    restaurantsDB.getUserFavourite(request.userid, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    });
}

function deleteUserFavourite(request, respond){
    var id = request.params.id;
    restaurantsDB.getuserfavourite(id, function(error, result){
        if (error){
            respond.json(error);
        } 

        if (result.length == 0){
            respond.json("no favourite restaurant of that id");
        } 

        if (request.userid == result[0].user_id){
            restaurantsDB.deleteUserFavourite(id, function(error, result){
                if (error){
                    respond.json(error);
                } 

                else{
                    respond.json(result);
                }
            });
        }

        else respond.status(401).json("Unauthorized");
    })
}

function getRestaurantPhoto(request, respond){
    var restaurantID = request.params.id
    restaurantsDB.getPhotos(restaurantID, function(error, result){
        if (error) respond.json(error)
        else respond.json(result)
    });
}

module.exports = {getAllRestaurants, getRestaurantById, getRestaurantByCuisineByID ,getRestaurantsBySearch, getRestaurantsByRegion, getRestaurantsByPrice, getRestaurantByEstablishment, getRestaurantByCuisine, addUserFavourite, getUserFavourite, deleteUserFavourite, getRestaurantPhoto, getRestaurantByEstablishmentByID};