const mongoose =require('mongoose');
//making a schema that will be linked to the user and the event that they bought tickets for
const TicketSchema = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    event:{type:mongoose.Schema.Types.ObjectId, ref:'Event', required:true},
    quantity: {type:Number,required:true, min:1},
    TicketDate:{type:Date, default:Date.now}
});
module.exports= mongoose.model('Ticket', TicketSchema);