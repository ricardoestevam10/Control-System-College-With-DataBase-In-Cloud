import express from "express"

const notebookRoutes = express.Router();

import notebookController from "../controller/notebookController.js";

notebookRoutes.get("/notebook", notebookController.getAllNotebooks);
notebookRoutes.post("/notebook", notebookController.createNotebook);
notebookRoutes.post("/notebook/:id", notebookController.updateNotebook);
notebookRoutes.delete("/notebook/:id", notebookController.deleteNotebook);

export default notebookRoutes;