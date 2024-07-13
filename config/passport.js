const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
                if (err) throw err;
                if (!user) {
                    return done(null, false, { message: 'No user found' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
            done(err, user);
        });
    });
};
