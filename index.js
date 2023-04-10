const express = require('express')
const path = require('path')
const ejs = require("ejs");
const multer  = require('multer')
const bodyParser = require('body-parser')
const auth = require('./middleware/auth')

const app = express()
const port = 3000
const {collection, collection2,collection3} = require("./mongodb");
const { param } = require('express-validator');
var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename:  (req, file, cb) =>{
    cb(null, file.fieldname + "_" + Date.now()+path.extname(file.originalname));
  }
});
var upload=multer({
  storage:Storage
});






app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use('/' , require(path.join(__dirname, 'routes/blog.js')))
app.use(express.static(__dirname+"./public/"));
app.use('/sell' , require(path.join(__dirname, 'routes/blog.js')))








app.get('/flats',(req,res)=>  {
  collection2.find({}).then((x) =>{
    res.render("flats", {x, route:'/flats'})
  }).catch((y) => {
    console.log(y)
  })
})

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
  const imagedetails={
    imagename:req.file.filename
  };
  await collection3.insertMany([imagedetails]);
  collection3.find({}).then((x) =>{
    res.render("upload", {x, route:'/upload'})
  }).catch((y) => {
    console.log(y)
  })
  
  res.render("upload")
})

app.get('/sell', auth, (req,res)=>  {
    res.render("sell", { route:'/sell'})
  
})
app.post("/sell",upload .fields([{name:"pdfFile",maxCount:1},{name:"imageFile",maxCount:10}]),async (req, res) => {
  const data = {
    description: req.body.description,
    fname: req.body.fname,
    fcontact: req.body.fcontact,
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
app.get('/rent', function(req, res){
  res.render("rent"), { route:'/rent' }
})

app.get("/admin", function (req, res) {
  res.render("admin", {route : '/admin'});
});

app.get('/flats/:id',(req,res)=>  {
  collection2.findById(req.params.id).then((x) =>{
    res.render("flatDetails", {x})
  }).catch((y) => {
    console.log(y)
  })
})








app.listen(process.env.PORT || port , () => {
    console.log('Listening at port https://localhost:${port}')
})
