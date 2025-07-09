//backend/server.js
import cors from 'cors';
import express from 'express';
import path from 'path';
import morgan from "morgan";
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import errorHandler from "./middleware/errorHandler.js";
import libroRoutes from "./routes/libros.routes.js";
import ventaRoutes from './routes/ventaRoutes.js';


const  app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/libro.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/libro.html'));
});



app.use('/api', authRoutes);
// Rutas API
app.use("/api/libros", libroRoutes);


// Middleware de errores
app.use(errorHandler);

app.use('/api/ventas', ventaRoutes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});


app.get('/cliente', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/cliente.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});