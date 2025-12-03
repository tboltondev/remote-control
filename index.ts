import HomePage from './index.html';
import Remote from './remote.html';

const clients = [];

const server = Bun.serve({
    routes: {
        "/": HomePage,
        "/remote": Remote,
        "/ws": (req, server) => {
            if (server.upgrade(req)) {
                return;
            }

            return Response.json({ error: "Upgrade failed" }, { status: 500 });
        },
    },
    websocket: {
        open(ws) {
            clients.push(ws);
            console.log(`Websocket opened: ${ws}`);
        },
        message(ws, message) {
            console.log({ message });

            clients.forEach((client) => {
                client.send(message);
            })

            // ws.send(message);
            // ws.publish("from_remote", message);
        },
        drain(ws) {},
        close(ws, code, message) {},
    },
});

console.log(`Server running at ${server.url}`);
