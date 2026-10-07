import alunoService from "../services/alunoService.js";

const createAluno = async (req, res) => {
    try { 
        const { nome, RA, sala, ano } = req.body;

        await alunoService.Create(nome, RA, sala, ano);
        
        console.log("Novo aluno Criado");
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

const getAllAlunos = async (req, res) => {
    try {
        const alunos = await alunoService.getAll();
         
        res.status(200).json({ alunos: alunos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

const updateAluno = async (req, res) => {
    try {
        const { id } = req.params; // Ou req.body, dependendo de como você recebe o ID
        const { nome, RA, sala, ano } = req.body;

        await alunoService.update(id, nome, RA, sala, ano); // Certifique-se de que a função 'update' existe no service

        console.log(`Aluno com ID ${id} atualizado`);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

const deleteAluno = async (req, res) => {
    try {
        const { id } = req.params; 

        await alunoService.delete(id); 

        console.log(`Aluno com ID ${id} apagado`);
        res.sendStatus(204); 
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export default { createAluno, getAllAlunos, updateAluno, deleteAluno };