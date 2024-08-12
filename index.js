const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

// CORS 미들웨어 설정
app.use(cors());

// Socket.IO 서버 설정 (CORS 옵션 포함)
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // 클라이언트의 주소
//     methods: ["GET", "POST"],
//     // allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
// });
const io = new Server(server, {
  cors: {
    origin: "https://port-next-restaurant-system-ac2nlleg71ut.sel3.cloudtype.app", // 클라이언트의 주소
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  // console.log("New client connected");
  // console.log("Handshake data:", socket.handshake);

  const restaurantId = socket.handshake.query.restaurantId;
  console.log("Restaurant ID:", restaurantId);

  if (!restaurantId) {
    console.error("No restaurantId provided");
    return;
  }

  socket.join(restaurantId);

  socket.on("newOrder", (data, callback) => {
    console.log("Received new order:", data);
    // 주문 처리 로직
    // ...

    // 클라이언트에 응답
    if (typeof callback === "function") {
      // console.log("Sending acknowledgment to client");
      callback({ success: true, message: "주문이 성공적으로 처리되었습니다." });
      // console.log("Acknowledgment sent");
    } else {
      // console.log("Callback is not a function:", typeof callback);
    }

    // 주문한 클라이언트에게 추가 정보 전송 (선택적)
    socket.emit("orderConfirmation", {
      message: "주문이 접수되었습니다. 곧 처리하겠습니다.",
    });
    // console.log("Order processing completed");
    // 같은 레스토랑의 다른 클라이언트들에게 새 주문 알림
    io.to(data.restaurantId).emit("newOrder", data);
  });

  socket.on("newQuickOrder", (data, callback) => {
    console.log("Received new quick order:", data);
    // 주문 처리 로직
    // ...

    // 클라이언트에 응답
    if (typeof callback === "function") {
      // console.log("Sending acknowledgment to client");
      callback({ success: true, message: "주문이 성공적으로 처리되었습니다." });
      // console.log("Acknowledgment sent");
    } else {
      // console.log("Callback is not a function:", typeof callback);
    }

    // 주문한 클라이언트에게 추가 정보 전송 (선택적)
    socket.emit("orderConfirmation", {
      message: "주문이 접수되었습니다. 곧 처리하겠습니다.",
    });
    // console.log("Order processing completed");
    // 같은 레스토랑의 다른 클라이언트들에게 새 주문 알림
    io.to(data.restaurantId).emit("newQuickOrder", data);
  });

  socket.on("statusUpdate", (data) => {
    // console.log("Received status update:", data);
    io.to(data.restaurantId).emit("statusUpdate", data);
  });

  socket.on("tableReset", (data) => {
    // console.log("Received table reset:", data);
    io.to(data.restaurantId).emit("tableReset", data.tableId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//////////////////////////// API Routes////////////////////////////////
// app.get('/api/menu', (req, res) => {
//   const { restaurantId } = req.query;
//   // Here you would typically fetch the menu from a database
//   const menu = [
//     { id: 1, name: '햄버거', price: 5000 },
//     { id: 2, name: '피자', price: 12000 },
//     { id: 3, name: '파스타', price: 8000 },
//     { id: 4, name: '샐러드', price: 6000 },
//   ];
//   res.json(menu);
// });

// app.get('/api/tables', (req, res) => {
//   const { restaurantId } = req.query;
//   // Here you would typically fetch tables from a database
//   const tables = [
//     { id: 1, tableNumber: 1, x: 50, y: 50, width: 100, height: 100, rotation: 0, status: "empty" },
//     { id: 2, tableNumber: 2, x: 200, y: 50, width: 100, height: 100, rotation: 0, status: "empty" },
//     { id: 3, tableNumber: 3, x: 350, y: 50, width: 100, height: 100, rotation: 0, status: "empty" },
//     { id: 4, tableNumber: 4, x: 50, y: 200, width: 100, height: 100, rotation: 0, status: "empty" },
//     { id: 5, tableNumber: 5, x: 200, y: 200, width: 100, height: 100, rotation: 0, status: "empty" },
//     { id: 6, tableNumber: 6, x: 350, y: 200, width: 100, height: 100, rotation: 0, status: "empty" },
//   ];
//   res.json(tables);
// });

// app.post('/api/tables', (req, res) => {
//   const { restaurantId, tables } = req.body;
//   // Here you would typically save the tables to a database
//   console.log(`Saving tables for restaurant ${restaurantId}:`, tables);
//   res.json(tables);
// });

// app.put('/api/tables', (req, res) => {
//   const { restaurantId, tables } = req.body;
//   // Here you would typically update the tables in a database
//   console.log(`Updating tables for restaurant ${restaurantId}:`, tables);
//   res.json(tables);
// });

// app.post('/api/tables/:tableId/reset', (req, res) => {
//   const { tableId } = req.params;
//   // Here you would typically reset the table in a database
//   console.log(`Resetting table ${tableId}`);
//   res.json({ message: 'Table reset successfully' });
// });

// app.patch('/api/orders/:tableId/status', (req, res) => {
//   const { tableId } = req.params;
//   const { status } = req.body;
//   // Here you would typically update the order status in a database
//   console.log(`Updating order status for table ${tableId} to ${status}`);
//   res.json({ message: 'Order status updated successfully' });
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
