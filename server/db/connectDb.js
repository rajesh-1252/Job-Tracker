import mongoose, { connect } from "mongoose";

const connectDb = async (connectionString) => {
  mongoose.set("strictQuery", false);
  await connect(connectionString);
};

export default connectDb;
