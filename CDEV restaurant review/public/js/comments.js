var token = sessionStorage.getItem("accessToken")

// function fetchAllComments() {
//   var request = new XMLHttpRequest();

//   request.open("GET", "https://localhost:8080/comments", true);

//   //This command starts the calling of the comments api
//   request.onload = function () {
//     //get all the comments records into our comments array
//     comment_array = JSON.parse(request.responseText);
//     console.log(comment_array);
//   };
//   request.send();
// }

function fetchComments() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://localhost:8080/comments/" + restaurantID, true);

  //This command starts the calling of the comments api
  request.onload = function () {
    //get all the comments records into our comments array
    comment_array = JSON.parse(request.responseText);
    console.log(comment_array);
    if (comment_array.length == 0) {
      console.log("no comment")
      var table = document.getElementById("commentTable");
      table.innerHTML = "";
      var html = '<li class="list-group-item" style="background-color: #EFF1F3;">\
      <h4 style="text-align:center;">No review yet. Create one now</h4>\
      </li>';
      table.insertAdjacentHTML("beforeend", html);
    }
    else {
      showRestaurantComments();
    }
  };
  request.send();
}

function showRestaurantComments() {
  var table = document.getElementById("commentTable");
  document.getElementById("commentsHeader").innerHTML = "Comments (" + comment_array.length + ")"
  table.innerHTML = "";

  if (token != null) {
    var userCommentArray = comment_array.findIndex(item => item.user_id == userid);
    array_move(comment_array, userCommentArray, 0)
  }
  var ratings = 0

  for (var count = 0; count < comment_array.length; count++) {
    var comment_id = comment_array[count]._id
    var user_id = comment_array[count].user_id
    var datePosted = comment_array[count].date_posted
    var dateVisited = comment_array[count].date_visited
    var overview = comment_array[count].overview
    var comment = comment_array[count].comment
    var rating = comment_array[count].rating
    var username = comment_array[count].username
    var profile_pic = comment_array[count].profile_pic
    var image = comment_array[count].photo
    if (image != null) {
      var html = '<li class="list-group-item" style="background-color: #EFF1F3;">\
              <div class="container">\
                <div class="row">\
                  <div class="userInfo col-2">\
                    <div class="userAvatar">\
                      <img src="'+ profile_pic + '" class="rounded-circle" style="display: block; margin-left: auto; margin-right: auto;" id="profile-pic" alt="profile-picture" height="60" width="60"></img>\
                    </div>\
                    <div class="mt-2">\
                      <p class="username" style="text-align:center;">'+ username + '</p> \
                    </div>\
                  </div>\
                <div class="col-10">\
                  <h4 style="padding-bottom: 10px; color: #223843;" id="overview">'+ overview + '\
                    <a class="btn position-absolute top-0 start-100 translate-middle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="position: absolute; right: 20px; top: 0;" item="' + count + '" onclick="editDeleteOption(this)"><i class="fa fa-ellipsis-v"></i></a>\
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">\
                    <a class="dropdown-item" id="edit'+ count + '" href="" data-toggle="modal" data-target="#editCommentModal" data-dismiss="modal" style="display: none;" item="' + count + '" onclick="editComment(this)">Edit</a>\
                      <a class="dropdown-item" id="delete'+ count + '" href="#" style="display: none;" item="' + count + '" onclick="deleteComment(this)">Delete</a>\
                      <a class="dropdown-item" id="report'+ count + '" href="#" item="' + count + '" onclick="editDeleteOption(this)">Report</a>\
                    </div>\
                  </h4>\
                  <p id="comment" style="color: #223843;">'+ comment + '</p>\
                  <div>\
                    <img class="comment-img" id="photo'+ count + '" src="' + image + '" style="cursor:pointer" data-toggle="modal" data-target="#imagePreviewModal" onclick="showImage(this)">\
                  </div>\
                    <p class="mt-2" id="dateOfVisit'+ count + '"><b>Date visited:</b> ' + dateVisited + '</p>\
                  <p id="rating'+ count +'"></p>\
                  <small id="dateReviewed">Reviewed on '+ datePosted + '</small>\
              </div>\
          </div>\
      </div>\
    </li>';
      table.insertAdjacentHTML("beforeend", html);
    }

    if (image == null) {
      var html = '<li class="list-group-item" style="background-color: #EFF1F3;">\
      <div class="container">\
          <div class="row">\
              <div class="userInfo col-2">\
                <div class="userAvatar">\
                  <img src="'+ profile_pic + '" class="rounded-circle" style="display: block; margin-left: auto; margin-right: auto;" id="profile-pic" alt="profile-picture" height="60" width="60"></img>\
                </div>\
                  <p class="username" style="text-align:center;">'+ username + '</p> \
                </div>\
              <div class="col-10">\
                  <h4 style="padding-bottom: 10px; color: #223843;" id="overview">'+ overview + '\
                    <a class="btn position-absolute top-0 start-100 translate-middle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="position: absolute; right: 20px; top: 0;" item="' + count + '" onclick="editDeleteOption(this)"><i class="fa fa-ellipsis-v"></i></a>\
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">\
                      <a class="dropdown-item" id="edit'+ count + '" href="" data-toggle="modal" data-target="#editCommentModal" data-dismiss="modal" style="display: none;" item="' + count + '" onclick="editComment(this)">Edit</a>\
                      <a class="dropdown-item" id="delete'+ count + '" href="#" style="display: none;" item="' + count + '" onclick="deleteComment(this)">Delete</a>\
                      <a class="dropdown-item" id="report'+ count + '" href="#" item="' + count + '" onclick="editDeleteOption(this)">Report</a>\
                    </div>\
                  </h4>\
                  <p id="comment" style="color: #223843;">'+ comment + '</p>\
                  <p id="dateOfVisit'+ count + '"><b>Date visited:</b> ' + dateVisited + '</p>\
                  <p id="rating'+ count +'"></p>\
                  <small id="dateReviewed">Reviewed on '+ datePosted + '</small>\
              </div>\
          </div>\
      </div>\
    </li>';
      table.insertAdjacentHTML("beforeend", html);
    }
    ratings += rating
    displayRating(count, rating)
  }
  var averageRating = (ratings / comment_array.length).toFixed(1)
  document.getElementById('aveRating').innerHTML = averageRating
  displayAveRating(averageRating)  
}

// stackoverflow moving array position
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

// allow user to only delete/edit their comment
function editDeleteOption(element) {
  var item = element.getAttribute("item")
  currentIndex = item
  console.log(userid)
  var editID = "edit" + item
  var deleteID = "delete" + item
  var reportID = "report" + item
  if (token != null && comment_array[item].user_id == userid) {
    document.getElementById(editID).style.display = "block"
    document.getElementById(deleteID).style.display = "block"
    document.getElementById(reportID).style.display = "none"
  }
}

function newComment() {
  //Initialise each HTML input elements in the modal window with default value.
  if (token == null) {
    document.getElementById("postComment").dataset.target = "#commentModalNotSignedIn"
  }
  else {
    rating = 0;
    document.getElementById("overviewReview").value = "";
    document.getElementById("userComments").value = "";
    document.getElementById("dateVisited").value = "";
    document.getElementById("imageInput").value = "";
    document.getElementById("output").src = "";
  }
}

//This function allows the user to mouse hover the black and white popcorn
//so that it will turn to a colored version when hovered
function rateIt(element) {
  var num = element.getAttribute("value");
  var classname = element.getAttribute("class"); // 'pop'
  var popcorns = document.getElementsByClassName(classname);
  var classTarget = "." + classname;

  // This is another way of writing 'for' loop, which initialises the
  // popcorn images to use black and white.
  for (let popcorn of popcorns) {
    popcorn.setAttribute("src", popcornBWImage);
  }
  changePopcornImage(num, classTarget);
}

// This function sets the rating and coloured images based on the value of the image tag when
// the mouse cursor hovers over the popcorn image.
function changePopcornImage(num, classTarget) {
  switch (
  eval(num) // an alternative to if else statement
  ) {
    case 1:
      document
        .querySelector(classTarget + "[value='1']")
        .setAttribute("src", popcornImage);
      rating = 1;
      break;
    case 2:
      document
        .querySelector(classTarget + "[value='1']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='2']")
        .setAttribute("src", popcornImage);
      rating = 2;
      break;
    case 3:
      document
        .querySelector(classTarget + "[value='1']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='2']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='3']")
        .setAttribute("src", popcornImage);
      rating = 3;
      break;
    case 4:
      document
        .querySelector(classTarget + "[value='1']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='2']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='3']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='4']")
        .setAttribute("src", popcornImage);
      rating = 4;
      break;
    case 5:
      document
        .querySelector(classTarget + "[value='1']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='2']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='3']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='4']")
        .setAttribute("src", popcornImage);
      document
        .querySelector(classTarget + "[value='5']")
        .setAttribute("src", popcornImage);
      rating = 5;
      break;
  }
}

// variable photo
var photo;

function encode() {
  var selectedFile = document.getElementById('imageInput').files;
  if (selectedFile.length > 0) {
    var imageFile = selectedFile[0]
    var fileReader = new FileReader()
    fileReader.onload = function (fileLoadedEvent) {
      photo = fileLoadedEvent.target.result;
    }
    fileReader.readAsDataURL(imageFile)
  }
}

function encodeEdit() {
  var selectedFile = document.getElementById('imageInputEdit').files;
  if (selectedFile.length > 0) {
    var imageFile = selectedFile[0]
    var fileReader = new FileReader()
    fileReader.onload = function (fileLoadedEvent) {
      photo = fileLoadedEvent.target.result;
    }
    fileReader.readAsDataURL(imageFile)
  }
}

// Submit or send the new comment to the server to be added.
function addComment() {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  restaurantID = params.get("id");

  var comment = new Object();
  comment.restaurant_id = restaurantID; // Movie ID is required by server to create new comment
  comment.user_id = userid
  comment.date_posted = null
  comment.photo = photo
  comment.comment = document.getElementById("userComments").value; // Value from HTML input text
  comment.overview = document.getElementById("overviewReview").value;
  comment.date_visited = document.getElementById("dateVisited").value; // Value from HTML input text
  comment.rating = rating;

  if (document.getElementById("imageInput").value == "") {
    comment.photo = null
  }

  var postComment = new XMLHttpRequest(); // new HttpRequest instance to send comment

  postComment.open("POST", "https://127.0.0.1:8080/comments", true); //Use the HTTP POST method to send data to server

  postComment.setRequestHeader("Content-Type", "application/json");
  postComment.setRequestHeader("Authorization", "Bearer " + token);
  postComment.onload = function () {
    var respond = JSON.parse(postComment.responseText)
    console.log(respond)
    console.log("new comment sent");
    location.reload()
    fetchComments(); // fetch all comments again so that the web page can have updated comments.
  };
  // Convert the data in Comment object to JSON format before sending to the server.
  postComment.send(JSON.stringify(comment));
}

//This function will hide the existing modal and present a modal with the selected comment
//so that the user can attempt to change the username, rating or movie review
function editComment(element) {
  var item = element.getAttribute("item"); // position of this comment in the comment
  currentIndex = item;

  document.getElementById("overviewEdit").value = comment_array[item].overview;
  document.getElementById("userCommentEdit").value = comment_array[item].comment;
  document.getElementById("dateVisitedEdit").value = comment_array[item].date_visited;
  document.getElementById("outputImage").src = comment_array[item].photo
  console.log(comment_array[item].rating);
  displayColorPopcorn("editpop", comment_array[item].rating);
  if (comment_array[item].photo == null) {
    document.getElementById('deletePhotoButton').style.display = "none"
    document.getElementById("outputImage").src = " "
    console.log('photo null')
  }
}

//This function displayS the correct number of colored popcorn
//based on the movie rating that is given in the user comment
function displayColorPopcorn(classname, num) {
  var pop = document.getElementsByClassName(classname);
  var classTarget = "." + classname;
  for (let p of pop) {
    p.setAttribute("src", popcornBWImage);
  }
  changePopcornImage(num, classTarget);
}

//This function sends the Comment data to the server for updating
function updateComment() {
  var response = confirm("Are you sure you want to update this comment?");
  if (response == true) {
    var edit_comment_url = "https://127.0.0.1:8080/comments/" + comment_array[currentIndex]._id;
    var updateComment = new XMLHttpRequest(); // new HttpRequest instance to send request to server

    updateComment.open("PUT", edit_comment_url, true); //The HTTP method called 'PUT' is used here as we are updating data
    updateComment.setRequestHeader("Content-Type", "application/json");
    updateComment.setRequestHeader("Authorization", "Bearer " + token);

    comment_array[currentIndex].overview = document.getElementById("overviewEdit").value;
    comment_array[currentIndex].comment = document.getElementById("userCommentEdit").value;
    comment_array[currentIndex].date_visited = document.getElementById("dateVisitedEdit").value;
    comment_array[currentIndex].rating = rating;
    if (document.getElementById("imageInputEdit").value == "") {
      comment_array[currentIndex].review = null
    }
    comment_array[currentIndex].photo = photo

    updateComment.onload = function () {
      console.log(JSON.parse(updateComment.responseText))
      location.reload()
      fetchComments()
    };

    updateComment.send(JSON.stringify(comment_array[currentIndex]));
  }
}

function deletePhoto(){
  var eraseComment = new XMLHttpRequest();
    eraseComment.open("DELETE", "https://localhost:8080/comment/"+ comment_array[currentIndex]._id +"/photo", true);
    eraseComment.setRequestHeader("Content-Type", "application/json");
    eraseComment.setRequestHeader("Authorization", "Bearer " + token);
    eraseComment.onload = function () {
      location.reload()
      fetchComments();
    };
    eraseComment.send();
}

//This function deletes the selected comment in a specific movie
function deleteComment(element) {
  var response = confirm("Are you sure you want to delete this comment?");

  if (response == true) {
    var item = element.getAttribute("item"); //get the current item
    var delete_comment_url = "https://127.0.0.1:8080/comments/" + comment_array[item]._id;
    var eraseComment = new XMLHttpRequest();
    eraseComment.open("DELETE", delete_comment_url, true);

    eraseComment.setRequestHeader("Content-Type", "application/json");
    eraseComment.setRequestHeader("Authorization", "Bearer " + token);
    eraseComment.onload = function () {
      fetchComments();
    };
    eraseComment.send();
  }
}

function loadFile(event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src)
  }
};

function loadFileEdit(event) {
  var output = document.getElementById('outputImage');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src)
  }
};

function showImage(element) {
  var picture = element.getAttribute("src")
  document.getElementById("expandedImg").src = picture
}

function displayRating(id, rating) {
  var priceDiv = document.getElementById("rating" + id)
  for (let index = 0; index < rating; index++) {
      priceDiv.innerHTML += '<img src="images/star.png" height="20px">'
  }
}

function displayAveRating(rating) {
  var ratingDiv = document.getElementById("aveRating");
  if (comment_array.length == 0) {
      ratingDiv.innerHTML = "No review yet"
  }
  if (rating >= 0 && rating <= 0.3) {
      ratingDiv.innerHTML = rating + ""
  }
  if (rating >= 0.3 && rating <= 0.8) {
      ratingDiv.innerHTML = rating + "<img src='images/halfStar.png' style='height:20px; margin-left: 15px;' />" 
  }
  if (rating >= 0.8 && rating <= 1.3) {
      ratingDiv.innerHTML = rating + "<img src='images/star.png' style='height:20px; margin-left: 15px;' />"
  }
  if (rating >= 1.3 && rating <= 1.8) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 1.8 && rating <= 2.3) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 2.3 && rating <= 2.8) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 2.8 && rating <= 3.3) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 3.3 && rating <= 3.8) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 3.8 && rating <= 4.3) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 4.3 && rating <= 4.8) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/halfStar.png' style='height:20px; margin-right: 15px;' />" 
  }
  if (rating >= 4.8) {
      ratingDiv.innerHTML = rating +"<img src='images/star.png' style='height:20px; margin-left: 15px;' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px' /><img src='images/star.png' style='height:20px; margin-right: 15px;' />" 
  }

}