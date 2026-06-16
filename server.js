const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// --- In-memory storage ---
const roomsData = {};   // roomCode -> { text: string }
const roomClients = {};  // roomCode -> Set<ws>

// --- Static files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- WebSocket handling ---
wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    const { type, room, text } = msg;

    // --- Join a room ---
    if (type === 'join' && room) {
      // Leave previous room if any
      if (currentRoom && roomClients[currentRoom]) {
        roomClients[currentRoom].delete(ws);
        if (roomClients[currentRoom].size === 0) {
          delete roomClients[currentRoom];
        }
      }

      currentRoom = room;

      if (!roomsData[currentRoom]) {
        roomsData[currentRoom] = { text: '' };
      }
      if (!roomClients[currentRoom]) {
        roomClients[currentRoom] = new Set();
      }
      roomClients[currentRoom].add(ws);

      // Send current room content + client count
      ws.send(JSON.stringify({
        type: 'init',
        text: roomsData[currentRoom].text,
        clients: roomClients[currentRoom].size,
      }));

      // Notify others of updated client count
      broadcastClientCount(currentRoom);
    }

    // --- Text update ---
    if (type === 'update' && currentRoom && text !== undefined) {
      roomsData[currentRoom].text = text;

      // Broadcast to all OTHER clients in the room
      for (const client of roomClients[currentRoom] || []) {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify({ type: 'update', text }));
        }
      }
    }

    // --- Clear ---
    if (type === 'clear' && currentRoom) {
      roomsData[currentRoom].text = '';

      for (const client of roomClients[currentRoom] || []) {
        client.send(JSON.stringify({ type: 'update', text: '' }));
      }
    }
  });

  ws.on('close', () => {
    if (currentRoom && roomClients[currentRoom]) {
      roomClients[currentRoom].delete(ws);
      broadcastClientCount(currentRoom);
      if (roomClients[currentRoom].size === 0) {
        delete roomClients[currentRoom];
        // Optional: keep roomsData for reconnection, or delete:
        // delete roomsData[currentRoom];
      }
    }
  });
});

function broadcastClientCount(room) {
  const count = roomClients[room]?.size || 0;
  for (const client of roomClients[room] || []) {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'clients', clients: count }));
    }
  }
}

// --- Start ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✓ Server running → http://localhost:${PORT}`);
});
