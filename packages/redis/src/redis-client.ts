import { createClient } from 'redis';

export const client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined
    }
});

client.on('error', err => console.error('Redis Client Error', err));

export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.info("Redis Connected");
  }
}

export async function disconnectRedis() {
  if (client.isOpen) {
    await client.disconnect();
    console.info("Redis Disconnected");
  }
};
