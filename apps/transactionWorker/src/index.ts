 
 
import dotenv from 'dotenv'
import { startWebSocketServer } from "./websocket-server";
import { processRampJobs  } from "./jobProccessor";
import express from 'express'
import cors from 'cors'
 
dotenv.config({ path: "./../../.env " })
export const SECRET = process.env.JWT_SECRET;
export const WEBSOCKET_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT ;
export const REDIS_URL = process.env.REDIS_URL;
export const WEBHOOK_URL = process.env.WEBHOOK_URL;
 
const app = express()
app.use(cors())
const httpServer = app.listen(WEBSOCKET_SERVER_PORT, () => {
    console.log(`WebSocket server running on port ${WEBSOCKET_SERVER_PORT}`);
});
startWebSocketServer(httpServer);
processRampJobs()