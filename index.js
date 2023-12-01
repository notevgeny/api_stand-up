import http from "node:http";
import fs from "node:fs/promises";
import { sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleGetComedians } from "./modules/handleGetComedians.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleGetClients } from "./modules/handleGetClients.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';


const startServer = async () => {
    if (!(await checkFile(COMEDIANS))) {
        return;
    }

    await checkFile(CLIENTS, true);

    const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
    const comedians = JSON.parse(comediansData);

    http
    .createServer(async (request, response) => {
        try {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type");

            if (request.method === 'OPTIONS') {
                response.writeHead(204);
                response.end();
                return;
            }
            
            const urlSegments = request.url.split('/').filter(Boolean);

            if (request.method === "GET" && urlSegments[0] === 'comedians'){
                handleGetComedians(response, request, comedians, urlSegments);
                return;
            }

            if (request.method === "POST" && urlSegments[0] === 'clients') {
                handleAddClient(request, response);
                return;
            }

            if (request.method === 'GET' && urlSegments[0] === 'clients' && urlSegments.length === 2) {
                const ticketNumber = urlSegments[1];
                handleGetClients(response, request, ticketNumber);
                return;
            }

            if (request.method === 'PATCH' && urlSegments[0] === 'clients' && urlSegments.length === 2) {
                handleUpdateClient(request, response, urlSegments);
                return;
            }

            sendError(response, 404, 'Not found')

        } catch (error) {
            sendError(response, 500, `Server error: ${error}`);
        }
            
        
    })
    .listen(PORT);

    console.log(`Server is running on http://localhost:${PORT}`);
}

startServer();


