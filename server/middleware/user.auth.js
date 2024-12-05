import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
export const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized User" });
  }
};
