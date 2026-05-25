import http from "node:http";
import { logger } from "@repo/logger";
import { app as expressApplication } from "./server";
import { connectRedis, disconnectRedis } from "@repo/redis";

import { env } from "./env";

async function init() {

  try {
    const server = http.createServer(expressApplication);
    const PORT: number = env.PORT ? +env.PORT : 8000;

    await connectRedis();

    server.listen(PORT, () => {
      logger.info(`http server is running on PORT ${PORT}`);
    });

    process.on("SIGINT", async () => {
      await disconnectRedis();
      process.exit(0);
    });
    
  } catch (err) {
    logger.error(`Error creating http server`, { err });
    process.exit(1);
  }
}

init();
