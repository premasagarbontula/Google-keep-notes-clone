import mongoose from "mongoose";
import colors from "colors";

const mongoDb = async () => {
  try {
    const mongoConnection = await mongoose.connect(
      process.env.CONNECTION_STRING
    );
    console.log("Connected to Mongo Database Successfully".bgCyan.white);
  } catch (error) {
    console.log(error);
  }
};

export default mongoDb;
