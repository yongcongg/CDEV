var token = sessionStorage.getItem("accessToken")
var favourites_array = []
var favourites = []
var restaurant_array = []
var filterArray = []
var establishment = ""
var cuisine = ""

function getData() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://localhost:8080/restaurants', true);
    //This function will be called when data returns from the web api    
    request.onload = function () {
        //get all the movies records into our movie array        
        restaurant_array = JSON.parse(request.responseText);
        console.log(restaurant_array) // output to console
        if (token != null) {
            getUserFav()
        }
        else {
            displayRestaurants(restaurant_array, category, establishment, cuisine);
        }
    };
    //This command starts the calling of the movies web api    
    request.send();
}

function getUserFav() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://localhost:8080/restaurants/favourites', true);
    request.setRequestHeader("Authorization", "Bearer " + token)
    request.onload = function () {
        favourites_array = JSON.parse(request.responseText);
        for (let index = 0; index < favourites_array.length; index++) {
            favourites.push(favourites_array[index]._id)
        }
        displayRestaurants(restaurant_array, category, establishment, cuisine);
        console.log(favourites)
    };
    request.send()
}

function getRestaurantByCuisine() {
    var request = new XMLHttpRequest();
    var cuisine = document.getElementById("cuisine").value
    request.open('GET', 'https://localhost:8080/restaurants/cuisine', true);
    //This function will be called when data returns from the web api    
    request.onload = function () {
        //get all the movies records into our movie array        
        var response = JSON.parse(request.responseText);
        console.log(response) // output to console   
    };
    var payload = { cuisine: cuisine }
    request.send(JSON.stringify(payload));
}

function displayRestaurants(restaurant_array, category, establishment, cuisine) {
    var table = document.getElementById("restaurantTable");
    var restaurantCount = 0;
    table.innerHTML = "";
    totalRestaurant = restaurant_array.length;
    for (var count = 0; count < totalRestaurant; count++) {
        var thumbnail = restaurant_array[count].thumbnail;
        var location = restaurant_array[count].restaurant_location;
        var region = restaurant_array[count].restaurant_region;
        var title = restaurant_array[count].restaurant_name;
        var id = restaurant_array[count]._id;
        var price = restaurant_array[count].price;

        if (favourites.indexOf(id) != -1) {
            console.log(id)
            var cell = '\
                        <div class="col-12 col-md-12 col-lg-4 pb-4">\
                            <div class="card"><img class="card-img-top" src="' + thumbnail + '" alt="Card image">\
                                <div style="position: absolute; top: 10px; right: 10px;"><img class="rounded-circle" src="images/like.jpg" height="30px" onclick="removeFav('+ favourites.indexOf(id) + ')" style="cursor:pointer;"></div>\
                                <a href="https://127.0.0.1:5501/restaurant.html?id=' + id + '&restaurant=' + title + '" style="text-decoration:none;">\
                                    <div class="card-body"><a href="https://127.0.0.1:5501/restaurant.html?id='+ id + '&restaurant=' + title + '" style="text-decoration: none;"><h6 class="card-title">' + title + '</h6> </a>\
                                        <p style="cursor:pointer" data-toggle="modal" data-target="#locationModal" onclick="showMaps(this)" class="card-text" item="' + count + '">' + location + '</p>\
                                        <span class="badge badge-pill badge-info py-1 px-2">'+ region + '</span>\
                                        <div class="inline" id="establishment'+ id + '"></div>\
                                        <div class="inline" id="cuisine'+ id + '"></div>\
                                        <div id="aveRating'+ id + '" style="margin-top:10px; margin-bottom:10px;" ></div>\
                                        <p id="price'+ id + '"></p>\
                                    </div>\
                                 </a>\
                            </div>\
                        </div>\
                    '
            table.insertAdjacentHTML('beforeend', cell);
        }

        else {
            var cell = '\
                        <div class="col-12 col-md-12 col-lg-4 pb-4">\
                            <div class="card"><img class="card-img-top" src="' + thumbnail + '" alt="Card image">\
                                <div style="position: absolute; top: 10px; right: 10px;"><img class="rounded-circle" src="images/unlike.jpg" height="30px" onmouseover="hover(this);" onmouseout="unhover(this);" onclick="addToFav('+ count + ')" style="cursor:pointer;"></div>\
                                <a href="https://127.0.0.1:5501/restaurant.html?id=' + id + '&restaurant=' + title + '" style="text-decoration:none;">\
                                    <div class="card-body"><a href="https://127.0.0.1:5501/restaurant.html?id='+ id + '&restaurant=' + title + '" style="text-decoration: none;"><h6 class="card-title">' + title + '</h6> </a>\
                                        <p style="cursor:pointer" data-toggle="modal" data-target="#locationModal" onclick="showMaps(this)" class="card-text" item="' + count + '">' + location + '</p>\
                                        <span class="badge badge-pill badge-info py-1 px-2">'+ region + '</span>\
                                        <div class="inline" id="establishment'+ id + '"></div>\
                                        <div class="inline" id="cuisine'+ id + '"></div>\
                                        <div id="aveRating'+ id + '" style="margin-top:10px; margin-bottom:10px;" ></div>\
                                        <p id="price'+ id + '"></p>\
                                    </div>\
                                 </a>\
                            </div>\
                        </div>\
                    '
            table.insertAdjacentHTML('beforeend', cell);
        }
        restaurantCount++;
        calculateAvrRating(id)
        displayPrice(price, id)
    }
    document.getElementById("summary").textContent = category;
    document.getElementById("parent").textContent = "";
    displayEstablishments(establishment)
    displayCuisine(cuisine)
}

function showMaps(element) {
    var item = element.getAttribute("item")
    currentIndex = item
    var locations = [restaurant_array[item].longtitude, restaurant_array[item].latitude]
    var point = new google.maps.LatLng(locations[1], locations[0]);
    map = new google.maps.Map(document.getElementById('map'), {
        center: point,
        zoom: 17
    })
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    var markers = [];

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[1], locations[0]),
        map: map,
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/restaurant.png"
        }
    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
            infowindow.setContent("restaurant");
            infowindow.open(map.marker);
        }
    })(marker, i));

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            ///map.setCenter(pos);
            //map.setZoom(13);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng),
                map: map,
            })

            markers.push(marker);
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent("Your current location");
                    infowindow.open(map.marker);
                }
            })(marker, i));
        }
    )
}

function calculateAvrRating(id) {
    var request = new XMLHttpRequest();

    request.open("GET", "https://localhost:8080/comments/" + id, true);

    //This command starts the calling of the comments api
    request.onload = function () {
        //get all the comments records into our comments array
        comment_array = JSON.parse(request.responseText);
        var ratings = 0
        var averageRating = 0

        for (let count = 0; count < comment_array.length; count++) {
            var rating = comment_array[count].rating
            ratings += rating
        }
        var averageid = "aveRating" + id
        averageRating = (ratings / comment_array.length).toFixed(2)
        document.getElementById(averageid).innerHTML = averageRating
        displayAveRating(averageRating, averageid, comment_array.length)
    };
    request.send();
}

function displayPrice(price, id) {
    var priceDiv = document.getElementById("price" + id)
    for (let index = 0; index < price; index++) {
        priceDiv.innerHTML += '<i style="font-size:17px; color:green; margin-right:5px;" class="fa">&#xf155;</i>'
    }
}

function displayAveRating(rating, id, numberOfComments) {
    var ratingDiv = document.getElementById(id);
    if (comment_array.length == 0) {
        ratingDiv.innerHTML = "No review yet"
    }
    if (rating >= 0 && rating <= 0.3) {
        ratingDiv.innerHTML = "" + numberOfComments
    }
    if (rating >= 0.3 && rating <= 0.8) {
        ratingDiv.innerHTML = "<img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 0.8 && rating <= 1.3) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 1.3 && rating <= 1.8) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 1.8 && rating <= 2.3) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 2.3 && rating <= 2.8) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 2.8 && rating <= 3.3) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 3.3 && rating <= 3.8) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 3.8 && rating <= 4.3) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 4.3 && rating <= 4.8) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }
    if (rating >= 4.8) {
        ratingDiv.innerHTML = "<img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" + numberOfComments
    }

}

function filterEstablishments(id) {
    var request = new XMLHttpRequest();
    var establishment = ""
    request.open("POST", "https://localhost:8080/restaurants/establishment", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        var establishment_array = JSON.parse(request.responseText);
        for (let count = 0; count < establishment_array.length; count++) {
            const restaurantID = establishment_array[count]._id;
            document.getElementById("establishment" + restaurantID).innerHTML = establishment_array[count].establishment
            table.insertAdjacentHTML('beforeend', cell);

        }

    };
    var payload = { establishment: establishment }
    request.send(JSON.stringify(payload));
}

function displayEstablishments(establishment) {
    var request = new XMLHttpRequest();
    request.open("POST", "https://localhost:8080/restaurants/establishment", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        var establishment_array = JSON.parse(request.responseText);
        for (let count = 0; count < establishment_array.length; count++) {
            const restaurantID = establishment_array[count]._id;
            var cell = '<span class="badge badge-pill badge-dark py-1 px-2 mr-1">' + establishment_array[count].establishment + '</span>'
            var id = "establishment" + restaurantID
            document.getElementById(id).innerHTML += cell
        }
        console.log(establishment_array)

    };
    var payload = { establishment: establishment }
    request.send(JSON.stringify(payload));
}

function displayCuisine(cuisine) {
    var request = new XMLHttpRequest();
    request.open("POST", "https://localhost:8080/restaurants/cuisine", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        var cuisine_array = JSON.parse(request.responseText);
        for (let count = 0; count < cuisine_array.length; count++) {
            const restaurantID = cuisine_array[count]._id;
            var cell = '<span class="badge badge-pill badge-success py-1 px-2 mr-1">' + cuisine_array[count].cuisine + '</span>'
            var id = "cuisine" + restaurantID
            document.getElementById(id).innerHTML += cell
        }
    };
    var payload = { cuisine: cuisine }
    console.log(payload)
    request.send(JSON.stringify(payload));
}

function showMap(element) {
    var item = element.getAttribute("item")
    currentIndex = item
    var locations = [restaurant_array[item].longtitude, restaurant_array[item].latitude]
    var point = new google.maps.LatLng(locations[1], locations[0]);
    map = new google.maps.Map(document.getElementById('map'), {
        center: point,
        zoom: 17
    })
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    var markers = [];

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[1], locations[0]),
        map: map,
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/restaurant.png"
        }
    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
            infowindow.setContent("restaurant");
            infowindow.open(map.marker);
        }
    })(marker, i));

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            ///map.setCenter(pos);
            //map.setZoom(13);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng),
                map: map,
            })

            markers.push(marker);
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent("Your current location");
                    infowindow.open(map.marker);
                }
            })(marker, i));
        }
    )
}

function hover(element) {
    element.setAttribute('src', 'images/like.jpg');
}

function unhover(element) {
    element.setAttribute('src', 'images/unlike.jpg');
}

function addToFav(count) {
    if (token == null) {
        console.log('please sign in')
    }
    else {
        var id = restaurant_array[count]._id
        var restaurant = restaurant_array[count].restaurant_name
        var add = new XMLHttpRequest()
        add.open("POST", "https://localhost:8080/restaurants/favourites", true);
        add.setRequestHeader("Content-Type", "application/json");
        add.setRequestHeader("Authorization", "Bearer " + token);
        add.onload = function () {
            var result = JSON.parse(add.responseText);
            console.log(result)
            var toastLiveExample = document.getElementById('liveToast')
            var toast = new bootstrap.Toast(toastLiveExample)
            var message = "Added <b>" + restaurant + "</b> to favourites"
            document.getElementById("toast-body").innerHTML = message;
            toast.show()
            setTimeout(function () {
                window.location.reload(1);
            }, 1000);
        };
        var payload = { restaurantID: id }
        add.send(JSON.stringify(payload));
        console.log(id)
    }
}

function removeFav(index) {
    var favID = favourites_array[index].fav_id
    var request = new XMLHttpRequest();
    request.open('DELETE', 'https://localhost:8080/restaurants/favourites/' + favID, true);
    request.setRequestHeader("Authorization", "Bearer " + token)
    request.onload = function () {
        var response = JSON.parse(request.responseText)
        console.log(response)
        location.reload()
    };
    request.send()
}

function filterPrice() {

    var result1 = document.getElementById('priceFilter1').checked
    var result2 = document.getElementById('priceFilter2').checked
    var result3 = document.getElementById('priceFilter3').checked
    if ((result1 == false && result2 == false && result3 == false) || (result1 == true && result2 == true && result3 == true)) {
        displayRestaurants(restaurant_array, category, establishment, cuisine);
    }

    else if (result1 == true && result2 == true) {
        filterArray = restaurant_array.filter(function (el) {
            return el.price == 1 || el.price == 2
        });
        displayRestaurants(filterArray, category, establishment, cuisine);
    }

    else if (result2 == true && result3 == true) {
        filterArray = restaurant_array.filter(function (el) {
            return el.price == 2 || el.price == 3
        });
        displayRestaurants(filterArray, category, establishment, cuisine);
    }

    else if (result1 == true && result3 == true) {
        filterArray = restaurant_array.filter(function (el) {
            return el.price == 1 || el.price == 3
        });
        displayRestaurants(filterArray, category, establishment, cuisine);
    }

    else if (result1 == true) {
        filterArray = restaurant_array.filter(function (el) {
            return el.price == 1
        });
        displayRestaurants(filterArray, category, establishment, cuisine);
    }

    else if (result2 == true) {
        filterArray = restaurant_array.filter(function (el) {
            return el.price == 2
        });
        displayRestaurants(filterArray, category, establishment, cuisine);
    }

    else if (result3 == true) {
        filterArray = restaurant_array.filter(function (el) {
            return el.price == 3
        });
        displayRestaurants(filterArray, category, establishment, cuisine);
    }
    console.log(filterArray)
}

function filterRegion() {
    document.addEventListener('change', () => {
        const checkedValues = [...document.querySelectorAll('.region')]
            .filter(input => input.checked)
            .map(input => input.value);
        filterArray = restaurant_array.filter(({ restaurant_region }) => checkedValues.includes(restaurant_region));
        if (checkedValues.length == 0) {
            displayRestaurants(restaurant_array, category);
        }
        else {
            displayRestaurants(filterArray);

        }
    });
}




