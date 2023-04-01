const express = require('express')
const path = require('path')
const ejs = require("ejs");
// const bodyParser = require('body-parser')
const app = express()
const port = 3000
const {collection, collection2} = require("./mongodb")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")))

app.use('/' , require(path.join(__dirname, 'routes/blog.js')))

app.get('/flats',(req,res)=>  {
  collection2.find({}).then((x) =>{
    res.render("flats", {x, route:'/flats'})
  }).catch((y) => {
    console.log(y)
  })
})


app.use('/sell' , require(path.join(__dirname, 'routes/blog.js')))
app.post("/sell", async (req, res) => {
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
  };

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



app.listen(process.env.PORT || port , () => {
    console.log('Listening at port https://localhost:${port}')
})







