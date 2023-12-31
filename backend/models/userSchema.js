const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  messages: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: Number, required: true },
      message: { type: String, required: true },
    },
  ],

  tokens: [{ token: { type: String, required: true } }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

//Storing Tokens in Database
userSchema.methods.generateAuthToken = async function () {
  try {
    let newToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: newToken });
    await this.save();
    return newToken;
  } catch (error) {
    console.log(error);
  }
};

//Storing Message in Database
userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("user_Data", userSchema);

module.exports = User;
                                                                                 