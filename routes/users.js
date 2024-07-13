const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Register Page
router.get('/register', (req, res) => res.render('register', { errors: [] }));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = {
                    name: name,
                    email: email,
                    password: password
                };

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [newUser.name, newUser.email, newUser.password], (err) => {
                            if (err) throw err;
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        });
                    });
                });
            }
        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/author',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
