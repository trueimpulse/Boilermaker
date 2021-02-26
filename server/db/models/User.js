const Sequelize = require("sequelize");
const db = require("../db");
const crypto = require("crypto");
const _ = require("lodash");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING,
  },
  googleId: {
    type: Sequelize.STRING,
  },
});

User.prototype.correctPassword = function (candidatePassword) {
  return User.encryptPassword(candidatePassword, this.salt) === this.password;
};

User.prototype.sanitize = function () {
  return _.omit(this.toJSON(), ["password", "salt"]);
};

// class methods
User.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function (plainText, salt) {
  const hash = crypto.createHash("sha1");
  hash.update(plainText);
  hash.update(salt);
  return hash.digest("hex");
};

function setSaltAndPassword(user) {
  //hook
  // we need to salt and hash again when the user enters their password for the first time
  // and do it again whenever they change it
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
}

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

module.exports = User;
