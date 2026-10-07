import { ObjectId } from "mongodb";
import notebookService from "../services/notebookService.js";

const getAllNotebooks = async (req, res) => {
    try {
        const notebooks = await notebookService.getAll();
        res.status(200).json({ notebooks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const createNotebook = async (req, res) => {
    try {
        const { numero, aluno } = req.body;
        await notebookService.Create(numero, aluno);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const deleteNotebook = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.sendStatus(400);
        }
        await notebookService.Delete(id);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const updateNotebook = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.sendStatus(400);
        }
        const { numero, aluno } = req.body;
        const notebook = await notebookService.Update(id, numero, aluno);
        res.status(200).json({ notebook });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export default {
    getAllNotebooks,
    createNotebook,
    deleteNotebook,
    updateNotebook
};
