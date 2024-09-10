import { startServer } from "./server.js";
import { initMongoDB } from "./db/init.MongoDB.js";

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
