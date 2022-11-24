const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHander = require('express-async-handler');
const User = require('../models/UserModel');

// @desc Register new user
// @troute POST /api/users
// @access Public
const registerUser = asyncHander(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  //Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc aithenticate user
// @troute POST /api/users/login
// @access Public
const loginUser = asyncHander(async (req, res) => {
  const { email, password } = req.body;

  //check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  res.json({ message: 'Login user' });
});

// @desc Get user data
// @troute GET /api/users/me
// @access Public
const getMe = asyncHander(async (req, res) => {
  const{_id, name, email}=await User.findById(req.user.id)

  res.status(200).json({
    id:_id,
    name,
    email
  })
});

//Generate JWT
const generateToken=(id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn:'30d'
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
};