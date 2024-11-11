const fs = require('fs');
const io = require('socket.io-client');

// Connect to the Express Socket.IO server
const socket = io('http://localhost:3000');

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
}

socket.on('connect', () => {
    console.log('Connected to server', socket.id);
});

socket.on('info', (data) => {
    console.log(data);
});

socket.on('sendata', (data) => {
    console.log(data);
});

// Event handler for incoming messages
socket.on('message', (data) => {
    console.log('Message from server:', data);
});

socket.on('replyback', (data) => {
    console.log('data:', data);
});

// Event handler for disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
