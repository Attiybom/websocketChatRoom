const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Setting up the WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('A new client connected!');

    ws.on('message', function incoming(message) {
        console.log('Received: %s', message);
        // Broadcast the message to all connected clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send('Broadcast: ' + message);
            }
        });
    });

    ws.on('close', () => {
        console.log('A client has disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
