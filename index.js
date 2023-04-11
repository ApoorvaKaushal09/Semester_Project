const express = require('express')
const path = require('path')
const ejs = require("ejs");
// var jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser')

const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const bodyParser = require('body-parser')

const app = express()
const port = 3000
const {collection, collection2,collection3,collection4} = require("./mongodb");
const { param } = require('express-validator');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")))

app.use('/' , require(path.join(__dirname, 'routes/blog.js')))

app.use(express.static(__dirname+"./public/"));

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename:  (req, file, cb) =>{
    cb(null, file.fieldname + "_" + Date.now()+path.extname(file.originalname));
  }
});
var upload=multer({
  storage:Storage
});



app.get('/flats',(req,res)=>  {
  collection2.find({}).then((x) =>{
    res.render("flats", {x, route:'/flats',error:""})
  }).catch((y) => {
    console.log(y)
  })
})
app.post('/search/',(req,res)=>  {
  var loc=req.body.fltrcity;
  var price=req.body.price;
  console.log(price)
  console.log(loc)
  if(loc!='' && price!='')
  {
    var parameter={fcity:loc,fprice:{$lte:price}}
  }
    else if(loc!='' && price=='')
    {
      var parameter={fcity:loc}
    }
    else if(loc=='' && price!='')
    {
      var parameter={fprice:{$lte:price}}
    }
    else
    {
      var parameter={}
    }
    // else{
    //   collection2.find({}).then((x) =>{
    //     res.render("flats", {x, route:'/flats',error:"Enter the City"})
    //   }).catch((y) => {
    //     console.log(y)
    //   })
    // }
  collection2.find(parameter).then((x) =>{
    console.log(x);
    res.render("flats", {x, route:'/flats',error:""})
  }).catch((y) => {
    res.render("flats", {y, route:'/flats',error:"No Record Found"})
    console.log(y)
  })

})


//for uplaoding images

app.get('/upload',(req,res)=>  {
  // var success=req.file.filename+" uplaod successfully";
  
  collection3.find({}).then((x) =>{
    res.render("upload", {x, route:'/upload'})
  }).catch((y) => {
    console.log(y)
  })
})
app.post('/upload',upload.single("file"),async (req,res)=>  {
  // console.log(image)
  if(!req.files || req.files.length<4)
  return res.render("upload",{x,error:"at least 4 photos uploaded",route:'/upload'});
  const imagedetails={
    imagename:req.file.filename
  };
  await collection3.insertMany([imagedetails]);
  collection3.find({}).then((x) =>{
    res.render("upload", {x,error:"at least 4 photos uploaded", route:'/upload'})
  }).catch((y) => {
    console.log(y)
  })
  
  res.render("upload")
})





app.use('/sell' , require(path.join(__dirname, 'routes/blog.js')))
app.get('/sell',(req,res)=>  {
    res.render("sell", { route:'/sell'})
  
})
app.post("/sell",upload .fields([{name:"pdfFile",maxCount:1},{name:"imageFile",minCount:4,maxCount:10}]),async (req, res) => {
  if(!req.files || req.files.length<4)
  return res.render("sell",{error:"at least 4 photos uploaded"});
  const data = {
    description: req.body.description,
    fname: req.body.fname,
    fcontact: req.body.fcontact,
    femail: req.body.email,
    floc: req.body.floc,
    fstate: req.body.fstate,
    fcity: req.body.fcity,
    fprice: req.body.fprice,
    ftype: req.body.ftype,
    furnish: req.body.furnish,
    size: req.body.size,
    image:req.files.imageFile.map(imageFile=>imageFile.filename),
    propDocument:{
      name:req.files.pdfFile[0].filename,
      data:req.files.pdfFile[0].buffer,
    }

  }
  await collection2.insertMany([data]);

  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login", {route : '/login'});
});
app.get("/signup", function (req, res) {
  res.render("signup", {route : '/signup'});
});

// Handling user signup
app.post('/signup', async(req, res) => {
  const data = {
    name: req.body.name,
    email:req.body.email,
    password: req.body.password,
    contact:req.body.contact,
  }
  await collection.insertMany([data]);
  res.render("home")
})
// app.post("/signup", async (req, res) => {
//   const user = await collection.create({
//     name: req.body.uname,
//     email:req.body.email,
//     password: req.body.password,
//     contact:req.body.contact
//   });
//   res.send("User Sign up successfully")
//   // res.status(200).json(user);
// });

//Showing login form
app.get("/login", function (req, res) {
  res.render("login",{route:'/login'});
});
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await collection.findOne({ email: req.body.email });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.render("home");
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});
// app.get("/adminlogin", function (req, res) {
//   res.render("adminlogin", {route : '/adminlogin'});
// });
app.get('/rent', function(req, res){
  res.render("rent"), { route:'/rent' }
})

app.get("/admin", function (req, res) {
  res.render("admin", {route : '/admin'});
});










// app.get('/flat/:id', (req, res) => {
//   const flatId = req.params.id; // get the flat id parameter from the request
//   // find the flat details using the flatId and pass them to the view
//   const flat = findFlatDetails(flatId); // replace with your function to fetch the flat details
//   res.render('flatDetails', { flat });
// });

app.get('/flats/:id',(req,res)=>  {
  collection2.findById(req.params.id).then((x) =>{
    res.render("flatDetails", {x})
  }).catch((y) => {
    console.log(y)
  })
})


app.get("/dash/:id", async (req, res) => {
  const user = await collection.findById(req.params.id);
  var email=user.email;
    const flat = await collection2.find({femail:email});
  //   console.log(user);
    
  //   console.log(flat);
  //   console.log(req.params.id);
  try {   
    res.render("dashboard", { user,flat });
  } catch (err) {
    console.log("here");
    res.status(500).json(err);
  }
  // res.render("dash"), { route: "/dash" };
});

app.get("/delete/:id",async (req,res)=>  {
  // var del=collection2.remove({_id:req.params.id});
  const id=req.params.id
  try {
    await collection2.findByIdAndDelete(id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
})
// app.get('/edit/:id',async (req,res)=>  {
//   const id=req.params.id
//   try {
//     var edit = await collection2.findById(id);
//     res.render('edit',{edit,title:"edit the records"});
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
//   }
// )
// app.post('/update/',async (req,res)=>  {
//   // const id=req.params.id
//   const update={
//     description: req.body.description,
//       fname: req.body.fname,
//       fcontact: req.body.fcontact,
//       femail: req.body.email,
//       floc: req.body.floc,
//       fstate: req.body.fstate,
//       fcity: req.body.fcity,
//       fprice: req.body.fprice,
//       ftype: req.body.ftype,
//       furnish: req.body.furnish,
//       size: req.body.size
//   }
//   collection2.findByIdAndUpdate(req.body.id, update, { new: true })
//   .then(updatedDocument => {
//     console.log(`Updated document: ${updatedDocument}`);
//     res.redirect('/');
//   })
//   .catch(err => {
//     console.error(`Failed to update document: ${err}`);
//   });
  // try {
  //   var edit = await collection2.findByIdAndUpdate(req.body.id,$set{ description: req.body.description,
  //     fname: req.body.fname,
  //     fcontact: req.body.fcontact,
  //     femail: req.body.email,
  //     floc: req.body.floc,
  //     fstate: req.body.fstate,
  //     fcity: req.body.fcity,
  //     fprice: req.body.fprice,
  //     ftype: req.body.ftype,
  //     furnish: req.body.furnish,
  //     size: req.body.size
  //     });
  //     console.log("updated")
  //     res.redirect('/');
  // } catch (err) {
  //   console.error(err);
  //   res.sendStatus(500);
  // }
//   }
// )


app.listen(process.env.PORT || port , () => {
    console.log('Listening at port https://localhost:${port}')
})


// function sendMail(){
//   var params = {
//     email: document.getElementById("emailHelp").value ,
//     phone:document.getElementById("contactNumberField").value ,
//     Query: document.getElementById("QueryField").value,
//   };
// const serviceID = "service_5vovegd";
// const templateID = "template_3pbw70x"
// emailjs.send(serviceID,templateID,params)
// .then(
//   res =>{
//     document.getElementById("email").value="";
//     document.getElementById("phone").value="";
//     document.getElementById("Query").value="";
//     console.log(res);
//     alert("your message sent successfully");
//   })
// .catch((err) => console.log(err));


// }