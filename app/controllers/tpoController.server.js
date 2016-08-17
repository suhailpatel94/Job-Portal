'use strict';

var path = process.cwd();
var util = require("util");
var fs = require("fs");
var Employers = require('../models/employer.js');
var Employees = require('../models/employee.js');
var Jobpostings = require('../models/jobposting');
var Jobapplicants = require('../models/jobapplicant');
var Graphs = require('../models/graph');

function TpoHandler() {


    this.employerRegistration = function (req, res) {
        res.render("jobEmployerRegister", {
            session: req.user
        });

    };

    this.employeeRegistration = function (req, res) {
        res.render("jobEmployeeRegister", {
            session: req.user
        });
    };


    this.postemployerRegistration = function (req, res) {

        var employer = Employers();


        employer.CompanyName = req.body.Company;
        employer.password = employer.generateHash(req.body.password);
        employer.save(function(err){
            res.redirect('/')
        });


    };

    this.postemployeeRegistration = function (req, res, next) {
        var skills = req.body.Skills.split('\r\n');
        //console.log(req.file);
        //res.send(req.file)

        var employee = new Employees();

        employee.Name = req.body.Name;
        employee.email = req.body.email;
        employee.password = employee.generateHash(req.body.password);
        employee.Skills = skills;
        employee.contact = req.body.contactnumber;
        employee.ResumeFilename = req.file.filename;
        employee.ResumeFileOriginalname = req.file.originalname;

        employee.save(function () {
            res.redirect('/')
        });


    };



    this.showjobPosting = function (req, res) {

        res.render('postAjob', {
            session: req.user
        });

    };



    this.postjobPosting = function (req, res) {



        var skills = req.body.RequiredSkills.split('\r\n');
        var jobpost = new Jobpostings();


        Graphs.findOne({
                "label": req.body.PostName
            })
            .exec(function (err, graph_data) {
                if (graph_data == null) {
                    save();
                    createGraphData();
                    res.redirect('/')
                } else
                    Graphs.update({
                        "label": req.body.PostName
                    }, {
                        $inc: {
                            "data": req.body.vacancy
                        }
                    })
                    .exec(function (err, result) {
                        save()
                        res.redirect('/')
                    })
            })

        function save() {
            jobpost.company_id = req.user._id;
            jobpost.CompanyName = req.user.CompanyName;
            jobpost.PostName = req.body.PostName;
            jobpost.Vacancy = req.body.vacancy;
            jobpost.RequiredSkills = skills;
            skills = req.body.OtherSkills.split('\r\n');
            jobpost.OtherSkills = skills;
            jobpost.Salary = req.body.Salary;
            jobpost.Description = req.body.Description;
            jobpost.contact = req.body.contactnumber;
            jobpost.city = req.body.city;
            jobpost.email = req.body.email;

            jobpost.save();
        }


        function createGraphData() {
            var graph = new Graphs();
            graph.label = req.body.PostName;
            graph.data = req.body.vacancy;
            graph.save();
        }
    }



    this.showemployeeLogin = function (req, res) {

        res.render('employeeLogin', {
            session: req.user
        });

    };

    this.showemployerLogin = function (req, res) {

        res.render('employerLogin', {
            session: req.user
        });

    };


    this.showjobportal = function (req, res) {


        Jobpostings.find({}, {
                PostName: 1,
                CompanyName: 1,
                city: 1
            })
            .exec(function (err, result) {
                Graphs.find({})
                    .exec(function (err, graph_data) {
                        if (graph_data[0] == null)
                            graph_data = "no"
                        res.render('jobportal', {
                            session: req.user,
                            jobpostings: result,
                            graph_data

                        });
                    })

            });



    };



    this.showJobDetails = function (req, res) {


        var jobId = req.params.jobid;
        var applied = false;
        if (req.user) {
            Jobapplicants.count({
                    "username": req.user.Name,
                    "jobpostid": jobId
                })
                .exec(function (err, count) {

                    if (parseInt(count) >= 1)
                        applied = true;

                    show();
                });
        } else {
            show();
        }


        function show() {
            Jobpostings.findById(jobId, function (err, result) {
                if (err) throw err;
                res.render('JobDetails', {
                    session: req.user,
                    jobdetails: result,
                    applied
                });


            });
        }
    };



    this.applyJob = function (req, res) {
        var jobId = req.params.jobid;

        var applicant = new Jobapplicants();


        Employees.find({
                "Name": req.user.Name
            })
            .exec(function (err, employee) {
                if (err) throw err;
                applicant.username = req.user.Name;
                applicant.jobpostid = jobId;
                employee = JSON.parse(JSON.stringify(employee));
                console.log("apply-job" + employee)
                console.log("apply-job" + employee)
                console.log("apply-job" + employee)
                if (employee[0].Certificate)
                    applicant.certificate = "yes";
                else
                    applicant.certificate = "no";
                applicant.save(function (err, result) {
                    res.redirect('back')
                });

            })



    };

    this.myJobs = function (req, res) {


        Jobpostings.find({
            "CompanyName": req.user.CompanyName
        }).
        exec(function (err, result) {
            if (err) throw err;
            res.render("companyJobs", {
                session: req.user,
                jobpostings: result
            });
        });

    };

    this.showJobApplications = function (req, res) {
        var jobId = req.params.jobid;
        Jobapplicants.find({
            "jobpostid": jobId
        }).
        exec(function (err, result) {
            if (err) throw err;
            res.render("showApplications", {
                session: res.user,
                applicants: result
            });
        });

    };


    this.showEmployeeDetails = function (req, res) {
        var emp_name = req.params.employeename;
        Employees.find({
                "Name": emp_name
            })
            .exec(function (err, result) {
                if (err) throw err;

                res.render("applicantdetails", {
                    session: req.user,
                    employeedetails: result
                })
            });


    };
}
module.exports = TpoHandler;
