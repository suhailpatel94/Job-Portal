var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var employer = mongoose.Schema({
    CompanyName: String,
    password: String,
}, {
    strict: false
})

employer.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

employer.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Employer', employer);
