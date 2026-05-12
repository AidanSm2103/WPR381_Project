const mongoose =require('mongoose');
//making a schema that will have the users login and roles
const EventSchema = new mongoose.Schema({
    Title:{ type: String, required: true},
    Description:{ type: String},
    Date:{ type: Date, required: true},
    Venue:{ type: String, required: true},
    Category:{type: String},
    Capacity:{type:Number, required:true},
    SoldTickets:{type:Number,default:0, required: true},
    Price:{type: Number, required:true}    
});
module.exports= mongoose.model('Event', EventSchema);