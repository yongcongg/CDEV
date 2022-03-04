function search(){
  var restaurant = document.getElementById("restaurant-search").value;
  var location = document.getElementById("restaurant-location").value;
  // window.location = "https://127.0.0.1:5501/search.html?restaurant=" + restaurant + "&location=" + location
  getRestaurantsDataSearch(restaurant, location)
}

function getRestaurantsDataSearch(restaurant, location) {
    // let url= new URL(window.location.href);
    // let params = new URLSearchParams(url.search);
    // var restaurant = params.get("restaurant");
    // var location = params.get("location")
    console.log(restaurant)
    console.log(location)
    var searchRestaurant = new XMLHttpRequest;
    searchRestaurant.open("POST", "https://127.0.0.1:8080/restaurants/search", true);
    searchRestaurant.setRequestHeader("Content-Type", "application/json");
    searchRestaurant.onload = function (){
        restaurant_array = JSON.parse(searchRestaurant.responseText);
        console.log(restaurant_array) // output to console        
        //call the function so as to display all movies tiles for "Now Showing"        	
        displayRestaurants(restaurant_array, category);
        if (location && restaurant != ''){
          var message = " Restaurants " + restaurant + " At " + location;
        }
        else if (location != null && restaurant == ''){
            var message = " Restaurants At " + location;
        }
        else if (location == '' && restaurant != ''){
            var message = " Restaurants " + restaurant;
        }
        document.getElementById("summary").textContent = message;
        document.getElementById("parent").textContent = "";
    }

    var payload = {restaurant: restaurant, location: location}
    searchRestaurant.send(JSON.stringify(payload));
}

// function displaySearchRestaurants(restaurant, locations) {
//   var table = document.getElementById("restaurantTable");
//   var restaurantCount = 0;
//   var message = "";
//   table.innerHTML = "";
//   totalRestaurant = restaurant_array.length;
//   for (var count = 0; count < totalRestaurant; count++) {
//     var thumbnail = restaurant_array[count].thumbnail;
//     var location = restaurant_array[count].restaurant_location;
//     var region = restaurant_array[count].restaurant_region;
//     var title = restaurant_array[count].restaurant_name;
//     var id = restaurant_array[count]._id;
//     var cell = '<a href="https://127.0.0.1:5501/restaurant.html?id='+ id +'&restaurant='+ title +'" style="text-decoration:none;">\
//                 <div class="col-12 col-md-12 col-lg-4 pb-4">\
//                 <div class="card"><img class="card-img-top" src="' + thumbnail + '" alt="Card image">\
//                 <div class="card-body"><a href="https://127.0.0.1:5501/restaurant.html?id='+ id +'&restaurant='+ title +'" style="text-decoration: none;"><h5 class="card-title">' + title + '</h5> </a>\
//                 <p style="cursor:pointer" data-toggle="modal" data-target="#locationModal" onclick="showMap(this)" class="card-text" item="' + count + '">' + location + '</p>\
//                 <span class="badge badge-pill badge-info py-1 px-2 mt-1">'+ region + '</span>\
//                 <div class="inline" id="establishment'+ id + '"></div>\
//                 <div class="inline" id="cuisine'+ id + '"></div>\
//                 <div id="aveRating'+ id + '" style="margin-top:10px; margin-bottom:10px;" ></div>\
//                 <p id="price'+ id + '"></p>\
//                 </div>\
//                 </div>\
//                 </div>\
//                 </a>'
//     table.insertAdjacentHTML('beforeend', cell);
//     restaurantCount++;
//   }
//   if (locations && restaurant != ''){
//       message = restaurantCount + " Restaurants " + restaurant + " At " + locations;
//   }
//   else if (locations != null && restaurant == ''){
//       message = restaurantCount + " Restaurants At " + locations;
//   }
//   else if (locations == '' && restaurant != ''){
//       message = restaurantCount + " Restaurants " + restaurant;
//   }
//   document.getElementById("summary").textContent = message;
//   document.getElementById("parent").textContent = "";
// }