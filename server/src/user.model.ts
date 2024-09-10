import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

type TUser = mongoose.InferSchemaType<typeof userSchema>;

const User = mongoose.model<TUser>('User', userSchema);

export default User;
