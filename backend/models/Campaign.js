const mongoose=require("mongoose");

module.exports=mongoose.model("Campaign",
 new mongoose.Schema({
 name:String,
 platform:String,
 budget:Number,
 leads:Number,
 sales:Number
}));
