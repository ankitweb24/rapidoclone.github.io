import userModel from "../model/user.model.js";
import { validationResult } from "express-validator";
import createUser from "../services/user.service.js";
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
    return res.status(400).json({ error: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  console.log(isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const token = user.genrateAuthToken();

  res.status(200).json({ token, user });
};
