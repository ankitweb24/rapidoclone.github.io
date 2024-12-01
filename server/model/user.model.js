import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least three charcatars long"],
    },
    lastname: {
      type: String,
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least five charcatars long"],
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

//create a token
userSchema.methods.genAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTSECRET);
  return token;
};

//compare Password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;