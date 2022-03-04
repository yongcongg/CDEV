const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function(request, respond, next) {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
      respond.status(401).json("no token provided");  
    } 

    else {
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if(error){
                respond.status(400).json(error);
            }
            else{
                request.userid = decoded.userid;
                next();
            }
        })
    }
}