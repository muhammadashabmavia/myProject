const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const post = require("./routes/posts");
require("dotenv/config");
const User = require("./models/users");

//////

var nodemailer = require("nodemailer");
//require


var router = express.Router();
const smtpTransport = require("nodemailer-smtp-transport");
const bodyParser = require("body-parser");

//setup nodemailer

let transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "syedashab80@gmail.com",
      pass: "syedmuhammadashabmavia123",
    },
  })
);
app.set("views", __dirname + '/views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( bodyParser.json()); 

app.get("/register", (req, res) => {
  res.render("register");
});

//get route to send mail, from form
app.post("/register", (req, res) => {
  console.log(req.body);
  const mailOptions = {
    from: "syedashab80@gmail.com",
    to: req.body.email, // from req.body.to
    subject: req.body.name, //from req.body.subject
    text: req.body.text, //from req.body.message
  };
  //delivery
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.redirect("/login")
    }
  });
});

//////


initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];





//app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/post", post);

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user?.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }))
app.post("/login", checkAuthenticated, (req, res, next) => {
	res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    newUser
      .save()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

      

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log("Done");
});

function checkAuthenticated(req, res, next) {
  // console.log(req, res, next)
  User.findOne({email: req.body.email})
	  .then( async (user) => {
		  if (user === null){
			  console.log("User/password does not match");
			  return next()
		  }

		  let pass = await bcrypt.compare(req.body.password, user.password)

		  if (!pass){
			  console.log("User/password does not match");
			  res.status(200).json({body:{message:"login successful"}})
			  return
		  }
		  return next()
	  })
	  .catch(error => console.warn(error))
}

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB!");
  }
);
app.listen(3000);
