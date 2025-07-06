const express = require('express');
const Tarea = require('../models/Tarea');

const router = express.Router();

router.get('/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find({});
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});


module.exports = router;