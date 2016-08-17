var LocalStrategy = require('passport-local').Strategy;
var Employers = require('../models/employer');
var Employees = require('../models/employee');

var ConfigAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log(user)
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        console.log("ididididididididididididididididididididid" + JSON.stringify(id))

        if (id['CompanyName']) {
            Employers.findById(id, function(err, user) {
                done(err, user);
            });
        } else {
            Employees.findById(id, function(err, user) {
                done(err, user);
            });
        }


    });


    // =========================================================================
    // Company login============================================================
    // =========================================================================
    passport.use('local-company-signin', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true


    }, function(req, name, password, done) {

        Employers.findOne({
            'CompanyName': name
        }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No company found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            console.log(user);
            return done(null, user);

        });
    }));


    passport.use('local-employee-signin', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true


    }, function(req, name, password, done) {
        console.log("namenamenamenamenamenamenamenamename" + name)
        Employees.findOne({
            'Name': name
        }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No company found.'));

            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                console.log("wrong passssssssssssssssssswwwwwwwwwordddddddddddddddddddd")
            }
            console.log(user);
            return done(null, user);

        });
    }));



};