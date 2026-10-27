import alunoService from "../services/alunoService.js";

const createAluno = async (req, res) => {
    try { 
        // Adicionado 'temAcesso' recebido do formulário front-end
        const { nome, RA, sala, ano, temAcesso } = req.body;

        // Repassando 'temAcesso' para o service criar o registro no banco
        await alunoService.Create(nome, RA, sala, ano, temAcesso);
        
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
        const { id } = req.params; 
        // Adicionado também o 'temAcesso' aqui para manter a consistência dos dados ao atualizar
        const { nome, RA, sala, ano, atividadeEntregue, temAcesso } = req.body;

        // Passando todos os parâmetros atualizados para o seu service
        await alunoService.update(id, nome, RA, sala, ano, atividadeEntregue, temAcesso); 

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
