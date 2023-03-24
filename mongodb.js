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
const collection = new mongoose.model("userSignup", SignupSchema)
module.exports = collection;