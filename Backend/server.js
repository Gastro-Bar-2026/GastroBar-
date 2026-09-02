const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Simulamos una "base de datos" temporal con un arreglo
const usuarios = [];

app.get('/', (req, res) => {
  res.send('Servidor de GastroBar funcionando');
});

// Registro de usuario
app.post('/register', (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan datos: nombre, correo o contraseña' });
  }

  const existe = usuarios.find(u => u.correo === correo);
  if (existe) {
    return res.status(400).json({ mensaje: 'Ese correo ya está registrado' });
  }

  usuarios.push({ nombre, correo, contraseña });
  res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
});

// Login
app.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  const usuario = usuarios.find(u => u.correo === correo && u.contraseña === contraseña);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  res.json({ mensaje: `Bienvenido, ${usuario.nombre}` });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});