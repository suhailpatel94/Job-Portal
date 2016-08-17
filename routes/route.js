'use strict';
var crypto = require('crypto');
var path = process.cwd();
var pth = require('path');

var TpoHandler = require(path + '/app/controllers/tpoController.server.js')

var multer = require('multer');

var storage = multer.diskStorage({
    destination: './public/resume',
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + pth.extname(file.originalname))
        })
    }
});

var upload = multer({
    storage: storage
});

module.exports = function(app, passport) {

    var tpohandler = new TpoHandler();

    app.get('/', function(req, res) {
        res.redirect('/jobportal/')
    })

    app.get('/jobportal/', tpohandler.showjobportal);

    app.get('/jobportal/employerRegistration', tpohandler.employerRegistration);

    app.post('/jobportal/employerRegistration', tpohandler.postemployerRegistration);

    app.get('/jobportal/employeeRegistration', tpohandler.employeeRegistration);

    app.post('/jobportal/employeeRegistration', upload.single('Resume'), tpohandler.postemployeeRegistration);

    app.get('/jobportal/jobPosting', tpohandler.showjobPosting);

    app.post('/jobportal/jobPosting', tpohandler.postjobPosting);

    app.get('/jobportal/employeeLogin', tpohandler.showemployeeLogin);

    app.post('/jobportal/employeeLogin', passport.authenticate('local-employee-signin', {
        successRedirect: '/jobportal/',
        failureRedirect: '/jobportal/employeeLogin',
        failureFlash: true
    }));

    app.get('/jobportal/employerLogin', tpohandler.showemployerLogin);

    app.post('/jobportal/employerLogin', passport.authenticate('local-company-signin', {
        successRedirect: '/jobportal/',
        failureRedirect: '/jobportal/employerLogin',
        failureFlash: true
    }));


    app.get('/jobportal/details/:jobid', tpohandler.showJobDetails);

    app.post('/jobportal/details/:jobid', tpohandler.applyJob);

    app.post('/jobportal/logout', function(req, res) {
        req.logout();
        res.redirect('/jobportal/');
    });


    app.get('/jobportal/myjobs', tpohandler.myJobs);

    app.get('/jobportal/myjobs/:jobid', tpohandler.showJobApplications);

    app.get('/jobportal/applicantdetails/:employeename', tpohandler.showEmployeeDetails);

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/')

}