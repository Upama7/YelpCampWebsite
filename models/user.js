const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true 
    }
});

UserSchema.plugin(passportLocalMongoose); 

//include username and password we are using password plugin(passport-local-mongoose)

module.exports = mongoose.model('User', UserSchema);
