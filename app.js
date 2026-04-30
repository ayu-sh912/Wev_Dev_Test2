require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./config/db');
require('./config/passport');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const gunRoutes = require('./routes/guns');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'gun-inventory-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/guns', gunRoutes);

app.use((req, res) => {
  res.status(404).render('guns/not-found', {
    title: 'Not Found',
    message: 'The requested page could not be found.',
  });
});

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
