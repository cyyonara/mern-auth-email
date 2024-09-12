import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
  },
});

export const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log('connected to redis!');
  } catch (err) {
    console.log(err);
  }
};
