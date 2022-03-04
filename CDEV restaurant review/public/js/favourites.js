var favourites_array = []

function getUserFav() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://localhost:8080/restaurants/favourites', true);
    request.setRequestHeader("Authorization", "Bearer " + token)
    request.onload = function () {
        favourites_array = JSON.parse(request.responseText);
        if (favourites_array.length == 0){
            console.log("no fav")
            document.getElementById("parent").textContent = "";
            document.getElementById("summary").textContent = "Add your favourites now!";
        }
        else{
            displayRestaurants("Favourite Restaurants");
        }
    };
    request.send()
}

function displayRestaurants(category) {
    var table = document.getElementById("restaurantTable");
    var restaurantCount = 0;
    table.innerHTML = "";
    var totalRestaurant = favourites_array.length;


    for (var count = 0; count < totalRestaurant; count++) {
        var favID = favourites_array[count].fav_id;
        var thumbnail = favourites_array[count].thumbnail;
        var location = favourites_array[count].restaurant_location;
        var region = favourites_array[count].restaurant_region;
        var title = favourites_array[count].restaurant_name;
        var id = favourites_array[count]._id;
        var price = favourites_array[count].price;
        var cell = '\
                        <div class="col-12 col-md-12 col-lg-3 pb-3">\
                            <div class="card"><img class="card-img-top" src="' + thumbnail + '" alt="Card image">\
                                <div style="position: absolute; top: 10px; right: 10px;"><img class="rounded-circle" src="images/like.jpg" height="30px" onclick="removeFav('+ favID + ')" style="cursor:pointer;"></div>\
                                <a href="https://127.0.0.1:5501/restaurant.html?id=' + id + '&restaurant=' + title + '" style="text-decoration:none;">\
                                    <div class="card-body"><a href="https://127.0.0.1:5501/restaurant.html?id='+ id + '&restaurant=' + title + '" style="text-decoration: none;"><h6 class="card-title">' + title + '</h6> </a>\
                                        <p style="cursor:pointer" data-toggle="modal" data-target="#locationModal" onclick="showMap(this)" class="card-text" item="' + count + '">' + location + '</p>\
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
        restaurantCount++;
        calculateAvrRating(id)
        displayPrice(price, id)
    }
    document.getElementById("summary").textContent = category;
    document.getElementById("parent").textContent = "";
    displayEstablishments(establishment)
    displayCuisine(cuisine)
}

function removeFav(id) {
    var request = new XMLHttpRequest();
    request.open('DELETE', 'https://localhost:8080/restaurants/favourites/' + id, true);
    request.setRequestHeader("Authorization", "Bearer " + token)
    request.onload = function () {
        var response = JSON.parse(request.responseText)
        console.log(response)
        location.reload()
    };
    request.send()
}

function showMap(element) {
    var item = element.getAttribute("item")
    currentIndex = item
    var locations = [favourites_array[item].longtitude, favourites_array[item].latitude]
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
