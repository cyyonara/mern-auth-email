import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN_STRING as string);
    console.log('connected to mongo database!');
  } catch (error: any) {
    console.log(process.env.NODE_ENV === 'PROD' ? error.message : error.stack.toString());
  }
};

export default dbConnect;
