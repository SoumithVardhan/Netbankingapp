import Redis from "ioredis";
import * as dotenv from "dotenv";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './../../.env') }); // Correct path

console.log("redis", process.env.REDIS_URL);

export const jobQueue = new Redis(process.env.REDIS_URL!);
export const pub = new Redis(process.env.REDIS_URL!);
export const sub = new Redis(process.env.REDIS_URL!);

jobQueue.on('error', (err) => console.error('jobQueue Redis Client Error', err));
pub.on('error', (err) => console.error('pub Redis Client Error', err));
sub.on('error', (err) => console.error('sub Redis Client Error', err));

jobQueue.on('connect', () => {
    console.log('Job queue Connected to Redis');
});
pub.on('connect', () => {
    console.log('Publisher Connected to Redis');
});
sub.on('connect', () => {
    console.log('Subscriber Connected to Redis');
});
