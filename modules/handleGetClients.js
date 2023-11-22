import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

export const handleGetClients = async (response, request, ticketNumber) => {
    try {
        const clientsData = await fs.readFile(CLIENTS, "utf-8");
        const clients = JSON.parse(clientsData);

        const client = clients.find(item => item.ticketNumber === ticketNumber);
        if (!client) {
            sendError(response, 404, 'Client not found');
            return;
        }

        sendData(response, client);

    } catch (error) {
        console.error(`Response error ${error}`);
        sendError(res, 500, 'Server request error');
    }
}