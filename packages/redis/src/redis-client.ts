import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'hhadv0pAXU3mMmxkIXJcrkzJ9uyk3yhx',
    socket: {
        host: 'redis-14666.crce300.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 14666
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("Redis Connected");
  }
}

export async function disconnectRedis() {
  if (client.isOpen) {
    await client.disconnect();
    console.log("Redis Disconnected");
  }
};
