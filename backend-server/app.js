const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static(path.resolve(__dirname, 'public'), { 'extensions': ['html', 'js', 'css'] }));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
}
const img = base64_encode('./public/resource/Arc_Reactor_baseColor.png');

let connections = [];

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    // connections.push(socket.id);
    // console.table(connections);

    socket.on('user_info', (data) => {
        const userObject = {
            username: data.username, 
            socketId: socket.id
        };
        connections.push(userObject);
        console.table(connections);
        io.emit('server_info', JSON.stringify({ servername: 'mainserver' }));
    });

    socket.on('message', (msg) => {
        console.log('Message received: ', msg);
        io.emit('message', JSON.stringify({ message: Math.floor(Math.random() * 10000000) }));
    });

    socket.on('reply', (data) => {
        console.log('data:', data);
        io.emit('reply', JSON.stringify({ message: Math.floor(Math.random() * 10000000) }));
    });

    socket.on('replyback', (data) => {
        console.log('data:', data);
        io.to(connections[0]).emit('replyback', JSON.stringify({ message: Math.floor(Math.random() * 10000000) }));
    });

    socket.on('image', (data) => {
        console.log(data);
    });

    socket.on('send_to_user', (data) => {
        const targetUser = connections.find((conn) => conn.username === data.targetUsername);

        if (targetUser) {
            io.to(targetUser.socketId).emit('receive_message', {
                sender: data.senderUsername,
                message: data.message
            });
            console.log(`Message sent to ${data.targetUsername}`);
        } else {
            console.log(`User ${data.targetUsername} not found.`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        const findindex = connections.findIndex((conn) => conn.id === socket.id);
        connections.splice(findindex, 1);
        // console.table(connections);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});