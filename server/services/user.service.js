import userModel from "../model/user.model.js";

const createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !lastname || !email || !password) {
    throw new Error("All Fields Are Required");
  }

  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
};

export default createUser;
