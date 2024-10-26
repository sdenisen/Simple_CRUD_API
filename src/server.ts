import {requestListener} from "./listener"
import {IncomingMessage, ServerResponse, createServer} from "http";

const server = createServer(requestListener);
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});