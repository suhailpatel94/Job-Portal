var mongoose = require('mongoose');

var graph = mongoose.Schema({
    label:String,
    data:Number

}, {
    strict: false
})

module.exports = mongoose.model('Graph', graph);
