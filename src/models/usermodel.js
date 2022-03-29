require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

// generatging the token

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    console.log(this.tokens);

    return token;
  } catch (error) {
    console.log(error);
  }
};

// middleware

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`${this.password}`);
  }
  next();
});

//creating models

const User = new mongoose.model("User", userSchema);

module.exports = User;
