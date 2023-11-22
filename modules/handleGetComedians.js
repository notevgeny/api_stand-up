import { sendData, sendError } from "./send.js";

export const handleGetComedians = async (response, request, comedians, urlSegments) => {

    if (urlSegments.length === 2) {
        const comedian = comedians.find(comic => comic.id === urlSegments[1]);

        if (!comedian) {
            sendError(response, 404, 'Comedian not found!')
            return;
        }

        sendData(response, comedian);
        return;
    }
    sendData(response, comedians);
}