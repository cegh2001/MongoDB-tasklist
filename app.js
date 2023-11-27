const express = require ("express");
const app = express();
const listViewRouter = require("./src/routes/list-view-router");
const listEditRouter = require("./src/routes/list-edit-router");
const dotenv = require ("dotenv");
const jwt = require ("jsonwebtoken");
const connectDB = require("./src/db");
const UserModel = require("./src/models/userModel");

dotenv.config();
const port = process.env.PORT;
const secret = process.env.SECRET_KEY;

const instr = [
  {
    instruccion:
      "Accede a la ruta login para autenticarte, luego usa task para ver las tareas, y a list-edit o list-view para modificar las tareas o verlas filtradas",
  },
];

app.use(express.json());

//middleware para verificar que solo lleguen solicitudes por métodos HTTP válidos
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
    return res.status(400).json({ error: "Método HTTP no válido" });
  }
  next();
});

const JWTValidation = (req, res, next) => {
  // Extraemos el token del encabezado de la solicitud
  const token = req.headers.authorization;

  // Intentamos decodificar el token
  try {
    const decoded = jwt.verify(token, secret);

    // Verificamos el rol del usuario
    const role = decoded.role;
    req.role = role;

    // Continuamos con la ejecución del middleware
    next();
  } catch (error) {
    // Si el token no es válido, enviamos un error
    res.json({ error: error.message });
  }
};

// Ruta de autenticación
app.post("/login", async (req, res) => {
  try {
    await connectDB();  
    const email = req.body.email;

    // Verificar si el usuario existe
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid user name or password" });
    }

    const payload = {
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Firmar un token JWT
    const token = jwt.sign(payload, secret, { algorithm: "HS256" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error al autenticar usuario", details: error.message });
  }
});

// Ruta de instrucciones
app.get("/", (req, res) => {
  res.status(200).json(instr);
});

// Usar el router de list-view en la ruta /list-view
app.use("/list-view", JWTValidation ,listViewRouter);

// Usar el router de list-edit en la ruta /list-edit
app.use("/list-edit", JWTValidation, listEditRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});