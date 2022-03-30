const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


const auth = async (req, res, next) => {

    try {
        const token = await req.cookies.jwt;

        const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        next();

    } catch (err) {
        res.send(err);
    }

}


module.exports = auth;