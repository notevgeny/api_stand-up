import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from 'node:fs/promises';

export const handleAddClient = (request, response) => {
    let body = "";
    try {
        request.on("data", (chunk) => {
            body += chunk;
        });
        
    } catch (error) {
        console.log('Error on reading request');
        sendError(response, 500, "Server error on reading request");
        return;
    }

    request.on("end", async () => {
        try {
            const newClient = JSON.parse(body);

            if (!newClient.fullName || !newClient.phone || !newClient.ticketNumber || !newClient.booking) {
                sendError(response, 400, "Incorrect data. Please check input fields");
                return;
            }

                if (
                    newClient.booking &&
                    (!newClient.booking.length  ||
                    !Array.isArray(newClient.booking) ||
                    !newClient.booking.every((item) => item.comedian && item.time))
                ) {
                    sendError(response, 400, "Please fill all fields correctly");
                    return;
                }

            const clientsData = await fs.readFile(CLIENTS, "utf-8");
            const clients = JSON.parse(clientsData);
            clients.push(newClient);
            await fs.writeFile(CLIENTS, JSON.stringify(clients));
            sendData(response, newClient);

        } catch (error) {
            console.log('error', error);
        }
    })
}