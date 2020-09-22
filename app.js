const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const SMOOTHIES = require('./data/smoothies');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const PORT = process.env.PORT;
//const PORT = 3000;
const dbURI = "mongodb+srv://Aniket:aniket1234@nodetutorials.ey0dd.mongodb.net/node-awt?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home',{title:"Home"}));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies',{title:"Smoothies",smoothies:SMOOTHIES}));
app.use(authRoutes);





