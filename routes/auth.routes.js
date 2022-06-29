// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
// GET route ==> to display the signup form to users

router.post("/signup", (req, res, next) => {
  //console.log("The form data: ", req.body);
  const { username, password } = req.body;


 if (!username || !password) {
   res.render("auth/signup", {
     errorMessage:
       "All fields are mandatory. Please provide your username, email and password.",
   });
   return;
 }


  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username, //   |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      }); //console.log(`Password hash: ${hashedPassword}`);
    })
    .then(userFromDB => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch(error => next(error));
});// POST route ==> to process form data

router.get("/userProfile", (req, res) => res.render("users/user-profile"));


router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
     console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;
console.log(username, "username");
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
  
    .then(user => {
        console.log(user);
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other Username.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //res.render("users/user-profile", { user });
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch(error => next(error));
});

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});
 


module.exports = router;
