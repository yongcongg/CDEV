var express = require ("express"); //using the express framework

var RestaurantController = require ('./controllers/restaurantController');
var CommentController = require ('./controllers/commentController');
var UserController = require('./controllers/userController');
var AuthController = require('./controllers/authController');
var SocialsController = require('./controllers/socialsController');

const verify = require('./middleware/verifyToken');
var cors = require('cors');

var app = express();
app.use(express.static("./public"));
app.use(express.json({limit: '50mb'}));

app.use(cors());
app.options('*', cors());

require('dotenv').config();

app.route('/restaurants').get(RestaurantController.getAllRestaurants); //
app.route('/restaurant/:id').get(RestaurantController.getRestaurantById);
app.route('/restaurants/search').post(RestaurantController.getRestaurantsBySearch); //
app.route('/restaurants/region').get(RestaurantController.getRestaurantsByRegion); //
app.route('/restaurants/price').get(RestaurantController.getRestaurantsByPrice); //
app.route('/restaurants/establishment').post(RestaurantController.getRestaurantByEstablishment); //
app.route('/restaurants/establishment/:id').get(RestaurantController.getRestaurantByEstablishmentByID); //
app.route('/restaurants/cuisine/:id').get(RestaurantController.getRestaurantByCuisineByID); //
app.route('/restaurants/cuisine').post(RestaurantController.getRestaurantByCuisine); //
app.route('/restaurants/photos/:id').get(RestaurantController.getRestaurantPhoto); //

app.route('/restaurants/favourites').post(verify, RestaurantController.addUserFavourite); //
app.route('/restaurants/favourites').get(verify, RestaurantController.getUserFavourite); //
app.route('/restaurants/favourites/:id').delete(verify, RestaurantController.deleteUserFavourite); //

app.route('/comments').get(CommentController.getAllComments);
app.route('/comments/:id').get(CommentController.getAllCommentsFromRestaurant);

app.route('/comments').post(verify, CommentController.addComment);
app.route('/restaurants/photo').get()
app.route('/comments/:id').put(verify, CommentController.updateComment);
app.route('/comments/:id').delete(verify, CommentController.deleteComment);
app.route('/comment/:id/photo').delete(verify, CommentController.deletePhotoInComment); //
app.route('/comment/:id/photo').put(verify, CommentController.updatePhotoInComment);
app.route('/user/comments').get(verify, CommentController.getAllCommentsFromAUser);

app.route('/user').get(verify, UserController.getUser); //
app.route('/user').put(verify, UserController.updateUser); //
app.route('/user/profilePic').put(verify, UserController.updateProfilePic);
app.route('/user').delete(verify, UserController.deleteUser); //
app.route('/disable').put(verify, UserController.deactivateAccount); //
app.route('/enable').put(verify, UserController.activateAccount);
app.route('/token').post(AuthController.generateAccessToken); //
app.route('/logout').delete(AuthController.logout); //
app.route('/updatePassword').put(verify, UserController.updatePassword); //

app.route('/forgetPassword').post(AuthController.forgetPasswordEmail); //
app.route('/resetPassword/:token').put(AuthController.resetPasswordToken); //

app.route('/login').post(AuthController.authUser); //
app.route('/signup').post(AuthController.signUp); //
app.route('/confirmation/:token').put(AuthController.activateAccount); //

app.route('/login/google').post(AuthController.googleLogin);
app.route('/login/facebook').post(AuthController.facebookLogin);
app.route('/signup/google').post(AuthController.googleSignUp);
app.route('/signup/facebook').post(AuthController.facebookSignUp);
app.route('/username').post(AuthController.usernameCheck);
app.route('/email').post(AuthController.checkEmail);

app.route('/user/2fa').post(verify, AuthController.twofaSignUp);
app.route('/user/2fa/confirm').post(verify, AuthController.secretConfirm);
app.route('/user/tempSecretDelete').delete(verify, AuthController.removeTempSecret);
app.route('/user/2fa/remove').delete(verify, AuthController.removetwoFA);

app.route('/login/2fa').post(AuthController.twoFA);
app.route('/user/connect/google').post(verify, SocialsController.connectGoogle);
app.route('/user/connect/facebook').post(verify, SocialsController.connectFacebook);
app.route('/user/connect/google').delete(verify, SocialsController.disconnectGoogle);
app.route('/user/connect/facebook').delete(verify, SocialsController.disconnctFacebook);
//app.route('/sendVerification/:id').get(AuthController.sendEmailToActivateAcc);

const https = require('https');
const fs = require('fs');
const httpsServer = https.createServer({
    key: fs.readFileSync("C:/Users/ycnn2/localhost+2-key.pem"),
    cert: fs.readFileSync("C:/Users/ycnn2/localhost+2.pem"),
    }, app
); 

httpsServer.listen(8080, "127.0.0.1"); //start the node js to be listening to incoming request @ port 8080
console.log("web server running @ https://127.0.0.1:8080"); //output to console