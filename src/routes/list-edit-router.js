const express = require("express");
const listEditRouter = express.Router();
const CRUD = require("../controllers/taskController");

const instr = [
  {
    instruccion:
      "Accede a la ruta create-task, delete-task o update-task para crear, eliminar o actualizar una tarea (en estos casos usa parametros por id)",
  },
];

// Middleware de autorización
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.role)) {
      next();
    } else {
      res.status(403).json({ error: "Access not allowed" });
    }
  };
};

// Middleware para manejar los errores de solicitud POST y PUT
const validateRequestBody = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Cuerpo de solicitud vacío" });
    } else {
      const requiredAttributes = ["description", "completed"];
      for (const attr of requiredAttributes) {
        if (!(attr in req.body)) {
          return res.status(400).json({ error: `Falta el atributo: ${attr}` });
        }
      }
    }
  }
  next();
};

// Rutas con middleware de autorización y validación de cuerpo de solicitud
listEditRouter.use(validateRequestBody);

listEditRouter.get("/", authorize(["admin", "user"]), (req, res) => {
  res.status(200).json(instr);
});

listEditRouter.post(
  "/create-task",
  authorize(["admin", "user"]),
  async (req, res) => {
    const newTaskData = req.body;
    try {
      const newTask = await CRUD.createTask(newTaskData);
      res.status(201).json(newTask);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al crear la tarea", details: error.message });
    }
  }
);

listEditRouter.get("/delete-task", authorize(["admin"]), (req, res) => {
  res.status(200).json("usa los parametros por id");
});

listEditRouter.delete(
  "/delete-task/:id",
  authorize(["admin"]),
  async (req, res) => {
    const taskId = req.params.id;
    try {
      const result = await CRUD.deleteTaskById(taskId);
      if (result.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).send("Tarea no encontrada");
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al eliminar la tarea", details: error.message });
    }
  }
);

listEditRouter.get("/update-task", authorize(["admin"]), (req, res) => {
  res.status(200).json("usa los parametros por id");
});

listEditRouter.put(
  "/update-task/:id",
  authorize(["admin"]),
  async (req, res) => {
    const taskId = req.params.id;
    const updatedTaskData = req.body;
    try {
      const result = await CRUD.updateTask(taskId, updatedTaskData);
      if (result.nModified > 0) {
        const updatedTask = await CRUD.findTaskById(taskId);
        res.status(200).json(updatedTask);
      } else {
        res.status(404).send("Tarea no encontrada");
      }
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error al actualizar la tarea",
          details: error.message,
        });
    }
  }
);

module.exports = listEditRouter;
