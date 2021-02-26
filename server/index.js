const express = require("express");
const morgan = require("morgan");
const path = require("path");
const db = require("./db");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const dbStore = new SequelizeStore({ db: db });
const { User } = require("./db/models");
if (process.env.NODE_ENV === "development") {
  require("../secrets");
}

const app = express();

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//logging middleware
app.use(morgan("dev"));

//body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static middleware
app.use(express.static(path.join(__dirname, "..", "public")));

//session(cookie) middleware
app.use(
  session({
    secret: "a wildly insecure secret",
    store: dbStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./auth"));
app.use("/api", require("./api"));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}); // Send index.html for any other requests

//error handling
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!

const startServer = async () => {
  await db.sync({ force: true });
  // sync so that our session table gets created
  await dbStore.sync();
  app.listen(port, function () {
    console.log("Knock, knock");
    console.log("Who's there?");
    console.log(`Your server, listening on port ${port}`);
  });
};

startServer();

module.exports = app; //////added because of jpfp
