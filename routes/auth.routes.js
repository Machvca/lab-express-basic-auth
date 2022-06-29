// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
// GET route ==> to display the signup form to users

router.post("/signup", (req, res, next) => {
  //console.log("The form data: ", req.body);
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
    })
    .catch((error) => next(error));
});// POST route ==> to process form data

module.exports = router;
