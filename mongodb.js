const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Abode", {
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
  femail:{
    type:String,
    required:true,
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
    image:[String],
    propDocument:
  {
    name: String,
    data:Buffer,
    
  }
  });

const uplaodschema=new mongoose.Schema({
  imagename:
  {
    type: String,
  },
  // img:
  // {
  //   data:Buffer,
  //   contentType: String
  // }

});
const tschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  loc: {
    type: String,
    required: true,
  },

  views: {
    type: String,
    required: true,
  },
});



const collection4 = new mongoose.model("testimonials", tschema);




const collection = new mongoose.model("userSignup", SignupSchema)
const collection2 = new mongoose.model("flatDetails", flatSchema)
const collection3= new mongoose.model("uploadfiles",uplaodschema)
module.exports = { collection, collection2, collection3, collection4 };