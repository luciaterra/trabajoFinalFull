const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); 

connectDB();

const tareaRoutes = require('./routes/tareaRoutes');
app.use('/api', tareaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB Atlas');
});


