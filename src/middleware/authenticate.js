const jwt = require('jsonwebtoken');
const Musical = require('../Models/musical');

const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SPECIAL_KEY);
        const user = await Musical.findOne({_id: verifyUser._id});
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;