"use strict";

class Comment {
    constructor(id, restaurant_id, user_id, overview, comment, rating, date_posted, date_visited) {
        this.id = id;
        this.restaurant_id = restaurant_id;
        this.user_id = user_id;
        this.overview = overview;
        this.comment = comment;
        this.rating = rating;
        this.date_posted = date_posted;
        this.date_visited = date_visited
    }

    //add the set and get methods here
    getId() {
        return this.id;
    }
    getRestaurantId() {
        return this.restaurant_id;
    }
    getUserId() {
        return this.user_id;
    }
    getOverview() {
        return this.overview;
    }
    getComment() {
        return this.comment;
    }
    getRating() {
        return this.rating;
    }
    getDatePosted() {
        return this.date_posted;
    }
    getDateVisited() {
        return this.date_visited;
    }


    setRestaurantId(restaurant_id) {
        this.restaurant_id = restaurant_id;
    }
    setUserId(movie) {
        this.movie = movie;
    }
    setOverview(review) {
        this.review = review
    }
    setComment(comment) {
        this.comment = comment;
    }
    setRating(rating) {
        this.rating = rating;
    }
    setDatePosted(date_posted) {
        this.date_posted = date_posted;
    }
    setDateVisited(date_visited) {
        this.date_visited = date_visited;
    }

}

module.exports = Comment;