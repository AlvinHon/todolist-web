import { Client } from "@stomp/stompjs";

const stompClients: Client[] = [];

export function getStompClient(): Client | undefined {
    if (stompClients.length === 0) {
        return undefined;
    }
    return stompClients[0];
}

export function initStompClient(onConnect: () => void) {
    if (stompClients.length > 0) {
        return;
    }
    const client = new Client({
        brokerURL: 'ws://' + (process.env.BACKEND_URL ?? 'localhost:8080') + '/backend-ws',
        onConnect
    });
    client.activate();

    stompClients.push(client);
}
