// Importar los paquetes necesarios
import express from "express";
import Jimp from "jimp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// Crea una instancia de Express
const app = express();
// Define el puerto en el que la aplicación escuchará
const port = 3000;

// Para manejar correctamente las rutas de archivos estáticos y __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para analizar cuerpos de solicitud en formato URL-encoded
app.use(express.urlencoded({ extended: true }));

// Servir formulario HTML en GET /imagen
app.get("/imagen", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Crear una ruta raíz POST /
app.post("/imagen", async (req, res) => {
  // Define el tipo de contenido de la respuesta
  res.setHeader("Content-Type", "image/jpg");

  // Generar un identificador único para la imagen
    const imgId = uuidv4().slice(30);

  try {
    // Leer y procesar la imagen
    const imagen = await Jimp.read(
      "https://expresswriters.com/wp-content/uploads/2014/06/grumpy-cat-copywriting-450x450.jpg"
    );
    await imagen
    // Cambia el tamaño de la imagen a 500px de ancho y alto automático
      .resize(500, Jimp.AUTO)
      // Aplica el filtro escala de grises
      .greyscale()
      // Guarda la imagen procesada con un identificador aleatorio, más la extensión.jpg
      .writeAsync(`${imgId}.jpg`);

    // Enviar la imagen como respuesta
    fs.readFile(`${imgId}.jpg`, (err, data) => {
      if (err) throw err; // Manejar el error al leer el archivo
      res.end(data); // Concluye la consulta enviando los datos de la imagen
    });
  } catch (error) {
    console.error("Error procesando la imagen:", error);
    res.status(500).send("Error al procesar la imagen");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${port}, ${process.pid}`
  );
});
