const connectDB = require("./src/db");
const TaskModel = require("./src/models/taskModel");

// Función para crear tareas
async function createTask(task) {
  try {
    await connectDB();
    const result = await TaskModel.create(task);
    return result;
  } catch (error) {
    return error;
  }
}

// Función para encontrar todas las tareas
async function findTasks() {
  try {
    await connectDB();
    const result = await TaskModel.find();
    return result;
  } catch (error) {
    return error;
  }
}

// Función para encontrar tareas por ID
async function findTaskById(id) {
  try {
    await connectDB();
    const result = await TaskModel.findById(id);
    return result;
  } catch (error) {
    return error;
  }
}

// Función para borrar una tarea por ID
async function deleteTaskById(id) {
  try {
    await connectDB();
    const result = await TaskModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    return error;
  }
}

// Función para actualizar una tarea por ID
async function updateTask(id, data) {
  try {
    await connectDB();
    const result = await TaskModel.updateOne({ _id: id }, { $set: data });
    return result;
  } catch (error) {
    return error;
  }
}

// Función para encontrar tareas completadas
async function findCompletedTasks() {
  try {
    await connectDB();
    const completedTasks = await TaskModel.find({ completed: true });
    return completedTasks;
  } catch (error) {
    return error;
  }
}

// Función para encontrar tareas incompletas
async function findIncompleteTasks() {
  try {
    await connectDB();
    const incompleteTasks = await TaskModel.find({ completed: false });
    return incompleteTasks;
  } catch (error) {
    return error;
  }
}

const CRUD = {
  createTask,
  findTasks,
  findTaskById,
  deleteTaskById,
  updateTask,
  findCompletedTasks,
  findIncompleteTasks,
};

module.exports = CRUD;
