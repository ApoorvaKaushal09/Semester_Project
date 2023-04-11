const express = require('express')
const path = require('path')
const ejs = require("ejs");
const multer  = require('multer')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const {collection, collection2,collection3,collection4} = require("./mongodb");
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

function checkLoginUser(req, res, next){
  var userToken = localStorage.getItem('userToken')
  try{
    var decoded = jwt.verify(userToken, 'loginToken');
    next();
  }
  catch(err){
    res.redirect('/login');
  }
  
}



app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use('/' , require(path.join(__dirname, 'routes/blog.js')))
app.use(express.static(__dirname+"./public/"));



if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



app.get('/', (req, res) => {
  var loginUser = localStorage.getItem('loginUser')
  collection4.find({}).then((x) => {
    if (x.length >= 0) {
      // console.log(x)
      res.render("home", { x,loginUser:loginUser });
    } else {
      res.send("No data found.");
    }
  })
  .catch((y) => {
    console.log(y);
  });
  // res.render("home", {, })
})
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
  collection2.find(parameter).then((x) =>{
    console.log(x);
    res.render("flats", {x, route:'/flats',error:""})
  }).catch((y) => {
    res.render("flats", {y, route:'/flats',error:"No Record Found"})
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


app.post("/sell", checkLoginUser,upload .fields([{name:"pdfFile",maxCount:1},{name:"imageFile",minCount:4,maxCount:10}]),async (req, res) => {
  if(!req.files || req.files.length<4)
  return res.render("sell",{error:"at least 4 photos uploaded"});
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
 

app.get('/dashboard', checkLoginUser, (req, res) => {
  var loginUser = localStorage.getItem('loginUser')
  // res.send("User Dash")
  res.render("dashboard", { loginUser : loginUser })
})

app.get('/sell', checkLoginUser, (req, res) => {
  var loginUser = localStorage.getItem('loginUser')
  // res.send("User Dash")
  res.render("sell", { loginUser : loginUser })
})

app.post("/login", async function(req, res){
  try {
      const user = await collection.findOne({ email: req.body.email });
      if (user) {
        const result = req.body.password === user.password;
        if (result) {
          var id = user._id;
          var token = jwt.sign({ userId : id }, 'loginToken');
          localStorage.setItem('userToken', token);
          localStorage.setItem('loginUser', req.body.email);
          res.redirect('/');
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
app.get('/logout', (req, res, next) => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.send("Logged out")
})

app.post("/testimonial", async (req, res) => {
  const user = {
    name: req.body.name,
    loc: req.body.loc,
    views: req.body.views,
    gender: req.body.gender
  };
  await collection4.insertMany([user]);
  res.render("home");
  // res.status(200).json(user);
});

app.get("/testimonial", (req, res) => {
  collection4.find({}).then((x) => {
      if (x.length >= 0) {
        res.render("testimonial", { x });
      } else {
        res.send("No data found.");
      }
    })
    .catch((y) => {
      console.log(y);
    });
});

app.listen(process.env.PORT || port , () => {
    console.log('Listening at port https://localhost:${port}')
})
