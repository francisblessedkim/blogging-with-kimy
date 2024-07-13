const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const sqlite3 = require('sqlite3').verbose();

// Passport Config
require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Set up SQLite
global.db = new sqlite3.Database('./database.db', function(err) {
    if (err) {
        console.error(err);
        process.exit(1); // bail out if we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Handle requests to the home page 
app.get('/', (req, res) => {
    res.render('index');
});

// Add all the route handlers
const usersRoutes = require('./routes/users');
const authorsRoutes = require('./routes/authors');
const readersRoutes = require('./routes/readers');
app.use('/users', usersRoutes);
app.use('/author', authorsRoutes);
app.use('/reader', readersRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
