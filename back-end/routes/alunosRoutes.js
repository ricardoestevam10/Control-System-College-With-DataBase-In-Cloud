import express from "express";
import alunoController from "../controller/alunoController.js";

const alunoRoutes = express.Router();

// Endpoint para cadastrar um aluno
alunoRoutes.post("/aluno", alunoController.createAluno);

// Endpoint para listar todos os alunos
alunoRoutes.get("/alunos", alunoController.getAllAlunos);

// Endpoint para atualizar um aluno pelo ID
alunoRoutes.put("/aluno/:id", alunoController.updateAluno);

// Endpoint para deletar um aluno pelo ID
alunoRoutes.delete("/aluno/:id", alunoController.deleteAluno);

export default alunoRoutes;