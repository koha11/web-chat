const express = require('express');
const route = require('./routes');
const path = require('path');
const http = require('http');
const cors = require('cors');

//database
const db = require('./config/database');

// websocket
const setupWebSocket = require('./services/websocketService');

//middleware
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const authJwt = require('./config/auth');

//khoi tao server
const app = express();

const server = http.createServer(app);

//khoi tao server socket
setupWebSocket(server);

// xu li file tinh
app.use(
  express.static(path.join(__dirname.slice(0, __dirname.length - 4), 'public'))
);

app.use(express.static('node_modules'));

// Cấu hình Pug
app.set('view engine', 'pug'); // Sử dụng Pug làm template engine
app.set('views', path.join(__dirname, 'views')); // Thư mục chứa file Pug

//xu li du lieu tu form (dua vao middleware duoc xay dung san cua express js)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware giup ghi de` cac phthuc khac len pthuc post hoac get cua form
app.use(methodOverride('_method'));

//middleware giup giai ma cookies
app.use(cookieParser());

// middleware cho phép CORS từ frontend (React)
app.use(
  cors({
    origin: 'http://localhost:5173', // Chỉ cho phép từ frontend này
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Nếu có sử dụng cookies/session
  })
);

//ket noi va khoi tao db
db.connect();

// Init route
route(app);

server.listen(process.env.APP_PORT, () =>
  console.log(`Listening ${process.env.APP_HOST}:${process.env.APP_PORT}`)
);
