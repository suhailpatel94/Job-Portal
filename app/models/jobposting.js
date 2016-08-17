var mongoose = require('mongoose');

var jobposting = mongoose.Schema({
    company_id: String,
    CompanyName: String,
    PostName: String,
    Vacancy:Number,
    RequiredSkills: [String],
    OtherSkills: [String],
    Salary: Number,
    Description: String,
    contact: Number,
    city: String,
    email: String
}, {
    strict: false
})

module.exports = mongoose.model('Jobposting', jobposting);
