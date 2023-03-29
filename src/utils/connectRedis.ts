import { createClient } from "redis";

const redisUrl = "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    await redisClient.set("try", "Hello Welcome to Express with TypeORM");
  } catch (error) {
    console.log(error);
  }
};

connectRedis()
  .then(() => {
    console.log("Redis client connected");
  })
  .catch((error) => {
    console.log(error);
  });

export default redisClient;
