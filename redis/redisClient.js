const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  legacyMode: true, // required for connect-redis v6
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 2000), // retry logic
    connectTimeout: 10000, // timeout after 10s
  },
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

module.exports = { redisClient };
