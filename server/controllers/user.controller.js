import userModel from "../model/user.model.js";
import { validationResult } from "express-validator";
import createUser from "../services/user.service.js";

import blackListModel from "../model/blacktoken.model.js";

export const userRegister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ error: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const hashPassword = await userModel.hashPassword("password");
  const user = await createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
  });

  const token = user.genAuthToken();

  res.status(201).json({ token, user });
};

export const userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ error: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ message: "Email Or Password is not matching.." });
  }

  const isMatch = user.comparePassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ message: "Email Or Password is not matching.." });
  }

  const token = user.genAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

export const userProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

export const userLogout = async (req, res, next) => {
  res.clearCookie("token");

  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListModel.create({ token });

  res.status(200).json({message : "User Logout"})

};
