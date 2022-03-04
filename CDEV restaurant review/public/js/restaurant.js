var today = new Date();
let day = today.getDay()
var week = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"]
var todayDay = week[day]

function getRestaurantData() {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    restaurantID = params.get("id");
    restaurant = params.get("restaurant")

    var request = new XMLHttpRequest();
    request.open('GET', 'https://localhost:8080/restaurant/' + restaurantID, true);
    //This function will be called when data returns from the web api    
    request.onload = function () {
        //get all the movies records into our movie array        
        var restaurant = JSON.parse(request.responseText);
        if (restaurant.length == 0) {
            document.getElementById("error").textContent = ":(";
            document.getElementById("message").textContent = "Error 404.";
            document.getElementById("main-image").style.display = "none"
        }
        //Fetch the comments as well        
        fetchComments();
        displayRestaurant(restaurant);
        showMapLocation(restaurant)
        //displayPhotos(restaurantID)
        document.title = restaurant[0].restaurant_name;
    };

    request.send();
}

function displayRestaurant(restaurant) {
    var id = restaurant[0]._id
    var thumbnail = restaurant[0].thumbnail;
    var location = restaurant[0].restaurant_location;
    var description = restaurant[0].restaurant_description;
    var title = restaurant[0].restaurant_name;
    var price = restaurant[0].price;
    var region = restaurant[0].restaurant_region;
    var link = restaurant[0].restaurant_link;

    var mon = restaurant[0].mon;
    var tues = restaurant[0].tues;
    var wed = restaurant[0].wed;
    var thurs = restaurant[0].thurs;
    var fri = restaurant[0].fri;
    var sat = restaurant[0].sat;
    var sun = restaurant[0].sun;
    console.log(mon)

    document.getElementById("current").textContent = title
    document.getElementById("main-image").src = thumbnail;
    document.getElementById("restaurant").innerHTML = title;
    document.getElementById("description").innerHTML = description;
    document.getElementById("location").innerHTML = "<i style='font-size:24px; margin-right: 0.3em;' class='fas'>&#xf3c5;</i>" + location
    displayPrice(price)
    document.getElementById("region").innerHTML = '<span class="badge badge-pill badge-info py-1 px-2">'+ region + '</span>'
    displayEstablishments(id)
    displayCuisine(id)
    document.getElementById('link').innerHTML = '<a href='+link+' target="none">Link</a><i class="fa fa-external-link ml-2"></i>'
    document.getElementById('mon').innerHTML +="<p style='display:inline-block;'>" + mon + "</p>"
    document.getElementById('tues').innerHTML += tues
    document.getElementById('wed').innerHTML += wed
    document.getElementById('thurs').innerHTML += thurs
    document.getElementById('fri').innerHTML += fri
    document.getElementById('sat').innerHTML += sat
    document.getElementById('sun').innerHTML += sun
    if(todayDay == "mon"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px; font-weight:bold;'>" + mon + "</p>"
    }
    else if(todayDay == "tues"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px; font-weight:bold;'>" + tues + "</p>"
    }
    else if(todayDay == "wed"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px; font-weight:bold;'>" + wed + "</p>"
    }
    else if(todayDay == "thurs"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px;  font-weight:bold;'>" + thurs + "</p>"
    }
    else if(todayDay == "fri"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px; font-weight:bold;'>" + fri + "</p>"
    }
    else if(todayDay == "sat"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px; font-weight:bold;'>" + sat + "</p>"
    }
    else if(todayDay == "sun"){
        document.getElementById('currentDay').innerHTML += "<p style='display:inline-block; margin-left:10px; font-weight:bold;'>" + sun + "</p>"
    }
    
    document.getElementById(todayDay).style.fontWeight = "bold"
}

function displayPrice(price) {
    var priceDiv = document.getElementById("price")
    for (let index = 0; index < price; index++) {
        priceDiv.innerHTML += '<i style="font-size:17px; color:green; margin-left:15px; margin-right:-10px" class="fa">&#xf155;</i>'
    }
}

function displayEstablishments(id) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://localhost:8080/restaurants/establishment/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        var establishment_array = JSON.parse(request.responseText);
        for (let count = 0; count < establishment_array.length; count++) {
            var cell = '<span class="badge badge-pill badge-dark py-1 px-2 mr-1">' + establishment_array[count].establishment + '</span>'
            var id = "establishment"
            document.getElementById(id).innerHTML += cell
        }
        console.log(establishment_array)

    };
    request.send();
}

function displayCuisine(id) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://localhost:8080/restaurants/cuisine/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        var cuisine_array = JSON.parse(request.responseText);
        for (let count = 0; count < cuisine_array.length; count++) {
            var cell = '<span class="badge badge-pill badge-success py-1 px-2 mr-1">' + cuisine_array[count].cuisine + '</span>'
            var id = "cuisine"
            document.getElementById(id).innerHTML += cell
        }
    };
    request.send();
}

function showMapLocation(restaurant_array) {
    console.log(restaurant_array)
    var locations = [restaurant_array[0].longtitude, restaurant_array[0].latitude]
    var point = new google.maps.LatLng(locations[1], locations[0]);
    map = new google.maps.Map(document.getElementById('map'), {
        center: point,
        zoom: 17
    })
    var infowindow = new google.maps.InfoWindow({
        content: "contentString",
        position: point
    });

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