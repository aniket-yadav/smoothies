const jwt = require('jsonwebtoken');
const User = require("../models/User");

// handle errors
const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'Email does not exists';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'mail is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'A smoothie is a drink made from pureed raw fruit and/or vegetables, typically using a blender. A smoothie often has a liquid base such as water, fruit juice, plant milk, and sometimes dairy products, such as milk, yogurt, ice cream or cottage cheese', {
    expiresIn: maxAge
  });
};

// controller actions
const signup_get = (req, res) => {
  res.render('signup',{title:"Sign up"});
}

const login_get = (req, res) => {
  res.render('login',{title:"Login"});
}

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
  
}
  
  const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

const logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}



module.exports = {
  login_get,
  login_post,
  signup_get,
  signup_post,
  logout_get
}