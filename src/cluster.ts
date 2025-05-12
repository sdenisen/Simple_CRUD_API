import {requestListener} from "./listener";
import {createServer} from "http";
import cluster from "node:cluster";
import * as os from "os";
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const numCPUs = os.cpus().length - 1;

if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({PORT: PORT + i});
    }
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} exited`);
        cluster.fork(); // Restart on exit
    });
} else {
    const server = createServer(requestListener);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}