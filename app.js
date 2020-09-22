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
const dbURI = "mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.ey0dd.mongodb.net/<DBNAME>?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home',{title:"Home"}));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies',{title:"Smoothies",smoothies:SMOOTHIES}));
app.use(authRoutes);
// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});



