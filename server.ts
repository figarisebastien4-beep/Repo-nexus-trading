import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Real-time racing state
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { players: {} });
      }
      rooms.get(roomId).players[socket.id] = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        speed: 0,
        id: socket.id
      };
      
      io.to(roomId).emit("room-update", rooms.get(roomId));
    });

    socket.on("update-state", ({ roomId, state }) => {
      if (rooms.has(roomId)) {
        rooms.get(roomId).players[socket.id] = {
          ...rooms.get(roomId).players[socket.id],
          ...state
        };
        socket.to(roomId).emit("player-moved", { id: socket.id, ...state });
      }
    });

    socket.on("chat-message", ({ roomId, message }) => {
      io.to(roomId).emit("new-message", message);
    });

    socket.on("disconnect", () => {
      for (const [roomId, room] of rooms.entries()) {
        if (room.players[socket.id]) {
          delete room.players[socket.id];
          io.to(roomId).emit("player-disconnected", socket.id);
          if (Object.keys(room.players).length === 0) {
            rooms.delete(roomId);
          }
        }
      }
    });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
