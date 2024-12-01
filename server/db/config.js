import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DBURI);
    console.log(`connected`);
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
