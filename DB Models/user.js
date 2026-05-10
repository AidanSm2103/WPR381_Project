const mongoose =require('mongoose');
//making a schema that will have the users login and roles
const UserSchema = new mongoose.Schema({
    FName:{ type: String, required: true},
    SName:{ type: String, required: true},
    Email:{ type: String, required: true},
    Password:{ type: String, required: true},
    //making sure that we can separate between normal users and the admin
    role:{type:String, enum: ['User','Admin'],
        default: 'User'
    }
}, {timestampts:true});
module.exports= mongoose.model('User', UserSchema);