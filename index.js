const express = require('express')
const path = require('path')
const ejs = require("ejs");
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const collection = require("./mongodb")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")))


// app.use('/signup',require(path.join(__dirname, 'routes/blog.js')))
app.use('/' , require(path.join(__dirname, 'routes/blog.js')))

app.use('/flats' , require(path.join(__dirname, 'routes/blog.js')))

app.use('/sell' , require(path.join(__dirname, 'routes/blog.js')))
// app.get('/signup', (req,res) => {
//     res.render("signup", {route : 'signup'})
// })
// app.post('/signup', async(req,res) => {
//     const data = {
//         "name": req.body.uname, 
//         "email":req.body.email,
//         "password": req.body.password,
//         "contact": req.body.contact
//     };
//     await collection.insertMany([data]);
//     res.send("inserted")
//     // res.render("home")
// })

// app.get('/login', (req,res) => {
//     res.render("login")
// })

// app.post("/login", async (req, res) => {
  
//     try {
//       let check = await collection.findOne({ email: req.body.email }).exec();
//       if(check)
//       res.send("User exists")
//       else
//       {
//         res.send("Doesnt exist")
//       }
      
//       // if (check.password === req.body.password) {
//       //   // res.render("home");
//       //   res.send("Succesfully login")
//       // } else {
//       //   res.send("wrong password");
//       // }
//     }
//      catch {
//       res.send("wrong details");
//     }
//   });

app.get("/signup", function (req, res) {
  res.render("signup");
});

// Handling user signup
app.post("/signup", async (req, res) => {
  const user = await collection.create({
    name: req.body.uname,
    email:req.body.email,
    password: req.body.password,
    contact:req.body.contact
  });
  res.send("User Sign up successfully")
  // res.status(200).json(user);
});

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await collection.findOne({ email: req.body.email });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.send("Logged in");
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

app.listen(process.env.PORT || port , () => {
    console.log('Listening at port https://localhost:${port}')
})







