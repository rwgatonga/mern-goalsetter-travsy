const jwt = require('jsonwebtoken');
const asyncHander = require('express-async-handler');
const User = require('../models/UserModel');

const protect = asyncHander(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //Get token
      token = req.headers.authorization.split(' ')[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorised');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorised, no token');
  }
});

module.exports = { protect };
