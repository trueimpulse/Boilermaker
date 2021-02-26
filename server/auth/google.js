const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { User } = require("../db/models");

// collect our google configuration into an object
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

// configure the strategy with our config object, and write the function that passport will invoke after google sends
// us the user's profile and access token
const strategy = new GoogleStrategy(
  googleConfig,
  async function (token, refreshToken, profile, done) {
    try {
      const googleId = profile.id;
      const name = profile.displayName;
      const email = profile.emails[0].value;
      console.log(profile);

      let user = await User.findOne({ where: { googleId: googleId } });

      if (!user) {
        user = await User.create({ name, email, googleId });
        done(null, user);
      } else {
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

// register our strategy with passport
passport.use(strategy);

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

module.exports = router;
