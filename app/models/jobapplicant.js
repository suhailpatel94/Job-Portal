var mongoose = require('mongoose');

var jobapplicant = mongoose.Schema({
    jobpostid: String,
    username: String,
    certificate:String
})


module.exports = mongoose.model('Jobapplicant', jobapplicant);