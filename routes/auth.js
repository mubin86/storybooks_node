const express = require("express");
const passport = require("passport");
const router = express.Router();

// @description    AUTH WITH GOOGLE
// @route          GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc   Logut user
// @route  /auth/logut
router.get("/logout", (req, res) => {
  req.logOut(); // built in process agulu passport middleware er
  res.redirect("/");
});

module.exports = router;
