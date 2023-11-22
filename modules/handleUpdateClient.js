import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from 'node:fs/promises';

export const handleUpdateClient = (request, response, urlSegments) => {
    let body = "";
    const ticketNumber = urlSegments[1];
    console.log('ticketNumber: ', ticketNumber);
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
            const updatedClient = JSON.parse(body);

            if (!updatedClient.fullName || !updatedClient.phone || !updatedClient.ticketNumber || !updatedClient.booking) {
                sendError(response, 400, "Incorrect data. Please check input fields");
                return;
            }

                if (
                    updatedClient.booking &&
                    (!updatedClient.booking.length  ||
                    !Array.isArray(updatedClient.booking) ||
                    !updatedClient.booking.every((item) => item.comedian && item.time))
                ) {
                    sendError(response, 400, "Please fill all fields correctly");
                    return;
                }

            const clientsData = await fs.readFile(CLIENTS, "utf-8");
            const clients = JSON.parse(clientsData);

            const clientIndex = clients.findIndex(client => client.ticketNumber === ticketNumber);

            if (clientIndex === -1) {
                sendError(response, 404, "Client not found");
                return;
            }
            clients[clientIndex] = {
                ...clients[clientIndex], 
                ...updatedClient
            }


            await fs.writeFile(CLIENTS, JSON.stringify(clients));
            sendData(response, clients[clientIndex]);

        } catch (error) {
            console.error(`error: ${error}`);
            sendError(response, 500, "Server data update error");
        }
    })
}