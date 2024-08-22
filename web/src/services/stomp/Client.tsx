import { Client } from "@stomp/stompjs";

// Note:
// This module defines a global variable to store the STOMP client instance.
// Not a good way to implemenet. Ideally, we should use a context to store
// the STOMP client instance.

interface StompClientProps {
    client: Client | undefined;
}
const stompClient: StompClientProps = { client: undefined };

export function getStompClient(): Client | undefined {
    return stompClient.client;
}

export function initStompClient(onConnect: () => void) {
    if (stompClient.client !== undefined) {
        return;
    }
    const client = new Client({
        brokerURL: 'ws://' + (process.env.BACKEND_URL ?? 'localhost:8080') + '/backend-ws',
        onConnect
    });
    client.activate();

    stompClient.client = client;
}