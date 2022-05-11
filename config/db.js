import mongoose from "mongoose";
import dotenv from "dotenv";

//for accessing the .env file
dotenv.config();

const { connect } = mongoose;

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Mongo DB connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error} `);
    process.exit(1);
  }
};

export default connectDB;
