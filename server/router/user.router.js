import { Router } from "express";
const router = Router();
import { body } from "express-validator";

//userRegister router create
router.post("/register", [
  body("email").isEmail().withMessage("Invalid Email"),
  body("fullname.firstname")
    .isLength({ min: 3 })
    .withMessage("firstname to be short"),
  body("fullname.lastname").optional(),
  body("password").isLength({ min: 6 }).withMessage("password to be short"),
]);

export default router;
