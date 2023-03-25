const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Abode", {
}).then(() => {
    console.log(`connection successful`);
}).catch((e) =>{
    console.log(`no connection`)
})
const SignupSchema = new mongoose.Schema({
    name:{
        type: String, 
        // required:true
    },
    email:{
        type: String, 
        required:true
    },
    password:{
        type: String, 
        required:true
     }
    ,
    contact:{
        type: String, 
        // required:true
    }

});

const flatSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true,
    },
  
    fname: {
      type: String,
      required: true,
    },
  
    fcontact: {
      type: String,
      required: true,
    },
  
    floc: {
      type: String,
      required: true,
    },
  
    fstate: {
      type: String,
      required: true,
    },
  
    fcity: {
      type: String,
      required: true,
    },

    fprice:{
      type:Number,
      required: true
    },
  
    ftype: {
      type: String,
      required: true,
    },
  
    furnish: {
      type: String,
      required: true,
    },
  
    size: {
      type: String,
      required: true,
    },
  });




const collection = new mongoose.model("userSignup", SignupSchema)
const collection2 = new mongoose.model("flatDetails", flatSchema)
module.exports = {collection, collection2};