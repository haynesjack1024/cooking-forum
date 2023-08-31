import mongoose from "mongoose";

async function getConnection() {
  if (mongoose.connection.readyState > 0) {
    return mongoose;
  } else {
    return await mongoose.connect(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@127.0.0.1:27017`
    );
  }
}

export default await getConnection();
